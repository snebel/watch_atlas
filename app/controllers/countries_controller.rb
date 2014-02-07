class CountriesController < ApplicationController

  def index
    @countries = Country.all
    h = {}
    @countries.each do |country|
      vids = country.videos
      h[country.map_id] = [
        country.name,
        country.flag_url,
        [vids[0].thumbnail_url, vids[0].embed_url],
        [vids[1].thumbnail_url, vids[1].embed_url],
        [vids[2].thumbnail_url, vids[2].embed_url]
      ]
    end

    respond_to do |format|
      format.html
      format.json do 
        render json: h.to_json
      end
    end
  end

  def create
  end

  def show
    @country = Country.find(params[:id])    
    @num_unique = @country.num_unique_vids
    @info = @country.get_overlapping_countries_info << ['unique', @num_unique]
    #binding.pry
    respond_to do |format|
      format.html

      format.json do
        render json: ([@country] + @country.videos + [@info]).to_json
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