class Country < ActiveRecord::Base
  has_many :country_videos
  has_many :videos, through: :country_videos


  def get_overlapping_countries_info
    info = self.videos.map { |video| video.country_names(self.name) }
    info.flatten!

    country_counts = Hash.new(0)
    info.each do |country_name|
      country_counts[country_name] += 1
    end
    country_counts.sort_by{ |name, count| count}.reverse
  end
end
