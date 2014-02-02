class MaptestsController < ApplicationController

  def index
    @countries = Country.all

    country_data = {}

      @countries.each do |country|

        country.name = country.name.downcase.capitalize

        country_data[country.name] = { name: country.name, map_id: country.map_id }

        country_data[country.name][:videos] = []

        country.videos.each do |video|
          country_data[country.name][:videos] << { title: video.title, url: video.normal_url }
        end

      end

    country_json = country_data.to_json

    gon.country_json = country_json

    #binding.pry

  end


end