// all of the countries in the database
var valid_map_ids = [12, 887, 40, 36, 32, 48, 56, 76, 124, 152, 170, 203, 208, 818, 246, 250, 276, 288, 300, 344, 348, 356, 360, 372, 376, 380, 392, 400, 404, 410, 414, 458, 484, 504, 528, 578, 512, 604, 608, 616, 620, 634, 642, 643, 682, 686, 702, 703, 710, 724, 752, 756, 158, 788, 792, 800, 804, 784, 826, 840];

var width = 880,
    height = 560,
    sens = 0.25,
    focused,
    active;

var projection = d3.geo.orthographic()
    .translate([width / 2, height / 2])
    .scale(280)
    .precision(.1)
    .clipAngle(90)

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select('#map-canvas').append('svg')
    .attr('width', width)
    .attr('height', height);

var g = svg.append('g');

// the water

g.append("path")
    .datum({
        type: "Sphere"
    })
    .attr("class", "globewater")
    .style('fill', '#BEE9F5')
    .style('cursor', 'move')
    .attr("d", path);



function countryClick(d) {
  var self = this;

  $.ajax({
    method: 'get',
    url: '/countries/maps/' + d.id,
    dataType: 'json'
  })
    .success(function (data) {
      console.log(data)
      zoomIn();
      makeTooltip(data, true);
    })
    .fail(function(data){
      makeTooltip(data, false);  
    });

  function zoomIn() {
    if (active === d){ return reset();}
    g.selectAll('.active').classed('active', false);
    d3.select(self).classed('active', active = d);

    var b = path.bounds(d);
    g.transition().duration(750).attr('transform',
        'translate(' + projection.translate() + ')' + 'scale(' + .95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height) + ')' + 'translate(' + -(b[1][0] + b[0][0]) / 2 + ',' + -(b[1][1] + b[0][1]) / 2 + ')');
    //end zoom stuff
  }

  function makeTooltip(data, good) { //data => [country, vid1, vid2,...]  
    return tooltip
      .style('visibility', 'visible')
      .style('display', 'block')
      .style('top', '30px')
      .style('right', '30px')
      .html(function () {
        if (good) { return htmlSuccessGen(data); }
        else { return htmlFailGen(); }
      });
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

function ready(error, world) {

  var countries = topojson.feature(world, world.objects.countries).features

  g.selectAll('.country')
    .data(countries)
    .enter().insert('path')
    .attr('class', 'country')
    .attr('d', path)
    .attr('id', function(d){
        return 'id_' + d.id
    })
    .style('fill', '#95a5a6')
    .on('mouseover', function(d){
      d3.select('path#id_' + d.id)
        .style('fill', '#d35400')
    })
    .on('mouseout', function(d){
      if (valid_map_ids.indexOf(d.id) != -1) {
        d3.select('path#id_' + d.id).style('fill', '#16a085')
      } 
      else {
        d3.select('path#id_' + d.id).style('fill', '#95a5a6')
      }
    })
    .on('click', countryClick);

    g.selectAll('path.globewater')
      .call(d3.behavior.drag()

      .origin(function () {
        var r = projection.rotate();
        return {
          x: r[0] / sens,
          y: -r[1] / sens
        };
      })
      .on('drag', function () {
        console.log('dragging')
        var rotation_amount = 50;
        console.log(d3.event);
        var rotate = projection.rotate();
        projection.rotate([(rotate[0] + rotation_amount), 0, 0]);
        g.selectAll('path.country')
            .attr('d', path);
        g.selectAll('.focused').classed('focused', focused = false);
      }));


  htmlSuccessGen = function (data) {
    $('.tooltip').empty();
    var contents = $('.tooltip');
    var header = $('<h1>');
    var title = $('<a>').text(data[0].name).attr('href', '/countries/'+data[0].id);
    var flag = $('<img>').attr('src', data[0].flag_url).css('width', '100');
    header.append(title);
    contents.append(header);
    contents.append(flag);
    var vid_list = $('<ul>').addClass('box-videos');
    contents.append(vid_list);
    var div = $('<div>').addClass('close-me').text('close');
    contents.append(div);

    for (var i=1; i < data.length; i++) {
      var li = $('<li>');

      // var frame = $('<iframe>').attr('src', data[i].thumbnail_url);
      // using image until we figure out iframe thing
      var frame = $('<img>').attr('src', data[i].thumbnail_url);

      frame.css('float', 'left').css('margin', '0 8px 5px 0');
      li.append(frame);
      var link = $('<a>').text(data[i].title).attr('href', data[i].normal_url)
      li.append(link);
      vid_list.append(li);
    }

    $('body').on('click', '.close-me', function () {
      $('.tooltip').hide();
      reset();
    });

    return contents.html();
  }


  htmlFailGen = function () {
    var contents = 'Sorry, there is no YouTube data <br>for this country';
    contents += '<div class="close-me">close</div>'

    $('body').on('click', '.close-me', function () {
      $('.tooltip').hide();
      reset();
    });

    return contents;
  }

  //populate active countries with different color

  valid_map_ids.forEach(function (x) {
    d3.select('path#id_' + x)
      .style('fill', '#16a085')
      .style('cursor', 'pointer')
  });

  d3.select('#right-rotator')
    .on('click', function () {
      var rotate = projection.rotate();
      var rotation_amount = 40;
      var x_point = d3.event.x;
      var y_point = d3.event.y;
      console.log(rotate);
      projection.rotate([(rotate[0] - rotation_amount), 0, 0]);
      g.selectAll('path.country').attr('d', path);
    });


  d3.select('#left-rotator')
    .on('click', function () {
      var rotate = projection.rotate();
      var rotation_amount = 40;
      var x_point = d3.event.x;
      var y_point = d3.event.y;
      console.log(rotate);
      projection.rotate([(rotate[0] + rotation_amount), 0, 0]);
      g.selectAll('path.country').attr('d', path);
    });

}

d3.select(self.frameElement).style('height', height + 'px');
