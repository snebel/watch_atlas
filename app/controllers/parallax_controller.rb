class ParallaxController < ApplicationController

  def index
    @countries = Country.all
         
    respond_to do |format|
      format.html
      format.json do
        render json: @country.videos.to_json
      end
    end
  end

 

end
