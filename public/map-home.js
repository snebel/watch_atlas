// all of the countries in the database
var valid_map_ids = [12, 887, 40, 36, 32, 48, 56, 76, 124, 152, 170, 203, 208, 818, 246, 250, 276, 288, 300, 344, 348, 356, 360, 372, 376, 380, 392, 400, 404, 410, 414, 458, 484, 504, 528, 578, 512, 604, 608, 616, 620, 634, 642, 643, 682, 686, 702, 703, 710, 724, 752, 756, 158, 788, 792, 800, 804, 784, 826, 840];

var width = 1200,
    height = 700,
    sens = 0.9,
    focused,
    active;

var projection = d3.geo.orthographic()
    .translate([width / 2, height / 2])
    .scale(310)
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

function countryHover(d) {
  var self = this;

  d3.select('path#id_' + d.id)
  .style('fill', '#d35400');
  var self = this;

  $.ajax({
    method: 'get',
    url: '/countries/maps/' + d.id,
    dataType: 'json'
  })
    .success(function (data) {
      console.log('hello');
      var top_three_vids = ([data[1], data[2], data[3]]);
      makeHovertip(top_three_vids);
      addListener();
    })
    .fail(function(data){
      console.log("bad bad bad!")
    });

  function makeHovertip(data) {
    tooltip = d3.select('body')
    .append('div')
    .attr('class', 'hovertip')
    .style('position', 'absolute')
    .style('z-index', '9999')
    .style('opacity', '0')
  // .style('visibility', 'visible')
    .style('top', '30px')
    .style('right', '30px')
    .html(function () {
      return htmlHoverSuccessGen(data);
    })
    .transition().duration(400).style('opacity', '1')
  }  

}



