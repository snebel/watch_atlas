var country_json_data = $.parseJSON(gon.country_json)

// console.log(country_json_data)

var valid_map_ids = [12, 887, 40, 36, 32, 48, 56, 76, 124, 152, 170, 203, 208, 818, 246, 250, 276, 288, 300, 344, 348, 356, 360, 372, 376, 380, 392, 400, 404, 410, 414, 458, 484, 504, 528, 578, 512, 604, 608, 616, 620, 634, 642, 643, 682, 686, 702, 703, 710, 724, 752, 756, 158, 788, 792, 800, 804, 784, 826, 840];

var width = 960,
  height = 550,
  active;

var projection = d3.geo.mercator()
  .translate([width / 2, height / 2])
  .scale((width + 1) / 2 / Math.PI)

var path = d3.geo.path()
  .projection(projection);

var svg = d3.select('#map-canvas').append('svg')
  .attr('width', width)
  .attr('height', height);

// svg.append('defs').append('path')
//   .datum({
//     type: 'Sphere'
//   })
//   .attr('id', 'sphere')
//   .attr('d', path);

svg.append('rect')
    .attr('width', width)
    .attr('height', height)
    .on('click', reset);

var g = svg.append('g');

function zoomclick(d) {

  if (active === d) return reset();
  g.selectAll('.active').classed('active', false);
  d3.select(this).classed('active', active = d);

  var b = path.bounds(d);
  g.transition().duration(750).attr('transform',
      'translate(' + projection.translate() + ')'
      + 'scale(' + .95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height) + ')'
      + 'translate(' + -(b[1][0] + b[0][0]) / 2 + ',' + -(b[1][1] + b[0][1]) / 2 + ')');


   if ( valid_map_ids.indexOf(d.id) != -1 ) {
      return tooltip
        .style('visibility', 'visible')
        // .style('top', '100px')
        // .style('left', '50px')
        .style('top', (event.pageY) +'px')
        .style('left',(event.pageX - 10) +'px')
        .html( function () { return htmlGen(d) } );
      }else{
        return tooltip
        .style('visibility', 'visible')
        .style('top', (event.pageY - 100) + 'px')
        .style('left',(event.pageX - 100) + 'px')
        .html( 'Sorry, there is no data for this country' ); 
      }

}

function reset() {
  g.selectAll('.active').classed('active', active = false);
  g.transition().duration(750).attr('transform', '');
}



var tooltip = d3.select('body')
  .append('div')
  .attr('class', 'tooltip')
  .style('position', 'absolute')
  .style('z-index', '9999')
  .style('visibility', 'hidden');


queue()
    .defer(d3.json, '/map.json')
    .await(ready);

function ready (error, world) {

  var countries = topojson.feature(world, world.objects.countries).features

  // svg.insert('path')
  //   .datum(topojson.feature(world, world.objects.land))
  //   .attr('class', 'land')
  //   .attr('d', path);

  // svg.insert('path')
  //   .datum(topojson.mesh(world, world.objects.countries, function (a, b) {
  //     return a !== b;
  //   }))
  //   .attr('class', 'boundary')
  //   .attr('d', path);

  //populate countries, give them an id, add a window box tooltip

  g.selectAll('.country')
    .data(countries)
    .enter().insert('path')
    .attr('class', 'country')
    .attr('d', path)
    // .on('click', zoomclick)
    .attr('id', function (d) {
      return 'id_' + d.id
    })
    .style('fill', '#95a5a6')
    .on('mouseover', function (d) {
       d3.select('path#id_' + d.id)
      .style('fill', 'orange')
    })
    .on('mouseout', function (d) {

      if ( valid_map_ids.indexOf(d.id) != -1 ) {
        d3.select('path#id_' + d.id)
        .style('fill', '#2c3e50')
      }else{
        d3.select('path#id_' + d.id)
        .style('fill', '#95a5a6')
      }
    })
    .on('click', zoomclick )
    

    // .on('click', function (d) { 
      
    //   if ( valid_map_ids.indexOf(d.id) != -1 ) {
    //   return tooltip
    //     .style('visibility', 'visible')
    //     .style('top', (event.pageY-10)+'px')
    //     .style('left',(event.pageX+10)+'px')
    //     .html( function () { return htmlGen(d) } ); 
    //   }else{
    //     return tooltip
    //     .style('visibility', 'visible')
    //     .style('top', (event.pageY-10)+'px')
    //     .style('left',(event.pageX+10)+'px')
    //     .html( 'Sorry, there is no data for this country' ); 
    //   }

    // });

    htmlGen = function (d) {
      for (key in country_json_data) {
        var obj = country_json_data[key]

        if (d.id === obj.map_id) {
          var contents = '<h3>' + obj.name + '</h3>';
          contents += '<ul class="box-videos">'

          obj.videos.forEach(function (v) {
            contents += '<li><img src="http://placekitten.com/40/40" style="float:left; margin:0 8px 5px 0;" /><a target="_blank" href="' + v.url + '">"' + v.title + '</a></li>'
          });
          contents += '</ul>'

          contents += '<div class="close-me">close</div>'

          return contents;
        }
      }
    }

//populate active countries with different color

  for (key in country_json_data) {
    var obj = country_json_data[key]
    // console.log(obj.map_id)
    d3.select('path#id_' + obj.map_id)
      .style('fill', '#2c3e50')
      // .attr('class', 'active-country')
      .style('cursor', 'pointer')
  }


}

// });

d3.select(self.frameElement).style('height', height + 'px');








