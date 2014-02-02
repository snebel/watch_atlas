# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
#   Mayor.create(name: 'Emanuel', city: cities.first)


Country.delete_all
countries = 
{"DZ" => "ALGERIA", "AT" => "AUSTRIA", "AU" => "AUSTRALIA", "AR" => "ARGENTINA", "BH" => "BAHRAIN", "BE" => "BELGIUM", "BR" => "BRAZIL", "CA" => "CANADA", "CL" => "CHILE", "CO" => "COLOMBIA", "CZ" => "CZECH REPUBLIC", "DK" => "DENMARK", "EG" => "EGYPT", "FI" => "FINLAND", "FR" => "FRANCE", "DE" => "GERMANY", "GH" => "GHANA", "GR" => "GREECE", "HK" => "HONG KONG", "HU" => "HUNGARY", "IN" => "INDIA", "ID" => "INDONESIA", "IE" => "IRELAND", "IL" => "ISRAEL", "IT" => "ITALY", "JP" => "JAPAN", "JO" => "JORDAN", "KE" => "KENYA", "KR" => "SOUTH KOREA", "KW" => "KUWAIT", "MY" => "MALAYSIA", "MX" => "MEXICO", "MA" => "MOROCCO", "NL" => "NETHERLANDS", "NO" => "NORWAY", "OM" => "OMAN", "PE" => "PERU", "PH" => "PHILIPPINES", "PL" => "POLAND", "PT" => "PORTUGAL", "QA" => "QATAR", "RO" => "ROMANIA", "RU" => "RUSSIAN", "SA" => "SAUDI ARABIA", "SN" => "SENEGAL", "SG" => "SINGAPORE", "SK" => "SLOVAKIA", "ZA" => "SOUTH AFRICA", "ES" => "SPAIN", "SE" => "SWEDEN", "CH" => "SWITZERLAND", "TW" => "TAIWAN", "TN" => "TUNISIA", "TR" => "TURKEY", "UG" => "UGANDA", "UA" => "UKRAINE", "AE" => "UNITED ARAB EMIRATES", "GB" => "UNITED KINGDOM", "US" => "UNITED STATES", "YE" => "YEMEN"}

country_map_id_hash = {"DZ"=>12, "YE"=>887, "AT"=>40, "AU"=>36, "AR"=>32, "BH"=>48, "BE"=>56, "BR"=>76, "CA"=>124, "CL"=>152, "CO"=>170, "CZ"=>203, "DK"=>208, "EG"=>818, "FI"=>246, "FR"=>250, "DE"=>276, "GH"=>288, "GR"=>300, "HK"=>344, "HU"=>348, "IN"=>356, "ID"=>360, "IE"=>372, "IL"=>376, "IT"=>380, "JP"=>392, "JO"=>400, "KE"=>404, "KR"=>410, "KW"=>414, "MY"=>458, "MX"=>484, "MA"=>504, "NL"=>528, "NO"=>578, "OM"=>512, "PE"=>604, "PH"=>608, "PL"=>616, "PT"=>620, "QA"=>634, "RO"=>642, "RU"=>643, "SA"=>682, "SN"=>686, "SG"=>702, "SK"=>703, "ZA"=>710, "ES"=>724, "SE"=>752, "CH"=>756, "TW"=>158, "TN"=>788, "TR"=>792, "UG"=>800, "UA"=>804, "AE"=>784, "GB"=>826, "US"=>840}
countries.each do |code, name|
  Country.create(code: code, name: name, map_id: country_map_id_hash[code] )
end

#require 'active_support/core_ext/hash'
Video.delete_all
CountryVideo.delete_all

# What do we want?
#   -title: results_json["feed"]["entry"]["title"]
#   -big-vid url: results_json["feed"]["entry"]["content"]["src"]
#   -normal-vid url: results_json["feed"]["entry"]["link"].first["href"]
#   -term/label: results_json["feed"]["entry"]["category"][1]["term"]

Country.all.each do |country|
# grab top videos for country here
  country_code = country.code
  num = 5
  url = "http://gdata.youtube.com/feeds/api/standardfeeds/#{country_code}/most_popular?v=2&time=today&max-results=#{num}"
  results = HTTParty.get(url).body
  results_json = Hash.from_xml(results)

  results_json["feed"]["entry"].each do |entry|
 
    if big_url_cnt = entry["content"]
        big_url = big_url_cnt['src']

      if Video.exists?(big_url: big_url)
        vid = Video.where(big_url: big_url).first
      else
        vid = Video.create(
          # get relevant video attributes from results_json
          title: entry["title"],
          normal_url: entry["link"].first["href"],
          big_url: entry["content"]["src"],
          term: entry["category"][1]["term"]
        )
      end
    
      puts CountryVideo.create(country_id: country.id, video_id: vid.id) 
    end
  end

end