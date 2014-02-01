class CountryVideo < ActiveRecord::Base
  belongs_to :video
  belongs_to :country
end
