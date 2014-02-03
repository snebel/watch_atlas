class MaptestsController < ApplicationController

  def index
    @countries = Country.all

    country_data = {}

    @countries.each do |country|

      country_name = country.name.downcase.split(' ').each { |name| name.capitalize! }.join(' ')

      country_data[country_name] = { name: country_name, map_id: country.map_id, db_id: country.id }

      country_data[country_name][:videos] = []

      country.videos.each do |video|
        country_data[country_name][:videos] << { title: video.title, url: video.normal_url, db_id: video.id }
      end

    end

    country_json = country_data.to_json

    gon.country_json = country_json


  end


end
