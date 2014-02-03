
var youtube_app = {


  bindEvents: function() {
    $(".thumbnail").on("click", function(){
      $.ajax({
        url: '/countries/'+ $(this).attr('id'),
        method: 'get',
        dataType: 'json'
      })
      .success(function(data){
        console.log(data);
      })

    });
  }

}

$(function(){

  youtube_app.bindEvents();

});