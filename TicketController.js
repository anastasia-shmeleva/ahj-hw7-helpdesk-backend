import * as tickets from './tickets.json';
import { v1 as uuidv1 } from 'uuid';

export default class TicketController {
  static ticketById(id) {
    const body = tickets.default.tickets.find((ticket) => ticket.id === id);
    const status = 200;
    return { body, status };
  }

  static getTickets() {
    const body = tickets;
    const status = 200;
    return { body, status };
  }

  static deleteTicket(id) {
    const item = tickets.default.tickets.find((ticket) => ticket.id === id);
    const index = tickets.default.tickets.indexOf(item);
    tickets.default.tickets.splice(index,1);
    const status = 204;
    return { status };
  }

  static updateTicket({ id, name, description}) {
    const item = tickets.default.tickets.find((ticket) => ticket.id === id);
    item.name = name;
    item.description = description;

    const status = 204;
    return { status };
  }

  static createTicket({ name, description, created }) {
    console.log('create method works');
    // const newTicket = {
    //   id: `${uuidv1()}`,
    //   name : name,
    //   description: description,
    //   status: false,
    //   created: created,
    // }

    // console.log(newTicket);
    // tickets.push(newTicket);
    // const body = tickets;
    // const status = 200;
    // return { body, status };
  }

  static changeStatus(id) {
    const item = tickets.default.tickets.find((ticket) => ticket.id === id);

    if (item.status === false) {
      item.status = true;
    } else item.status = false;
  }
}
