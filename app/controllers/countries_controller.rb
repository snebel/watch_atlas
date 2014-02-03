class CountriesController < ApplicationController

  def index
    @countries = Country.all
  end

  def create
  end

  def show
    @country = Country.find(params[:id])
    
    respond_to do |format|
      format.html

      format.json do
        render json: ([@country] + @country.videos.push).to_json
      end
    end
  end

  def destroy
  end

  def get_country_data
    map_id = params["map_id"]
    country = Country.find_by_map_id(map_id)
    redirect_to country_path(country)
  end

end