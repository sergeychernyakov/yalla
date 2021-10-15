class CreateTicketAdmins < ActiveRecord::Migration[6.1]
  def change
    create_table :ticket_admins do |t|
      t.references :transaction_ticket, null: false
      t.integer :admin_id, null: false

      t.timestamps
    end
  end
end
