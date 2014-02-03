// // the country data from the controller

// var country_json_data = $.parseJSON(gon.country_json)

// // all of the countries in the database

// var valid_map_ids = [12, 887, 40, 36, 32, 48, 56, 76, 124, 152, 170, 203, 208, 818, 246, 250, 276, 288, 300, 344, 348, 356, 360, 372, 376, 380, 392, 400, 404, 410, 414, 458, 484, 504, 528, 578, 512, 604, 608, 616, 620, 634, 642, 643, 682, 686, 702, 703, 710, 724, 752, 756, 158, 788, 792, 800, 804, 784, 826, 840];

// var width = 960,
//   height = 560,
//   sens = 0.25,
//   focused,
//   active;

// var projection = d3.geo.orthographic()
//   .translate([width / 2, height / 2])
//   .scale(200)
//   .precision(.1)
//   .clipAngle(90)

// var path = d3.geo.path()
//   .projection(projection);

// var svg = d3.select('#map-canvas').append('svg')
//   .attr('width', width)
//   .attr('height', height);

// var g = svg.append('g');

// // the water

// g.append("path")
//   .datum({type: "Sphere"})
//   .attr("class", "globewater")
//   .style('fill', '#E0F2F7')
//   .style('cursor', 'move')
//   .attr("d", path);

// function zoomclick(d) {

//   if (active === d) return reset();
//   g.selectAll('.active').classed('active', false);
//   d3.select(this)
//     .classed('active', active = d);

//   var b = path.bounds(d);
//   g.transition().duration(750).attr('transform',
//       'translate(' + projection.translate() + ')'
//       + 'scale(' + .95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height) + ')'
//       + 'translate(' + -(b[1][0] + b[0][0]) / 2 + ',' + -(b[1][1] + b[0][1]) / 2 + ')');

//    if ( valid_map_ids.indexOf(d.id) != -1 ) {
//       return tooltip
//         .style('visibility', 'visible')
//         .style('display', 'block')
//         .style('top', (event.pageY) +'px')
//         .style('left',(event.pageX - 10) +'px')
//         .html( function () { return htmlGen(d) });

//       }else{
//         return tooltip
//         .style('visibility', 'visible')
//         .style('display', 'block')
//         .style('top', (event.pageY - 100) + 'px')
//         .style('left',(event.pageX - 100) + 'px')
//         .html( function () { return htmlGenNoData(d) } ); 
//       }

// }


// function reset() {
//   g.selectAll('.active').classed('active', active = false);
//   g.transition().duration(750).attr('transform', '');
// }


// var tooltip = d3.select('body')
//   .append('div')
//   .attr('class', 'tooltip')
//   .style('position', 'absolute')
//   .style('z-index', '9999')
//   .style('visibility', 'hidden');

// queue()
//     .defer(d3.json, '/map.json')
//     .await(ready);

// function ready (error, world) {

//   var countries = topojson.feature(world, world.objects.countries).features

//   g.selectAll('.country')
//     .data(countries)
//     .enter().insert('path')
//     .attr('class', 'country')
//     .attr('d', path)
//     .attr('id', function (d) {
//       return 'id_' + d.id
//     })
//     .style('fill', '#95a5a6')
//     .on('mouseover', function (d) {
//        d3.select('path#id_' + d.id)
//       .style('fill', '#d35400')
//     })
//     .on('mouseout', function (d) {

//       if ( valid_map_ids.indexOf(d.id) != -1 ) {
//         d3.select('path#id_' + d.id)
//         .style('fill', '#16a085')
//       }else{
//         d3.select('path#id_' + d.id)
//         .style('fill', '#95a5a6')
//       }
//     })
//     .on('click', zoomclick )


//   g.selectAll('path.globewater')
//   .call(d3.behavior.drag()

//       .origin(function() { var r = projection.rotate(); return {x: r[0] / sens, y: -r[1] / sens}; })
//       .on('drag', function() {
//         console.log('dragging')
//         var rotation_amount = 50;
//         console.log(d3.event);
//         var rotate = projection.rotate();
//         projection.rotate([ (rotate[0] + rotation_amount ), 0, 0 ]);
//         g.selectAll('path.country')
//         .attr('d', path);
//         g.selectAll('.focused').classed('focused', focused = false);
//       }))


//     htmlGen = function (d) {
//       for (key in country_json_data) {
//         var obj = country_json_data[key]

//         if (d.id === obj.map_id) {
//           var contents = '<h3>' + obj.name + '</h3>';
//           contents += '<ul class="box-videos">'

//           obj.videos.forEach(function (v) {
//             contents += '<li><img src="http://placekitten.com/40/40" style="float:left; margin:0 8px 5px 0;" /><a target="_blank" href="' + v.url + '">"' + v.title + '</a></li>'
//           });
//           contents += '</ul>'
//           contents += '<div class="close-me">close</div>'

//           $('body').on('click', '.close-me', function () {
//             $('.tooltip').hide();
//             reset();
//           });

//           return contents;
//         }
//       }
//     }

//     htmlGenNoData = function (d) {
//       var contents = 'Sorry, there is no YouTube data <br>for this country';
//           contents += '<div class="close-me">zoom out</div>'

//         $('body').on('click', '.close-me', function () {
//           $('.tooltip').hide();
//           reset();
//         });

//         return contents;
//     }
    

// //populate active countries with different color

//   for (key in country_json_data) {
//     var obj = country_json_data[key]
//     // console.log(obj.map_id)
//     d3.select('path#id_' + obj.map_id)
//       .style('fill', '#16a085')
//       // .attr('class', 'active-country')
//       .style('cursor', 'pointer')
//   }



//   d3.select('#right-rotator')
//   .on('click', function () {
//     var rotate = projection.rotate();
//       var rotation_amount = 40
//       var x_point = d3.event.x
//       var y_point = d3.event.y
//       console.log(rotate);
//         projection.rotate([ ( rotate[0] - rotation_amount ), 0, 0 ]);
//         g.selectAll('path.country')
//         .attr('d', path);
//         // g.selectAll('.focused').classed('focused', focused = false);
//   });


//     d3.select('#left-rotator')
//   .on('click', function () {
//     var rotate = projection.rotate();
//       var rotation_amount = 40
//       var x_point = d3.event.x
//       var y_point = d3.event.y
//       console.log(rotate);
//         projection.rotate([ ( rotate[0] + rotation_amount ), 0, 0 ]);
//         g.selectAll('path.country')
//         .attr('d', path);
//         // g.selectAll('.focused').classed('focused', focused = false);
//   });

// }




// d3.select(self.frameElement).style('height', height + 'px');
