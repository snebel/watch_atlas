class Country < ActiveRecord::Base
  has_many :country_videos
  has_many :videos, through: :country_videos


  def get_overlapping_countries_info
    info = self.videos.map { |video| video.country_names(self.name) }
    # [  [russia, algeria], [kenya, algeria] ]
    info.flatten!


    country_counts = Hash.new(0)
    (Country.all - [self]).each do |country|
      country_counts[country.name] = 0
    end

    info.each do |country_name|
      country_counts[country_name] += 1
    end
    country_counts.sort_by{ |name, count| count}.reverse
  end

  def num_unique_vids
    num = 0
    self.videos.map do |vid|
      num += 1 if vid.country_videos.size == 1
    end
    num
  end
end
