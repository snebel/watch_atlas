// all of the countries in the database
var countries_object; 
var valid_map_ids = [12, 887, 40, 36, 32, 48, 56, 76, 124, 152, 170, 203, 208, 818, 246, 250, 276, 288, 300, 344, 348, 356, 360, 372, 376, 380, 392, 400, 404, 410, 414, 458, 484, 504, 528, 578, 512, 604, 608, 616, 620, 634, 642, 643, 682, 686, 702, 703, 710, 724, 752, 756, 158, 788, 792, 800, 804, 784, 826, 840];

var width = parseInt(d3.select('body').style('width')),
    height = 800,
    sens = 0.9,
    focused,
    active;

var projection = d3.geo.orthographic()
  .translate([width / 2, height / 2])
  .scale(300)
  .precision(.1)
  .clipAngle(90)

var path = d3.geo.path().projection(projection);

var arrows_div_left_margin = parseInt( (width - 800) / 2 );
$('#arrows-div').css('left', arrows_div_left_margin + 'px');

// var moonman_left_margin = parseInt( (width - 900) / 2 );
// $('#moon-man').css('left', moonman_left_margin + 'px').css('top', '150px');

var svg = d3.select('#map-canvas').append('svg')
  .attr('width', width)
  .attr('height', height)
    // .call(d3.behavior.zoom()
    // .on("zoom", redraw));

var g = svg.append('g');

g.append("path")
  .datum({ type: "Sphere" })
  .attr("class", "globewater")
  .style('fill', '#BEE9F5')
  .style('cursor', 'move')
  .attr("d", path);



function getAllCountryTopVids() {

    $.ajax({
      method: 'get',
      url: '/countries',
      dataType: 'json',
      success: function (data) {
        countries_object = data;
      }
    });
}

queue()
  .defer(d3.json, '/world-countries.json')
  .await(ready);

// var moonman_left_margin = parseInt( (width - 900) / 2 );
// $('#moon-man').css('left', moonman_left_margin + 'px').css('top', '40px');



// function redraw() {
//     g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
// }

function antiGrav(ele) { 
  var distance = 12;
  $(ele).animate({
    'top': "+=" + distance + "px"
  },800,"swing",function(){
    $(ele).animate({        
            'top': "-=" + distance + "px"
    },800,"swing",function(){
      antiGrav(ele);
        });
  });
}


function countryHover(d) {
  d3.select('path#id_' + d.id).style('fill', '#d35400');
  if (valid_map_ids.indexOf(d.id) != -1) {
  $tooltip = $('.tooltip');
    var mouse = d3.mouse(svg.node()).map( function(d) { return parseInt(d); } );

    $('.hovertip').remove();

      tooltip = d3.select('#map-canvas')
      .append('div')
      .attr('class', 'hovertip')
      .attr("style", "left:"+(mouse[0])+"px;top:"+mouse[1]+"px")
      .style('z-index', '9999')
      .style('opacity', '0')
      .html(function () {
        return htmlHoverSuccessGen(d);
      }).style('opacity', '1')
       .transition().duration(3).style('opacity', '1')
  }
  addListener();
}   


function countryClick(d) {
  var self = this;
  
  $('.embed_window').remove();
  
  if (valid_map_ids.indexOf(d.id) != -1) {
    $.ajax({
      method: 'get',
      url: '/countries/maps/' + d.id,
      dataType: 'json'
    })
      .success(function (data) {
        zoomIn();
        makeTooltip(data, true);
        $('.flexslider').flexslider({
          animation: "slide",
          slideshow: false,
          animationLoop: false,
          itemWidth: 150,
          itemMargin: 15
        });
        addListener();
      })
  }
  else {
    makeTooltip('', false);
  }

  function zoomIn() {
    if (active === d){ return reset();}
    d3.select('svg').style('opacity', '.6')
    g.selectAll('.active').classed('active', false);
    d3.select(self).classed('active', active = d);

    var b = path.bounds(d);
    g.transition().duration(750).attr('transform',
      'translate(' + projection.translate() + ')' + 'scale(' + 0.4 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height) + ')' + 'translate(' + -(b[1][0] + b[0][0]) / 2 + ',' + -(b[1][1] + b[0][1]) / 2 + ')');
  }

  function makeTooltip(data, good) { //data => [country, vid1, vid2,...] 
    $('.tooltip').remove(); //remove the last tooltip from the dom

    d3.select('#map-canvas')
    .append('div')
    .attr('class', 'tooltip')
    .style('position', 'relative')
    .style('z-index', '9999')
    .style('opacity', '0')
    .style('top', '-750px')
    .style('left', '0px')
    .transition().duration(700).style('opacity', '1');

    $('.tooltip').html(function () {
      if (good) { htmlSuccessGen(data);}
      else { return htmlFailGen(); }
    })

  }
}

