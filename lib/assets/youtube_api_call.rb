require 'json'
require 'pry'
require 'httparty'
require 'active_support/core_ext/hash'

country = "US"
time = "today"
num = 1

results = HTTParty.get("http://gdata.youtube.com/feeds/api/standardfeeds/#{country}/most_popular?v=2&time=#{time}&max-results=#{num}").body
results_json = Hash.from_xml(results)

<<<<<<< HEAD
f = File.open('json.txt', 'w') do |f| 
  f.write(results_json) 
end

binding.pry

=======
What do we want?
  -title: results_json["feed"]["entry"]["title"]
  -big-vid url: results_json["feed"]["entry"]["content"]["src"]
  -normal-vid url: results_json["feed"]["entry"]["link"].first["href"]
  -term/label: results_json["feed"]["entry"]["category"][1]["term"]
>>>>>>> 998081e201a54b544650eda4967d35685f1ba957