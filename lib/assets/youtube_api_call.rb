require 'json'
require 'pry'
require 'httparty'
require 'active_support/core_ext/hash'

results = HTTParty.get('http://gdata.youtube.com/feeds/api/standardfeeds/US/most_popular?v=2&time=today&max-results=5')

results_json = Hash.from_xml(results).to_json

f = File.open('json.txt', 'w') do |f| 
  f.write(results_json) 
end

binding.pry

