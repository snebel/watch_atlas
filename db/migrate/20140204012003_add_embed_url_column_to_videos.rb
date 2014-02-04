class AddEmbedUrlColumnToVideos < ActiveRecord::Migration
  def change
    add_column :videos, :embed_url, :string
  end
end
