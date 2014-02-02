var country_json_data = $.parseJSON(gon.country_json)

var valid_map_ids = [12, 887, 40, 36, 32, 48, 56, 76, 124, 152, 170, 203, 208, 818, 246, 250, 276, 288, 300, 344, 348, 356, 360, 372, 376, 380, 392, 400, 404, 410, 414, 458, 484, 504, 528, 578, 512, 604, 608, 616, 620, 634, 642, 643, 682, 686, 702, 703, 710, 724, 752, 756, 158, 788, 792, 800, 804, 784, 826, 840]

var width = 960,
  height = 500,
  rotate = [10, -10],
  velocity = [.003, -.001],
  time = Date.now();

var projection = d3.geo.orthographic()
  .scale(240)
  .translate([width / 2, height / 2])
  .precision(.1)
  .clipAngle(90 + 1e-6)

var path = d3.geo.path()
  .projection(projection);

var graticule = d3.geo.graticule();

var svg = d3.select('.map-canvas').append('svg')
  .attr('width', width)
  .attr('height', height);

svg.append('defs').append('path')
  .datum({
    type: 'Sphere'
  })
  .attr('id', 'sphere')
  .attr('d', path);

svg.append('use')
  .attr('class', 'stroke')
  .attr('xlink:href', '#sphere');

svg.append('use')
  .attr('class', 'fill')
  .attr('xlink:href', '#sphere');

svg.append('path')
  .datum(graticule)
  .attr('class', 'graticule')
  .attr('d', path);

// svg.append("circle")
//     .attr("cx", width / 2)
//     .attr("cy", height / 2)
//     .attr("r", radius);


d3.json('/map.json', function (error, world) {

  var countries = topojson.feature(world, world.objects.countries).features

  svg.insert('path', '.graticule')
    .datum(topojson.feature(world, world.objects.land))
    .attr('class', 'land')
    .attr('d', path);

  svg.insert('path', '.graticule')
    .datum(topojson.mesh(world, world.objects.countries, function (a, b) {
      return a !== b;
    }))
    .attr('class', 'boundary')
    .attr('d', path);

  //populate countries, give them an id, add a window box tooltip

  svg.selectAll('.country')
    .data(countries)
    .enter().insert('path', '.graticule')
    .attr('class', 'country')
    .attr('d', path)
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
    .on('click', function (d) { 
      if ( valid_map_ids.indexOf(d.id) != -1 ) {
      return tooltip
        .style('visibility', 'visible')
        .style('top', (event.pageY-10)+'px')
        .style('left',(event.pageX+10)+'px')
        .html( function () { return htmlGen(d) } ); 
      }else{
        return tooltip
        .style('visibility', 'visible')
        .style('top', (event.pageY-10)+'px')
        .style('left',(event.pageX+10)+'px')
        .html( 'Sorry, there is no data for this country' ); 
      }
    });

    htmlGen = function (d) {
      for (key in country_json_data) {
        var obj = country_json_data[key]

        if (d.id === obj.map_id) {
          var contents = '<h4>' + obj.name + '</h4>';
          contents += '<ul class="box-videos">'

          obj.videos.forEach(function (v) {
            contents += '<li>' + v.title + '</li>'
          });
          contents += '</ul>'

          return contents;
        }
      }
    }

//populate active countries with different color

      for (key in country_json_data) {
        var obj = country_json_data[key]
  
          d3.select('path#id_' + obj.map_id)
          .style('fill', '#2c3e50')
          .attr('class', 'active-country')
          .style('cursor', 'pointer')
      }


  var tooltip = d3.select('body')
  .append('div')
  .attr('class', 'tooltip')
  .style('position', 'absolute')
  .style('z-index', '10')
  .style('visibility', 'hidden')

var feature = svg.selectAll("path");

d3.timer(function() {
  var dt = Date.now() - time;
  projection.rotate([rotate[0] + velocity[0] * dt, rotate[1] + velocity[1] * dt]);
  feature.attr("d", path);
});

});


// });


d3.select(self.frameElement).style('height', height + 'px');




