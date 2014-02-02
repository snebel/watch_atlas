class AddMapIdColumnToCountriesTable < ActiveRecord::Migration
  def change
    add_column :countries, :map_id, :integer
  end
end