function reset() {
  d3.select('svg').style('opacity', '1');
  g.selectAll('.active').classed('active', active = false);
  g.transition().duration(750).attr('transform', '');
}

function ready(error, collection) {

  // var countries = topojson.feature(world, world.objects.countries).features

  g.selectAll('.country')
    .data(collection.features)
    .enter().insert('path')
    .attr('class', 'country')
    .attr('d', path)
    .attr('title', 'ptooltip-1')
    .attr('id', function(d){
        return 'id_' + d.id
    })
    .style('fill', '#95a5a6')
      
    .on("mouseover", countryHover)

    .on('mouseout', function(d){
      if (valid_map_ids.indexOf(d.id) != -1) {
        d3.select('path#id_' + d.id).style('fill', '#16a085')
      } 
      else {
        d3.select('path#id_' + d.id).style('fill', '#95a5a6')
      }
    
      var isHoverTipHovered = $('.hovertip').is(":hover");

      if ( !isHoverTipHovered ) { //if we are hovering over the hovertip
        $('.hovertip').remove();          
      }

    })

    .on('click', countryClick);

    g.selectAll('path.globewater')
      .call(d3.behavior.drag()
      .on('drag', function () {
        var rotation_amount = .2;

        var rotate = projection.rotate();

        projection.rotate([rotate[0] + d3.event.dx*rotation_amount, rotate[1] + -1*d3.event.dy*rotation_amount, .5]); //(rotate[0] + rotation_amount), rotate[1] + d3.event.dy*rotation_amount  
        g.selectAll('path.country').attr('d', path);        
        g.selectAll('.focused').classed('focused', focused = false);
      }));


  htmlSuccessGen = function(data) {

    console.log(data);
    $('.tooltip').empty();
    var contents = $('.tooltip');
    var header = $('<h1 class="country-name">');
    var title = $('<a>').text(data[0].name).attr('href', '/countries/'+data[0].id);
    var flag = $('<img>').attr('src', data[0].flag_url).attr('class', 'country-flag');
    header.append(title);
    header.append(flag);
    contents.append(header);
    
    $('.tooltip').empty();

    var contents = $('.tooltip');
    var header = $('<h1 class="country-name">');
    var title = $('<a>').text(data[0].name).attr('href', '/countries/'+data[0].id);
    var flag = $('<img>').attr('src', data[0].flag_url).attr('class', 'country-flag');
    header.append(title);
    header.append(flag);
    contents.append(header);

    $('.tooltip').empty();
    var $contents = $('.tooltip');

    var $header = $('<h1 class="country-name">');
    var $close_me_div = $('<div>').addClass('close-me').html('<img src="/cancel-new.png" />');
    var $title = data[0].name;
    var $flag = $('<img>').attr('src', data[0].flag_url).attr('class', 'country-flag');

    $header.append($title).append($flag);
    $contents.append($header);
    $contents.append($close_me_div)

    var $circles = $('<div>').attr('id', 'circles-holder').attr('class', 'clearfix').css('color', 'white').css('width', '100%');
    var $circle_one = $('<div>').attr('id', 'circle-1').css('width', '80px').css('float', 'left').addClass('circle-thing');
    var $circle_two = $('<div>').attr('id', 'circle-2').css('width', '80px').css('float', 'left').addClass('circle-thing');
    var $circle_three = $('<div>').attr('id', 'circle-3').css('width', '80px').css('float', 'left').addClass('circle-thing');
    var $circle_four = $('<div>').attr('id', 'circle-4').css('width', '80px').css('float', 'left').addClass('circle-thing');
    var $circle_five = $('<div>').attr('id', 'circle-5').css('width', '80px').css('float', 'left').addClass('circle-thing');
    var $circle_six = $('<div>').attr('id', 'circle-6').css('width', '80px').css('float', 'left').addClass('circle-thing');
    var $circle_seven = $('<div>').attr('id', 'circle-7').css('width', '80px').css('float', 'left').addClass('circle-thing');
    var $circle_eight = $('<div>').attr('id', 'circle-8').css('width', '80px').css('float', 'left').addClass('circle-thing');
    var $circle_nine = $('<div>').attr('id', 'circle-9').css('width', '80px').css('float', 'left').addClass('circle-thing');
    var $circle_ten = $('<div>').attr('id', 'circle-10').css('width', '80px').css('float', 'left').addClass('circle-thing');

    $contents.append($circles);
    $circles.append($circle_one).append($circle_two).append($circle_three).append($circle_four).append($circle_five).append($circle_six).append($circle_seven).append($circle_eight).append($circle_nine).append($circle_ten);
    $contents.append($circles);

    var country_data = data[data.length - 1];
    var first = country_data[0];
    var second = country_data[1];
    var third = country_data[2];    
    var fourth = country_data[3]; 
    var fifth = country_data[4];    
    var sixth = country_data[5];
    var seventh = country_data[6]

    var last_index = country_data.length - 2; // - 2 because last element is unique_vids data
    var eighth = country_data[last_index - 2]; 
    var ninth = country_data[last_index - 1];    
    var tenth = country_data[last_index]; 

    makeCircle('circle-1', parseInt(first[1]/60*100), 40, '', '#9CB9D9', '#162E76');
    makeCircle('circle-2', parseInt(second[1]/60*100), 40, '', '#9CB9D9', '#162E76');
    makeCircle('circle-3', parseInt(third[1]/60*100), 40, '', '#9CB9D9', '#162E76');
    makeCircle('circle-4', parseInt(fourth[1]/60*100), 40, '', '#9CB9D9', '#162E76');
    makeCircle('circle-5', parseInt(fifth[1]/60*100), 40, '', '#9CB9D9', '#162E76');
    makeCircle('circle-6', parseInt(sixth[1]/60*100), 40, '', '#9CB9D9', '#162E76');
    makeCircle('circle-7', parseInt(seventh[1]/60*100), 40, '', '#9CB9D9', '#162E76');
    makeCircle('circle-8', parseInt(eighth[1]/60*100), 40, '', '#E5A4B0', '#DC435F');
    makeCircle('circle-9', parseInt(ninth[1]/60*100), 40, '', '#E5A4B0', '#DC435F');
    makeCircle('circle-10', parseInt(tenth[1]/60*100), 40, '', '#E5A4B0', '#DC435F');
    //end first row of circles

    $circle_one.append(first[0])
    $circle_two.append(second[0])
    $circle_three.append(third[0])
    $circle_four.append(fourth[0])
    $circle_five.append(fifth[0])
    $circle_six.append(sixth[0])
    $circle_seven.append(seventh[0])
    $circle_eight.append(eighth[0])
    $circle_nine.append(ninth[0])
    $circle_ten.append(tenth[0])

    //make unique circle row
    var $unique_circles = $('<div>').attr('id', 'circles-holder-unique').attr('class', 'clearfix');
    var $circle_unique = $('<div>').attr('id', 'unique');
    $contents.append($unique_circles);

    $unique_circles.append($circle_unique)
    $contents.append($unique_circles);

    var unique = country_data[country_data.length - 1];
    makeCircle('unique', parseInt(unique[1]/60*100), 30, "of videos are unique", '#F4CB6B', '#F76504');
    //end unique circle row

    function makeCircle(id, percent, radius, text, color1, color2){
      Circles.create({
        id:         id,
        percentage: percent,
        radius:     radius,
        width:      9,
        number:     percent,
        text:       '% ' + text,
        colors:     [color1, color2], //
        duration:   900
      });
    }

    var vid_list = $('<ul>').addClass('box-videos');
    $contents.append(vid_list);

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

    $contents.append($top_videos_div);
    $contents.append($news_div);
    $contents.append($music_div);
    $contents.append($tech_div);
    $contents.append($entertainment_div);
    $contents.append($animals_div);

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
    }  

    $circles.prepend('<h2 class="category-title">Countries With Similar Viewing Patterns</h2>');
    $top_videos_div.prepend('<h2 class="category-title">Top Videos</h2>');
    $news_div.prepend('<h2 class="category-title">News</h2>');
    $music_div.prepend('<h2 class="category-title">Music</h2>');
    $tech_div.prepend('<h2 class="category-title">Tech</h2>');
    $entertainment_div.prepend('<h2 class="category-title">Entertainment</h2>');
    $animals_div.prepend('<h2 class="category-title">Animals</h2>');


    $('body').on('click', '.close-me', function () {
      $('.tooltip').animate({'opacity':'0'}, 400)
      .queue(function () {
        $(this).remove();
      })
      reset();
    });

    return $contents.html();
  }

  htmlFailGen = function () {
    var contents = 'Sorry, there is no YouTube data for this country';
    contents += '<div class="close-me"><img src="/cancel-new.png" /></div>'
    $('.tooltip').attr('id', 'sorry')

   $('body').on('click', '.close-me', function () {
        $('.tooltip').animate({'opacity':'0'}, 400)
        .queue(function () {
          $(this).remove();
        })
        reset();
      });

    return contents;
  }

  htmlHoverSuccessGen = function(d) {
    // console.log(country);
    
    var map_id = d.id;
    if (valid_map_ids.indexOf(map_id) != -1) {
      var data = countries_object[map_id];
      var $hovertip_videos_container = $('<div>');
      $hovertip_videos_container.attr('class', 'hovertip_videos_container');

      var $header = $('<div>');

      var $title = $('<h2 id="hovertip-country-name">' + data[0] + '</h2>');
      var $flag = $('<img>').attr('src', data[1]).attr('class', 'hovertip-country-flag');


      var contents = $('<div>');
      for (var i=2; i < data.length; i++) {
        var vid_div = $('<div>');
        vid_div.attr('class', 'hovertip-div')
        vid_div.append('<a class="embed-video-hovertip">' + '<img data-id="' + data[i][1] + '" src="' + data[i][0] + '"/></a></li>');
        $hovertip_videos_container.append(vid_div);
      }
      
      $header.append($flag).append($title);
      contents.append($header);
      contents.append($hovertip_videos_container);
      return contents.html();
    }
  }

  valid_map_ids.forEach(function (x) {
    d3.select('path#id_' + x)
      .style('fill', '#16a085')
      .style('cursor', 'pointer')
  });

  d3.select('#right-arrow')
  .on('click', function () {
    var rotate = projection.rotate();
    var rotation_amount = 40;
    var x_point = d3.event.x;
    var y_point = d3.event.y;
    projection.rotate([(rotate[0] - rotation_amount), 0, 0]);
    g.selectAll('path.country').attr('d', path);
  });

  d3.select('#left-arrow')
    .on('click', function () {
    var rotate = projection.rotate();
    var rotation_amount = 40;
    var x_point = d3.event.x;
    var y_point = d3.event.y;
    //console.log(rotate);
    projection.rotate([(rotate[0] + rotation_amount), 0, 0]);
    g.selectAll('path.country').attr('d', path);
  });
}


