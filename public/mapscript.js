console.log(gon.country_json)

var country_json_data = gon.country_json

var width = 1000,
  height = 600;

var projection = d3.geo.equirectangular()
  .scale(153)
  .translate([width / 2, height / 2])
  .precision(.1);

var active;

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

d3.tsv("/world-country-names.tsv", function (error, array) {
 var countryNames = {};
 
 array.forEach( function (el) {
   data = el["id  name"].split(" ")
   id = data.shift();
   name = data.join(" ");
   country_name = {};
   countryNames[id] = country_name;
   country_name['name'] = name;
   country_name['flag'] = 'http://4.bp.blogspot.com/_Z6UyhHL6ubs/TEE-cCk82DI/AAAAAAAABDY/4RXYF__ShiE/s320/sweden_flag_small.gif';
   // console.log(country_name);
  });


 //populate flags

 //end populate flats


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
    .style('fill', '#2c3e50')
    .on('click', function (d) { 
      return tooltip
        .style('visibility', 'visible')
        .style('top', (event.pageY-10)+'px')
        .style('left',(event.pageX+10)+'px')
        .html( '<h2>' + countryNames[d.id]['name'] + '</h2><img src="' + countryNames[d.id]['flag'] + '"/>'); 
    });

  // d3.selectAll('path#id_752, path#id_250, path#id_840').style('fill', '#e74c3c');

  var tooltip = d3.select('body')
  .append('div')
  .attr('class', 'tooltip')
  .style('position', 'absolute')
  .style('z-index', '10')
  .style('visibility', 'hidden')

  var countryFlag = d3.select('body')
  .append('div')
  .style('position', 'absolute')
  .style('z-index', '10')
});


});


d3.select(self.frameElement).style('height', height + 'px');