WdiProject2::Application.routes.draw do

  root to: "countries#index"

  resources :countries
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  get '/testing' => 'maptests#index'
  get '/countries/maps/:map_id' => 'countries#get_country_data'

end