function addListener ()  {
  $('.thumbnail').on("click", function() {

    var height = '-1420px';
    var self = this;
    popUpVideo(height, self);
  });

  $('.embed-video-hovertip').on("click", function() {
    $('.tooltip').remove();
    var self = this;
    var height = '-750px';
    popUpVideo(height, self);
  });

  $('.zoom').on("click", function() {
    generalZoom();
  });

  d3.select(window).on('resize', resize);
}


function popUpVideo (height, button) {
  embed_url = $(button).children('img').attr("data-id");
  var $div = $('<div>').addClass('close-me-embed-video').html('<img src="/cancel-new.png" />');
  $embed_window = $('<div>');
  $embed_window.attr('class', 'embed_window');
  $embed_window.css('position', 'relative');
  $embed_window.css('top', height);
  $embed_window.css('left', '0px');

  $embed_window.css('z-index', '99999');
  $embed_window.css('display', 'block')
  $embed_window.css('background', 'black')

  $video_container = $('<div>')
  $video_container.attr('class', 'video-container')

  $video_iframe = $('<iframe>');
  $video_iframe.attr('src', embed_url);
  $video_iframe.attr('class', 'click_page_embed_url');

  $embed_window.append($video_container)
  $video_container.append($video_iframe)
  $embed_window.append($div)

  $('#map-canvas').append($embed_window)

  $('body').on('click', '.close-me-embed-video', function () {
    $embed_window.fadeOut();
    $embed_window.remove();
  });
}

