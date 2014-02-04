class Video < ActiveRecord::Base
  has_many :country_videos
  has_many :countries, through: :country_videos

  def youtube_embed
    normal_url = self.normal_url
    if normal_url[/youtu\.be\/([^\?]*)/]
      youtube_id = $1
    else 
      normal_url[/^.*((v\/)|(embed\/)|(watch\?))\??v?=?([^\&\?]*).*/] 
      youtube_id = $5 
    end 
    "http://www.youtube.com/embed/#{youtube_id}"
  end

  def country_names(name = nil)
    names = self.countries.map { |country| country.name } - [name]
  end


end
