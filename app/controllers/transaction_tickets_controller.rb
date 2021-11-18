# frozen_string_literal: true

class TransactionTicketsController < ApplicationController
  include Api::Pagination
  before_action :load_transaction_ticket, only: %i[destroy update show schedule_tasks ]

  def index
    @transaction_tickets = TransactionTicket.order('created_at DESC')
    @transaction_tickets = @transaction_tickets.by_keyword(params[:keyword]) if params[:keyword].present?
    @transaction_tickets = @transaction_tickets.paginate page: page, per_page: per_page
    render json: { success: true, message: 'List of all Transaction Tickets', data: @transaction_tickets.as_json, meta_attributes: meta_attributes(@transaction_tickets) }, status: :ok
  end

  def create
    @transaction_ticket = TransactionTicket.new(transaction_ticket_params)
    @transaction_ticket.creator_id = current_user&.id
    if @transaction_ticket.save
      TicketAdmin.create!(transaction_ticket_id: @transaction_ticket.id, admin_id: current_user&.id)
      render json: { success: true, message: 'Transaction Ticket Created Successfully', data: @transaction_ticket.as_json }, status: :ok
    else
      render json: { success: false, message: 'Errors', error: @transaction_ticket.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    if @transaction_ticket.destroy
      TicketAdmin.find_by(transaction_ticket_id: @transaction_ticket.id, admin_id: current_user&.id)&.destroy
      render json: { success: true, message: 'Transaction Ticket Deleted Successfully', data: @transaction_ticket.as_json }, status: :ok
    else
      render json: { success: false, message: 'Errors', error: @transaction_ticket.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @transaction_ticket.update_attributes(transaction_ticket_params)
      render json: { success: true, message: 'Transaction Ticket Updated Successfully', data: @transaction_ticket.as_json }, status: :ok
    else
      render json: { success: false, message: 'Errors', error: @transaction_ticket.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def show
    if @transaction_ticket.present?
      render json: { success: true, message: 'Transaction Ticket Details', data: @transaction_ticket.as_json }, status: :ok
    else
      render json: { success: false, message: 'Errors', error: @transaction_ticket.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def transaction_ticket_params
    params.require(:transaction_ticket).permit(TransactionTicket::WHITELIST_ATTRIBUTES)
  end

  def load_transaction_ticket
    @transaction_ticket = TransactionTicket.find_by(id: params[:id])
  end

  def per_page
    params.fetch(:per_page, 30)
   end

  def page
    params.fetch(:page, 1)
  end
end
