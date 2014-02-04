class AddTopColumnToVideosTable < ActiveRecord::Migration
  def change
    add_column :videos, :top, :boolean
  end
end
