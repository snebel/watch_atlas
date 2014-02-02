class MaptestsController < ApplicationController

  def index
    @countries = Country.all

    country_data = {}

      @countries.each do |country|

        country_name = country.name.downcase.split(' ').each { |name| name.capitalize! }.join(' ')

        country_data[country_name] = { name: country_name, map_id: country.map_id }

        country_data[country_name][:videos] = []

        country.videos.each do |video|
          country_data[country_name][:videos] << { title: video.title, url: video.normal_url }
        end

      end

    country_json = country_data.to_json

    gon.country_json = country_json



    #####put map ids into code

    @code_hash = {}

    @countries.each do |country| 
    
    @code_hash[country.code] = country.map_id

    end

  end


end