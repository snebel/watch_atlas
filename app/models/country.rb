class Country < ActiveRecord::Base
  has_many :country_videos
  has_many :videos, through: :country_videos
end