function resize() {

  width = parseInt(d3.select('body').style('width'));  
  var arrows_div_left_margin = parseInt( (width - 800) / 2 );
  $('#arrows-div').css('left', arrows_div_left_margin + 'px');
  // var moonman_left_margin = parseInt( (width - 900) / 2 );
  // $('#moon-man').css('left', moonman_left_margin + 'px').css('top', '150px');

  projection.translate([width / 2, height / 2]).scale(300);
  svg.style('width', width + 'px').style('height', height + 'px');
  g.selectAll('.country').attr('d', path);
  g.selectAll('.globewater').attr('d', path);

 
    width = parseInt(d3.select('body').style('width'));  

    var arrows_div_left_margin = parseInt( (width - 800) / 2 );

    $('#arrows-div').css('left', arrows_div_left_margin + 'px');

    // var moonman_left_margin = parseInt( (width - 900) / 2 );

    // $('#moon-man').css('left', moonman_left_margin + 'px').css('top', '150px');

    projection
        .translate([width / 2, height / 2])
        .scale(300);

    svg.style('width', width + 'px').style('height', height + 'px');

    g.selectAll('.country').attr('d', path);
    g.selectAll('.globewater').attr('d', path);

}

$(function () {

    getAllCountryTopVids();
    var countries_object = "country";
    antiGrav('#moon-man'); 
    addListener();
     
});
