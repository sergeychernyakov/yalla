class CreateTransactionTickets < ActiveRecord::Migration[6.1]
  def change
    create_table :transaction_tickets do |t|
      t.integer :buyer_id, null: false
      t.integer :seller_id, null: false
      t.integer :creator_id, null: false
      t.integer :ticket_type, null: false
      t.integer :status, default: 0
      t.integer :payment_method
      t.boolean :approved_by_receiver, default: false
      t.text :description
      t.text :notes
      t.text :additional_comments
      t.text :service_success_rate
      t.string :amount

      t.timestamps
    end
  end
end
