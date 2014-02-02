class CountriesController < ApplicationController

def index
  @countries = Country.all
end

def create
end

def show
  @country = Country.find(params[:id])
end

def destroy
end

end