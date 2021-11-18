# frozen_string_literal: true

class TransactionTicket < ActiveRecord::Base

  WHITELIST_ATTRIBUTES = %i[
    id
    buyer_id
    seller_id
    creator_id
    ticket_type
    status
    payment_method
    approved_by_receiver
    description
    notes
    additional_comments
    service_success_rate
    amount
  ].freeze

  has_many :ticket_admins
  has_many :admins, through: :ticket_admins, class_name: 'User' , foreign_key: 'admin_id'

  belongs_to :buyer, class_name: 'User', foreign_key: 'buyer_id'
  belongs_to :seller, class_name: 'User', foreign_key: 'seller_id'
  belongs_to :creator, class_name: 'User', foreign_key: 'creator_id'

  validates :buyer_id, :seller_id, :creator_id, :ticket_type, presence: true

  PAYMENT_METHOD = %i[
    paypal
    bank_wife
    bit_coin
    ethereum
    usdt
  ].freeze

  STATUS = %i[
    pending
    approved
    payment_due
    completed
  ].freeze

  TICKET_TYPE = %i[
    service
    item
    other
  ].freeze

  enum ticket_type: TICKET_TYPE
  enum status: STATUS
  enum payment_method: PAYMENT_METHOD
end
