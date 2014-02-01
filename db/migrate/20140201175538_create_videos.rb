class CreateVideos < ActiveRecord::Migration
  def change
    create_table :videos do |t|
      t.string :title
      t.string :normal_url
      t.string :big_url
      t.string :term
      t.integer :view_count

      t.timestamps
    end
  end
end
