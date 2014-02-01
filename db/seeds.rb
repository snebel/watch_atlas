# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
<<<<<<< HEAD
#   Mayor.create(name: 'Emanuel', city: cities.first)
=======
#   Mayor.create(name: 'Emanuel', city: cities.first)

# countries = 
# {"DZ" => "ALGERIA", "AT" => "AUSTRIA", "AU" => "AUSTRALIA", "AR" => "ARGENTINA", "BH" => "BAHRAIN", "BE" => "BELGIUM", "BR" => "BRAZIL", "CA" => "CANADA", "CL" => "CHILE", "CO" => "COLOMBIA", "CZ" => "CZECH REPUBLIC", "DK" => "DENMARK", "EG" => "EGYPT", "FI" => "FINLAND", "FR" => "FRANCE", "DE" => "GERMANY", "GH" => "GHANA", "GR" => "GREECE", "HK" => "HONG KONG", "HU" => "HUNGARY", "IN" => "INDIA", "ID" => "INDONESIA", "IE" => "IRELAND", "IL" => "ISRAEL", "IT" => "ITALY", "JP" => "JAPAN", "JO" => "JORDAN", "KE" => "KENYA", "KR" => "SOUTH KOREA", "KW" => "KUWAIT", "MY" => "MALAYSIA", "MX" => "MEXICO", "MA" => "MOROCCO", "NL" => "NETHERLANDS", "NO" => "NORWAY", "OM" => "OMAN", "PE" => "PERU", "PH" => "PHILIPPINES", "PL" => "POLAND", "PT" => "PORTUGAL", "QA" => "QATAR", "RO" => "ROMANIA", "RU" => "RUSSIAN", "SA" => "SAUDI ARABIA", "SN" => "SENEGAL", "SG" => "SINGAPORE", "SK" => "SLOVAKIA", "ZA" => "SOUTH AFRICA", "ES" => "SPAIN", "SE" => "SWEDEN", "CH" => "SWITZERLAND", "TW" => "TAIWAN", "TN" => "TUNISIA", "TR" => "TURKEY", "UG" => "UGANDA", "UA" => "UKRAINE", "AE" => "UNITED ARAB EMIRATES", "GB" => "UNITED KINGDOM", "US" => "UNITED STATES", "YE" => "YEMEN"}
#
# countries.each do |code, name|
#   Country.create(code: code, name: name)
# end

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
    big_url = entry["content"]["src"]

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
  
    CountryVideo.create(country_id: country.id, video_id: vid.id) 
  end

end