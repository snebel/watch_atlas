class Video < ActiveRecord::Base
  has_many :country_videos
  has_many :countries, through: :country_videos
end
