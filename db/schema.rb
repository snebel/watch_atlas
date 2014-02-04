# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20140204025913) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "countries", force: true do |t|
    t.string  "name"
    t.string  "flag_url"
    t.integer "population"
    t.string  "code"
    t.integer "map_id"
  end

  create_table "country_videos", force: true do |t|
    t.integer  "country_id"
    t.integer  "video_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "videos", force: true do |t|
    t.string   "title"
    t.string   "normal_url"
    t.string   "big_url"
    t.string   "term"
    t.integer  "view_count"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "thumbnail_url"
    t.string   "embed_url"
    t.boolean  "top"
  end

end
