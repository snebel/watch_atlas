class CreateCountryVideos < ActiveRecord::Migration
  def change
    create_table :country_videos do |t|
      t.integer :country_id
      t.integer :video_id

      t.timestamps
    end
  end
end
