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
        render json: @country.videos.to_json
      end
    end
  end

  def destroy
  end

end