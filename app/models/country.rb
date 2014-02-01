class Country < ActiveRecord::Base
  has_many :country_videos
  has_many :videos, through: :countries
end
