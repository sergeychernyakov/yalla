class TicketAdmin < ActiveRecord::Base
  belongs_to :transaction_ticket
  belongs_to :admin, class_name: 'User', foreign_key: 'admin_id'
end