function countryClick(d) {
  var self = this;

  $.ajax({
    method: 'get',
    url: '/countries/maps/' + d.id,
    dataType: 'json'
  })
    .success(function (data) {
      // console.log(data)
      zoomIn();
      makeTooltip(data, true);
        $('.flexslider').flexslider({
          animation: "slide",
          animationLoop: false,
          itemWidth: 150,
          itemMargin: 15
          });
        addListener();
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
        tooltip = d3.select('body')
        .append('div')
        .attr('class', 'tooltip')
        .style('position', 'absolute')
        .style('z-index', '9999')
        .style('opacity', '0')
      // .style('visibility', 'visible')
        .style('top', '95px')
        .style('left', '240px')
        .html(function () {
        if (good) { return htmlSuccessGen(data); }
        else { return htmlFailGen(); }
      })
      .transition().duration(700).style('opacity', '1')
      // .style('display', 'block')
      
  }
}


function reset() {
  g.selectAll('.active').classed('active', active = false);
  g.transition().duration(750).attr('transform', '');
}


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
    .on('mouseover', countryHover)
      
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
        var rotation_amount = 500;
        console.log(d3.event);
        var rotate = projection.rotate();
        projection.rotate([(rotate[0] + rotation_amount), 0, 0]);
        g.selectAll('path.country')
            .attr('d', path);
        g.selectAll('.focused').classed('focused', focused = false);
      }));


  htmlSuccessGen = function (data) {
    // $('.tooltip').empty();
    console.log(data);
    var contents = $('.tooltip');
    var header = $('<h1>');
    var title = $('<a>').text(data[0].name).attr('href', '/countries/'+data[0].id);
    var flag = $('<img>').attr('src', data[0].flag_url).css('width', '100');
    header.append(title);
    contents.append(header);
    // contents.append(flag);
    var vid_list = $('<ul>').addClass('box-videos');
    contents.append(vid_list);
    var div = $('<div>').addClass('close-me').text('close');

    //individual flexsliders and their ul's
    var $flexslider_top_videos = $('<div>').addClass('flexslider');
    var $flexslider_ul_top_videos = $('<ul>').addClass('slides');

    var $flexslider_news = $('<div>').addClass('flexslider');
    var $flexslider_ul_news = $('<ul>').addClass('slides');

    var $flexslider_music = $('<div>').addClass('flexslider');
    var $flexslider_ul_music = $('<ul>').addClass('slides');

    var $flexslider_tech = $('<div>').addClass('flexslider');
    var $flexslider_ul_tech = $('<ul>').addClass('slides');

    var $flexslider_entertainment = $('<div>').addClass('flexslider');
    var $flexslider_ul_entertainment = $('<ul>').addClass('slides');

    var $flexslider_animals = $('<div>').addClass('flexslider');
    var $flexslider_ul_animals = $('<ul>').addClass('slides');



    var $top_videos_div = $('<div>').attr('id', 'top-videos')
    var $news_div = $('<div>').attr('id', 'news-videos')
    var $music_div = $('<div>').attr('id', 'music-videos')
    var $tech_div = $('<div>').attr('id', 'tech-videos')
    var $entertainment_div = $('<div>').attr('id', 'entertainment-videos')
    var $animals_div = $('<div>').attr('id', 'animals-videos')

    contents.append(div);
    contents.append($top_videos_div);
    contents.append($news_div);
    contents.append($music_div);
    contents.append($tech_div);
    contents.append($entertainment_div);
    contents.append($animals_div);

    // appending individual flexsliders and their uls
    $top_videos_div.append($flexslider_top_videos);
    $news_div.append($flexslider_news);
    $music_div.append($flexslider_music);
    $tech_div.append($flexslider_tech);
    $entertainment_div.append($flexslider_entertainment);
    $animals_div.append($flexslider_animals);

    $flexslider_top_videos.append($flexslider_ul_top_videos);
    $flexslider_news.append($flexslider_ul_news);
    $flexslider_music.append($flexslider_ul_music);
    $flexslider_tech.append($flexslider_ul_tech);
    $flexslider_entertainment.append($flexslider_ul_entertainment);
    $flexslider_animals.append($flexslider_ul_animals);


    for (var i=1; i < data.length; i++) {

      if (data[i].top) {

        $flexslider_ul_top_videos.append('<li><a class="thumbnail"><img data-id="' + data[i].embed_url + '" src="' + data[i].thumbnail_url + '"/></a>' + data[i].title + '</li>');

      } else if (data[i].term === "News") {

        $flexslider_ul_news.append('<li><a class="thumbnail"><img data-id="' + data[i].embed_url + '" src="' + data[i].thumbnail_url + '"/></a>' + data[i].title + '</li>');

      }else if (data[i].term === "Music"){

        $flexslider_ul_music.append('<li><a class="thumbnail"><img data-id="' + data[i].embed_url + '" src="' + data[i].thumbnail_url + '"/></a>' + data[i].title + '</li>');

      }else if (data[i].term === "Tech"){

        $flexslider_ul_tech.append('<li><a class="thumbnail"><img data-id="' + data[i].embed_url + '" src="' + data[i].thumbnail_url + '"/></a>' + data[i].title + '</li>');

      }else if (data[i].term === "Entertainment"){

        $flexslider_ul_entertainment.append('<li><a class="thumbnail"><img data-id="' + data[i].embed_url + '" src="' + data[i].thumbnail_url + '"/></a>' + data[i].title + '</li>');

      }else if (data[i].term === "Animals"){

        $flexslider_ul_animals.append('<li><a class="thumbnail"><img data-id="' + data[i].embed_url + '" src="' + data[i].thumbnail_url + '"/></a>' + data[i].title + '</li>');
      }

      // var li = $('<li>');
      // var frame = $('<img>').attr('src', data[i].thumbnail_url);
      // frame.css('float', 'left').css('margin', '0 8px 5px 0');
      // li.append(frame);
      // var link = $('<a>').text(data[i].title).attr('href', data[i].normal_url)
      // li.append(link);
      // vid_list.append(li);


    }  


  $top_videos_div.prepend('<h2>Top Videos</h2>');
  $news_div.prepend('<h2>News</h2>');
  $music_div.prepend('<h2>Music</h2>');
  $tech_div.prepend('<h2>Tech</h2>');
  $entertainment_div.prepend('<h2>Entertainment</h2>');
  $animals_div.prepend('<h2>Animals</h2>');

  $('body').on('click', '.close-me', function () {
      $('.tooltip').animate({'opacity':'0'}, 400)
      .queue(function () {
        $(this).remove();
      })
      reset();
    });

    return contents.html();
  }


  htmlFailGen = function () {
    var contents = 'Sorry, there is no YouTube data <br>for this country';
    contents += '<div class="close-me">close</div>'

   $('body').on('click', '.close-me', function () {
        $('.tooltip').animate({'opacity':'0'}, 400)
        .queue(function () {
          $(this).remove();
        })
        reset();
      });

    return contents;
  }

  htmlHoverSuccessGen = function(data) {
    var contents = $('<div>');
    for (var i=0; i < data.length; i++) {
      var vid_div = $('<div>');
      vid_div.append('<a class="thumbnail"><img data-id="' + data[i].embed_url + '" src="' + data[i].thumbnail_url + '"/></a>' + data[i].title + '</li>');
      contents.append(vid_div);
    }
    return contents.html();
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

function addListener() {
  $('.thumbnail').on("click", function() {
    var self = this;

    embed_url = $(this).children('img').attr("data-id");
    var $close_embed_video = $('<div>').addClass('close-embed-video').text('close');

    $embed_window = $('<div>');
    $embed_window.attr('class', 'embed_window');
    $embed_window.css('position', 'absolute');
    $embed_window.css('top', '35px');
    $embed_window.css('left', '225px');
    $embed_window.append($close_embed_video)

    $embed_window.css('z-index', '99999');
    $embed_window.css('display', 'block')
    $embed_window.css('background', 'black')

    $video_iframe = $('<iframe>');
    $video_iframe.attr('src', embed_url);
    $video_iframe.attr('class', 'click_page_embed_url');
    $video_iframe.css('width', '642');
    $video_iframe.css('height', '470');

    $embed_window.append($video_iframe)

    $('body').append($embed_window)

    $('body').on('click', '.close-embed-video', function () {
      $embed_window.fadeOut() 
        $embed_window.remove();
    });

    // embed_window = d3.select('body')
    //     .append('div')
    //     .attr('class', 'embed_window')
    //     .style('position', 'absolute')
    //     .style('z-index', '9999')
    //     .style('opacity', '0')
    //   // .style('visibility', 'visible')
    //     .style('top', '30px')
    //     .style('right', '30px')
    //     .html()
    //   .transition().duration(400).style('opacity', '1')
      // .style('display', 'block')
  })
}

d3.select(self.frameElement).style('height', height + 'px');





