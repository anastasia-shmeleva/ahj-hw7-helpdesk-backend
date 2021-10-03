import * as tickets from './tickets.json';
import { v1 as uuidv1 } from 'uuid';

export default class TicketController {
  getTicketIndex(id) {
    return tickets.findIndex((ticket) => ticket.id === id);
  }

  static getTickets() {
    const body = tickets;
    const status = 200;
    return { body, status };
  }

  createTicket(name, description, created) {
    const newTicket = {
      id: `${uuidv1()}`,
      name : name,
      description: description,
      status: false,
      created: created,
    }

    console.log(newTicket);
    tickets.push(newTicket);
  }

  deleteTicket(id) {
    console.log(id);
    // const elToDelete = tickets.findIndex(el => el.id === id);
    // console.log(elToDelete);
    // tickets.splice(id, 1);
    // const status = 204;
    // return { status };
  }

//   updateTicket() {
//     console.log('update method is working');
//   }
}
