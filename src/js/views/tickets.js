import currencyUI from "./currency";

class TicketsUI {
  constructor(currency) {
   this.container = document.querySelector(".tickets-sections .row");
   this.getCurrencySymbol = currency.getCurrencySymbol.bind(currency);
  }
  renderTickets(tickets){
   this.clearContainer();

   if(!tickets.length){
     this.showEmtyMsg();
     return;
   }

   let fragment = "";
   const currency = this.getCurrencySymbol();
   tickets.forEach(element => {
    const template = TicketsUI.ticketTemplate(element, currency);
    fragment += template;
   });
   this.container.insertAdjacentHTML("afterbegin", fragment);

  }
  clearContainer() {
   this.container.innerHTML = "";
  }
  showEmtyMsg() {
   const template = TicketsUI.emptyMsgTemplate();
   this.container.insertAdjacentElement("afterbegin", template);
  }
  static emptyMsgTemplate() {
    return `
    <div class="tickets-empty-res-msg">
    No flights found.
    </div>
  `
  }
  static ticketTemplate(ticket, currencySym) {
    return `
    <div class="col s12 m6">
            <div class="card ticket-card">
              <div class="ticket-airline d-flex align-items-center">
                <img
                  src="${ticket.airline_logo}"
                  class="ticket-airline-img"
                />
                <span class="ticket-airline-name"
                  >${ticket.airline_name}</span
                >
              </div>
              <div class="ticket-destination d-flex align-items-center">
                <div class="d-flex align-items-center mr-auto">
                  <span class="ticket-city">${ticket.origin_name}</span>
                  <i class="medium material-icons">flight_takeoff</i>
                </div>
                <div class="d-flex align-items-center">
                  <i class="medium material-icons">flight_land</i>
                  <span class="ticket-city">${ticket.destination_name}</span>
                </div>
              </div>
              <div class="ticket-time-price d-flex align-items-center">
                <span class="ticket-time-departure">${ticket.departure_at}</span>
                <span class="ticket-price ml-auto">${currencySym}${ticket.price}</span>
              </div>
              <div class="ticket-additional-info">
                <span class="ticket-transfers">Transfers: ${ticket.transfers}</span>
                <span class="ticket-flight-number">Flight number: ${ticket.flight_number}</span>
              </div>
            </div>
          </div>
    `
  }
}
const ticketsUI = new TicketsUI(currencyUI);
export default ticketsUI;
