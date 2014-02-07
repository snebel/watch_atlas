#ATLAS APP
www.watch-atlas.herokuapp.com



##Overview
To provide a space online that organizes and visualizes YouTube's popular activity by country and its culture.



###Features and App Functions

* Global Visualization of trending videos by country. 

* Ability to click through to country's page to view top trending videos by category.

* User can see which countries share similar video views across all other countries.


###Important Learnings:

######D3 Visualization
* Our D3 globe is by far the most impressive tool implemented in this app. Its feature was a unique and exciting way to visualize youtube views around the world.  The execution involved taking coordinates of the globe and matching them up to our country models as well as our video data models. 

######Javascript/jQuery:
* With the exception of models and our rake task being written in Ruby, more or less 90% of our code utilizes javascript and jquery from start to finish.
With more time, we would have refactored the code to split up concerns into multiple js files (instead of one really long one).

######AJAX: 
* In the final steps of the project, the team was trying to figure out ways to get the site to run faster.  Initially the code was written so that each hover on a country loaded data with an ajax call.  Luckily we were recommended that we simply have an ajax call once on initial load of page.  That way each hover and click function would call data already loaded within our database.  This sped up all our hover and rotate functionalities perfectly.


###Code Snippets:
	As mentioned, the most gratifying moment in the project came at the end when we were able to speed up our site's functionality by a substantial amount. 

	Here is a piece of the code that utilizes ajax to grab all seeded data for a user to access quickly at any point in their session.

	D3 provided us with the "d.id" which is the coordinate point of a country's location on the globe map.

```
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
 ```

**©Watch-Atlas a creation of Team Umber 2014.**

