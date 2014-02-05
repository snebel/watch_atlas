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

  def share_info
    url = self.normal_url
    json_stats = HTTParty.get("http://api.sharedcount.com/?url=#{url}&apikey=45d3a0a518483b0d651a584b54083f2b5a743045")
    # parsed_stats = JSON.parse(json_stats)
    fb_hash = json_stats["Facebook"]
    twitter = json_stats["Twitter"]
    google = json_stats["GooglePlusOne"]
    pinterest = json_stats["Pinterest"]
    return {
      commentcount: fb_hash["comment_count"], 
      likecount: fb_hash["like_count"], 
      sharecount: fb_hash["share_count"],
      tweets: twitter,
      plus_ones: google,
      pins: pinterest,
    }
  end

end
