
 namespace :fill_db do

 	desc "fill database with monthly data"
    task :scheduled_job  => :environment do

		Country.delete_all
		Video.delete_all
		CountryVideo.delete_all

		countries = {"DZ" => "ALGERIA", "AT" => "AUSTRIA", "AU" => "AUSTRALIA", "AR" => "ARGENTINA", "BH" => "BAHRAIN", "BE" => "BELGIUM", "BR" => "BRAZIL", "CA" => "CANADA", "CL" => "CHILE", "CO" => "COLOMBIA", "CZ" => "CZECH REPUBLIC", "DK" => "DENMARK", "EG" => "EGYPT", "FI" => "FINLAND", "FR" => "FRANCE", "DE" => "GERMANY", "GH" => "GHANA", "GR" => "GREECE", "HK" => "HONG KONG", "HU" => "HUNGARY", "IN" => "INDIA", "ID" => "INDONESIA", "IE" => "IRELAND", "IL" => "ISRAEL", "IT" => "ITALY", "JP" => "JAPAN", "JO" => "JORDAN", "KE" => "KENYA", "KR" => "SOUTH KOREA", "KW" => "KUWAIT", "MY" => "MALAYSIA", "MX" => "MEXICO", "MA" => "MOROCCO", "NL" => "NETHERLANDS", "NO" => "NORWAY", "OM" => "OMAN", "PE" => "PERU", "PH" => "PHILIPPINES", "PL" => "POLAND", "PT" => "PORTUGAL", "QA" => "QATAR", "RO" => "ROMANIA", "RU" => "RUSSIA", "SA" => "SAUDI ARABIA", "SN" => "SENEGAL", "SG" => "SINGAPORE", "SK" => "SLOVAKIA", "ZA" => "SOUTH AFRICA", "ES" => "SPAIN", "SE" => "SWEDEN", "CH" => "SWITZERLAND", "TW" => "TAIWAN", "TN" => "TUNISIA", "TR" => "TURKEY", "UG" => "UGANDA", "UA" => "UKRAINE", "AE" => "UNITED ARAB EMIRATES", "GB" => "UNITED KINGDOM", "US" => "UNITED STATES", "YE" => "YEMEN"}
		country_map_id_hash = {"DZ"=>12, "YE"=>887, "AT"=>40, "AU"=>36, "AR"=>32, "BH"=>48, "BE"=>56, "BR"=>76, "CA"=>124, "CL"=>152, "CO"=>170, "CZ"=>203, "DK"=>208, "EG"=>818, "FI"=>246, "FR"=>250, "DE"=>276, "GH"=>288, "GR"=>300, "HK"=>344, "HU"=>348, "IN"=>356, "ID"=>360, "IE"=>372, "IL"=>376, "IT"=>380, "JP"=>392, "JO"=>400, "KE"=>404, "KR"=>410, "KW"=>414, "MY"=>458, "MX"=>484, "MA"=>504, "NL"=>528, "NO"=>578, "OM"=>512, "PE"=>604, "PH"=>608, "PL"=>616, "PT"=>620, "QA"=>634, "RO"=>642, "RU"=>643, "SA"=>682, "SN"=>686, "SG"=>702, "SK"=>703, "ZA"=>710, "ES"=>724, "SE"=>752, "CH"=>756, "TW"=>158, "TN"=>788, "TR"=>792, "UG"=>800, "UA"=>804, "AE"=>784, "GB"=>826, "US"=>840}

		population = {"CHINA"=>"1,349,585,838", "INDIA"=>"1,220,800,359", "EUROPEAN UNION"=>"509,365,627", "UNITED STATES"=>"316,438,601", "INDONESIA"=>"251,160,124", "BRAZIL"=>"201,009,622", "PAKISTAN"=>"193,238,868", "NIGERIA"=>"174,507,539", "BANGLADESH"=>"163,654,860", "RUSSIA"=>"142,500,482", "JAPAN"=>"127,253,075", "MEXICO"=>"118,818,228", "PHILIPPINES"=>"105,720,644", "ETHIOPIA"=>"93,877,025", "VIETNAM"=>"92,477,857", "EGYPT"=>"85,294,388", "GERMANY"=>"81,147,265", "TURKEY"=>"80,694,485", "IRAN"=>"79,853,900", "CONGO"=>"4,574,099", "THAILAND"=>"67,497,151", "FRANCE"=>"65,951,611", "UNITED KINGDOM"=>"63,395,574", "ITALY"=>"61,482,297", "BURMA"=>"55,167,330", "SOUTH KOREA"=>"24,720,407", "SOUTH AFRICA"=>"48,601,098", "TANZANIA"=>"48,261,942", "SPAIN"=>"47,370,542", "COLOMBIA"=>"45,745,783", "UKRAINE"=>"44,573,205", "KENYA"=>"44,037,656", "ARGENTINA"=>"42,610,981", "POLAND"=>"38,383,809", "ALGERIA"=>"38,087,812", "SUDAN"=>"34,847,910", "UGANDA"=>"34,758,809", "CANADA"=>"34,568,211", "MOROCCO"=>"32,649,130", "IRAQ"=>"31,858,481", "AFGHANISTAN"=>"31,108,077", "NEPAL"=>"30,430,267", "PERU"=>"29,849,303", "MALAYSIA"=>"29,628,392", "UZBEKISTAN"=>"28,661,637", "VENEZUELA"=>"28,459,085", "SAUDI ARABIA"=>"26,939,583", "YEMEN"=>"25,338,458", "GHANA"=>"25,199,609", "MOZAMBIQUE"=>"24,096,669", "TAIWAN"=>"23,299,716", "MADAGASCAR"=>"22,599,098", "CAMEROON"=>"22,534,532", "SYRIA"=>"22,457,336", "COTE D"=>"22,400,835", "AUSTRALIA"=>"22,262,501", "ROMANIA"=>"21,790,479", "SRI LANKA"=>"21,675,648", "ANGOLA"=>"18,565,269", "BURKINA FASO"=>"17,812,961", "KAZAKHSTAN"=>"17,736,896", "CHILE"=>"17,216,945", "NIGER"=>"16,899,327", "NETHERLANDS"=>"16,805,037", "MALAWI"=>"16,777,547", "MALI"=>"15,968,882", "ECUADOR"=>"15,439,429", "CAMBODIA"=>"15,205,539", "GUATEMALA"=>"14,373,472", "ZAMBIA"=>"14,222,233", "SENEGAL"=>"13,300,410", "ZIMBABWE"=>"13,182,908", "RWANDA"=>"12,012,589", "CHAD"=>"11,193,452", "GUINEA"=>"1,660,870", "SOUTH SUDAN"=>"11,090,104", "CUBA"=>"11,061,886", "TUNISIA"=>"10,835,873", "PORTUGAL"=>"10,799,270", "GREECE"=>"10,772,967", "CZECH REPUBLIC"=>"10,609,762", "BOLIVIA"=>"10,461,053", "BELGIUM"=>"10,444,268", "SOMALIA"=>"10,251,568", "DOMINICAN REPUBLIC"=>"10,219,630", "HUNGARY"=>"9,939,470", "HAITI"=>"9,893,934", "BENIN"=>"9,877,292", "SWEDEN"=>"9,647,386", "BELARUS"=>"9,625,888", "AZERBAIJAN"=>"9,590,159", "HONDURAS"=>"8,448,465", "AUSTRIA"=>"8,221,646", "SWITZERLAND"=>"7,996,026", "TAJIKISTAN"=>"7,910,041", "ISRAEL"=>"7,707,042", "SERBIA"=>"7,243,007", "TOGO"=>"7,154,237", "HONG KONG"=>"7,082,316", "BULGARIA"=>"6,981,642", "LAOS"=>"6,695,166", "PARAGUAY"=>"6,623,252", "JORDAN"=>"6,482,081", "PAPUA NEW GUINEA"=>"6,431,902", "ERITREA"=>"6,233,682", "EL SALVADOR"=>"6,108,590", "LIBYA"=>"6,002,347", "NICARAGUA"=>"5,788,531", "SIERRA LEONE"=>"5,612,685", "DENMARK"=>"5,556,452", "KYRGYZSTAN"=>"5,548,042", "SLOVAKIA"=>"5,488,339", "UNITED ARAB EMIRATES"=>"5,473,972", "SINGAPORE"=>"5,460,302", "FINLAND"=>"5,266,114", "CENTRAL AFRICAN REPUBLIC"=>"5,166,510", "TURKMENISTAN"=>"5,113,040", "NORWAY"=>"5,085,582", "GEORGIA"=>"4,942,157", "IRELAND"=>"4,775,982", "COSTA RICA"=>"4,695,942", "CROATIA"=>"4,475,611", "NEW ZEALAND"=>"4,365,113", "LEBANON"=>"4,131,583", "LIBERIA"=>"3,989,703", "BOSNIA AND HERZEGOVINA"=>"3,875,723", "PUERTO RICO"=>"3,645,648", "MOLDOVA"=>"3,619,925", "PANAMA"=>"3,559,408", "LITHUANIA"=>"3,515,858", "MAURITANIA"=>"3,437,610", "URUGUAY"=>"3,324,460", "OMAN"=>"3,154,134", "ARMENIA"=>"3,064,267", "ALBANIA"=>"3,011,405", "MONGOLIA"=>"2,912,192", "JAMAICA"=>"2,909,714", "KUWAIT"=>"2,695,316", "WEST BANK"=>"2,676,740", "NAMIBIA"=>"2,182,852", "LATVIA"=>"2,178,443", "BOTSWANA"=>"2,127,825", "MACEDONIA"=>"2,087,171", "QATAR"=>"2,042,444", "SLOVENIA"=>"1,992,690", "LESOTHO"=>"1,936,181", "GAMBIA"=>"1,883,051", "KOSOVO"=>"1,847,708", "GAZA STRIP"=>"1,763,387", "GABON"=>"1,640,286", "SWAZILAND"=>"1,403,362", "MAURITIUS"=>"1,322,238", "BAHRAIN"=>"1,281,332", "ESTONIA"=>"1,266,375", "TRINIDAD AND TOBAGO"=>"1,225,225", "TIMOR"=>"1,172,390", "CYPRUS"=>"1,155,403", "BURUNDI"=>"1,060,714", "FIJI"=>"896,758", "DJIBOUTI"=>"792,198", "COMOROS"=>"752,288", "GUYANA"=>"739,903", "BHUTAN"=>"725,296", "EQUATORIAL GUINEA"=>"704,001", "MONTENEGRO"=>"653,474", "SOLOMON ISLANDS"=>"597,248", "MACAU"=>"583,003", "SURINAME"=>"566,846", "WESTERN SAHARA"=>"538,811", "CABO VERDE"=>"531,046", "LUXEMBOURG"=>"514,862", "BRUNEI"=>"415,717", "MALTA"=>"411,277", "MALDIVES"=>"393,988", "BELIZE"=>"334,297", "BAHAMAS"=>"319,031", "ICELAND"=>"315,281", "BARBADOS"=>"288,725", "FRENCH POLYNESIA"=>"277,293", "NEW CALEDONIA"=>"264,022", "VANUATU"=>"261,565", "SAMOA"=>"195,476", "SAO TOME AND PRINCIPE"=>"186,817", "SAINT LUCIA"=>"162,781", "GUAM"=>"160,378", "CURACAO"=>"146,836", "GRENADA"=>"109,590", "ARUBA"=>"109,153", "TONGA"=>"106,322", "MICRONESIA"=>"106,104", "VIRGIN ISLANDS"=>"104,737", "KIRIBATI"=>"103,248", "SAINT VINCENT AND THE GRENADINES"=>"103,220", "JERSEY"=>"95,732", "SEYCHELLES"=>"90,846", "ANTIGUA AND BARBUDA"=>"90,156", "ISLE OF MAN"=>"86,159", "ANDORRA"=>"85,293", "DOMINICA"=>"73,286", "MARSHALL ISLANDS"=>"69,747", "BERMUDA"=>"69,467", "GUERNSEY"=>"65,605", "GREENLAND"=>"57,714", "AMERICAN SAMOA"=>"54,719", "CAYMAN ISLANDS"=>"53,737", "NORTHERN MARIANA ISLANDS"=>"51,170", "SAINT KITTS AND NEVIS"=>"51,134", "FAROE ISLANDS"=>"49,709", "TURKS AND CAICOS ISLANDS"=>"47,754", "SINT MAARTEN"=>"39,689", "LIECHTENSTEIN"=>"37,009", "SAN MARINO"=>"32,448", "BRITISH VIRGIN ISLANDS"=>"31,912", "SAINT MARTIN"=>"31,264", "MONACO"=>"30,500", "GIBRALTAR"=>"29,111", "PALAU"=>"21,108", "ANGUILLA"=>"15,754", "DHEKELIA"=>"15,700", "AKROTIRI"=>"15,700", "WALLIS AND FUTUNA"=>"15,507", "TUVALU"=>"10,698", "COOK ISLANDS"=>"10,447", "NAURU"=>"9,434", "SAINT HELENA"=>"7,754", "SAINT BARTHELEMY"=>"7,298", "SAINT PIERRE AND MIQUELON"=>"5,774", "MONTSERRAT"=>"5,189", "FALKLAND ISLANDS"=>"3,140", "NORFOLK ISLAND"=>"2,196", "SVALBARD"=>"1,921", "CHRISTMAS ISLAND"=>"1,513", "TOKELAU"=>"1,353", "NIUE"=>"1,229", "HOLY SEE"=>"839", "COCOS"=>"596", "PITCAIRN ISLANDS"=>"65"}

		country_map_id_hash = {"DZ"=>12, "YE"=>887, "AT"=>40, "AU"=>36, "AR"=>32, "BH"=>48, "BE"=>56, "BR"=>76, "CA"=>124, "CL"=>152, "CO"=>170, "CZ"=>203, "DK"=>208, "EG"=>818, "FI"=>246, "FR"=>250, "DE"=>276, "GH"=>288, "GR"=>300, "HK"=>344, "HU"=>348, "IN"=>356, "ID"=>360, "IE"=>372, "IL"=>376, "IT"=>380, "JP"=>392, "JO"=>400, "KE"=>404, "KR"=>410, "KW"=>414, "MY"=>458, "MX"=>484, "MA"=>504, "NL"=>528, "NO"=>578, "OM"=>512, "PE"=>604, "PH"=>608, "PL"=>616, "PT"=>620, "QA"=>634, "RO"=>642, "RU"=>643, "SA"=>682, "SN"=>686, "SG"=>702, "SK"=>703, "ZA"=>710, "ES"=>724, "SE"=>752, "CH"=>756, "TW"=>158, "TN"=>788, "TR"=>792, "UG"=>800, "UA"=>804, "AE"=>784, "GB"=>826, "US"=>840}

		countries.each do |code, name|
		  flag_url = "http://flagpedia.net/data/flags/normal/#{code.downcase}.png"
		  pop = population[name].gsub(',', '').to_i
		  Country.create(code: code, name: name, flag_url: flag_url, population: pop, map_id: country_map_id_hash[code])

		end

		Country.all.each do |country|
		  # grab top videos for country here
		  country_code = country.code
		  num = 10
		  url = "http://gdata.youtube.com/feeds/api/standardfeeds/#{country_code}/most_popular?v=2&time=today&max-results=#{num}"

		  results = HTTParty.get(url).body
		  results_json = Hash.from_xml(results)

		  results_json["feed"]["entry"].each do |entry|

		    if big_url_cnt = entry["content"]
		      big_url = big_url_cnt['src']

		      if Video.exists?(big_url: big_url)
		        vid = Video.where(big_url: big_url).first
		      else
		        vid = Video.new(
		          # get relevant video attributes from results_json
		          title: entry["title"],
		          normal_url: entry["link"].first["href"],
		          big_url: entry["content"]["src"],
		          term: entry["category"][1]["term"],
		          thumbnail_url: entry["group"]["thumbnail"][0]["url"],
		          top: true
		        )
		        embeddable_url = vid.youtube_embed
		        vid.embed_url = embeddable_url
		        vid.save
		      end

		      puts CountryVideo.create(country_id: country.id, video_id: vid.id)
		    end
		  end

		  # categories = ["News", "Music", "Entertainment", "Tech", "Animals"]
		  news_url = "https://gdata.youtube.com/feeds/api/standardfeeds/#{country_code}/most_popular_News?v=2&time=today&max-results=10"
		  music_url = "https://gdata.youtube.com/feeds/api/standardfeeds/#{country_code}/most_popular_Music?v=2&time=today&max-results=#{num}"
		  entertainment_url = "https://gdata.youtube.com/feeds/api/standardfeeds/#{country_code}/most_popular_Entertainment?v=2&time=today&max-results=#{num}"
		  tech_url = "https://gdata.youtube.com/feeds/api/standardfeeds/#{country_code}/most_popular_Tech?v=2&time=today&max-results=#{num}"
		  animals_url = "https://gdata.youtube.com/feeds/api/standardfeeds/#{country_code}/most_popular_Animals?v=2&time=today&max-results=#{num}"

		  news_results = HTTParty.get(news_url).body
		  news_results_json = Hash.from_xml(news_results)

		  news_results_json["feed"]["entry"].each do |entry|
		    if big_url_cnt = entry["content"]
		      big_url = big_url_cnt['src']

		      if Video.exists?(big_url: big_url)
		        vid = Video.where(big_url: big_url).first
		      else
		        vid = Video.new(
		          # get relevant video attributes from results_json
		          title: entry["title"],
		          normal_url: entry["link"].first["href"],
		          big_url: entry["content"]["src"],
		          term: entry["category"][1]["term"],
		          thumbnail_url: entry["group"]["thumbnail"][0]["url"],
		          top: false
		        )
		        embeddable_url = vid.youtube_embed
		        vid.embed_url = embeddable_url
		        vid.save
		      end

		      puts CountryVideo.create(country_id: country.id, video_id: vid.id)
		    end
		  end

		  music_results = HTTParty.get(music_url).body
		  music_results_json = Hash.from_xml(music_results)

		  music_results_json["feed"]["entry"].each do |entry|
		    if big_url_cnt = entry["content"]
		      big_url = big_url_cnt['src']

		      if Video.exists?(big_url: big_url)
		        vid = Video.where(big_url: big_url).first
		      else
		        vid = Video.new(
		          # get relevant video attributes from results_json
		          title: entry["title"],
		          normal_url: entry["link"].first["href"],
		          big_url: entry["content"]["src"],
		          term: entry["category"][1]["term"],
		          thumbnail_url: entry["group"]["thumbnail"][0]["url"],
		          top: false
		        )
		        embeddable_url = vid.youtube_embed
		        vid.embed_url = embeddable_url
		        vid.save
		      end

		      puts CountryVideo.create(country_id: country.id, video_id: vid.id)
		    end
		  end

		  entertainment_results = HTTParty.get(entertainment_url).body
		  entertainment_results_json = Hash.from_xml(entertainment_results)

		  entertainment_results_json["feed"]["entry"].each do |entry|
		    if big_url_cnt = entry["content"]
		      big_url = big_url_cnt['src']

		      if Video.exists?(big_url: big_url)
		        vid = Video.where(big_url: big_url).first
		      else
		        vid = Video.new(
		          # get relevant video attributes from results_json
		          title: entry["title"],
		          normal_url: entry["link"].first["href"],
		          big_url: entry["content"]["src"],
		          term: entry["category"][1]["term"],
		          thumbnail_url: entry["group"]["thumbnail"][0]["url"],
		          top: false
		        )
		        embeddable_url = vid.youtube_embed
		        vid.embed_url = embeddable_url
		        vid.save
		      end

		      puts CountryVideo.create(country_id: country.id, video_id: vid.id)
		    end
		  end

		  tech_results = HTTParty.get(tech_url).body
		  tech_results_json = Hash.from_xml(tech_results)

		  tech_results_json["feed"]["entry"].each do |entry|
		    if big_url_cnt = entry["content"]
		      big_url = big_url_cnt['src']

		      if Video.exists?(big_url: big_url)
		        vid = Video.where(big_url: big_url).first
		      else
		        vid = Video.new(
		          # get relevant video attributes from results_json
		          title: entry["title"],
		          normal_url: entry["link"].first["href"],
		          big_url: entry["content"]["src"],
		          term: entry["category"][1]["term"],
		          thumbnail_url: entry["group"]["thumbnail"][0]["url"],
		          top: false
		        )
		        embeddable_url = vid.youtube_embed
		        vid.embed_url = embeddable_url
		        vid.save
		      end

		      puts CountryVideo.create(country_id: country.id, video_id: vid.id)
		    end
		  end

		  animals_results = HTTParty.get(animals_url).body
		  animals_results_json = Hash.from_xml(animals_results)

		  animals_results_json["feed"]["entry"].each do |entry|
		    if big_url_cnt = entry["content"]
		      big_url = big_url_cnt['src']

		      if Video.exists?(big_url: big_url)
		        vid = Video.where(big_url: big_url).first
		      else
		        vid = Video.new(
		          # get relevant video attributes from results_json
		          title: entry["title"],
		          normal_url: entry["link"].first["href"],
		          big_url: entry["content"]["src"],
		          term: entry["category"][1]["term"],
		          thumbnail_url: entry["group"]["thumbnail"][0]["url"],
		          top: false
		        )
		        embeddable_url = vid.youtube_embed
		        vid.embed_url = embeddable_url
		        vid.save
		      end

		      puts CountryVideo.create(country_id: country.id, video_id: vid.id)
		    end
		  end

		end

    end

  end