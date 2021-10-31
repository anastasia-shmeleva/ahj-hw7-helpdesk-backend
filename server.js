import { createServer } from 'http';
import Koa from 'koa';
import koaBody from 'koa-body';
import { v4 } from 'uuid';
import * as tickets from './tickets.json';

const app = new Koa();

app.use(koaBody({
  text: true,
  urlencoded: true,
  multipart: true,
  json: true,
}));

app.use(async (ctx, next) => {
  const origin = ctx.request.get('Origin');
  if (!origin) {
    return await next();
  }
  const headers = { 'Access-Control-Allow-Origin': '*', };

  if (ctx.request.method !== 'OPTIONS') {
    ctx.response.set({...headers});
    try {
      return await next();
    } catch (e) {
      e.headers = {...e.headers, ...headers};
      throw e;
    }
  }

  if (ctx.request.get('Access-Control-Request-Method')) {
    ctx.response.set({
      ...headers,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH',
    });

    if (ctx.request.get('Access-Control-Request-Headers')) {
      ctx.response.set('Access-Control-Allow-Headers', ctx.request.get('Access-Control-Request-Headers'));
    }
    ctx.response.status = 204;
  }
});

class Tickets {
  constructor(id, name, description, status, created) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.status = status;
    this.created = created;
  }
}

app.use(async ctx => {
  // GET
  if (ctx.method === 'GET') {
    const { method } = ctx.request.query;
    switch (method) {
      case 'allTickets':
        ctx.response.body = tickets.default.map((item) => {
          return {
            id: item.id,
            name: item.name,
            status: item.status,
            created: item.created,
          };
        });
        return;
      case 'ticketById':
        const { id } = ctx.request.query;
        if (id) {
          const ticket = tickets.default.find(item => item.id == id);
          if (ticket) {
            ctx.response.body = ticket;
          } else {
            ctx.response.status = 404;
          }
        }
        return;
      default: 
        ctx.response.status = 404;
        return;
    }
  }

  // POST
  if (ctx.method === 'POST') {
    const { name, description, created } = ctx.request.body;
    const id = v4();
    tickets.default.push(new Tickets(id, name, description, false, created));
    ctx.response.body = tickets.default;
    console.log(tickets.default);
    return;
  };

  // PUT
  if (ctx.method === 'PUT') {
    const { id, name, description } = ctx.request.body;
    const index = tickets.default.findIndex((item) => item.id === id);
    console.log(tickets.default[index]);
    tickets.default[index].name = name;
    tickets.default[index].description = description;
    ctx.response.body = 'ok';
    return;
  }

  // PATCH
  if (ctx.method === 'PATCH') {
    const { id, status } = ctx.request.body;
    const index = tickets.default.findIndex((item) => item.id === id);
    tickets.default[index].status = status;
    ctx.response.body = 'ok';
    return;
  }

  // DELETE
  if (ctx.method === 'DELETE') {
    const { id } = ctx.request.query;
    const foundIndex = tickets.default.findIndex((item) => item.id === id);
    tickets.default.splice(foundIndex, 1);
    ctx.response.body = 'ok';
    return;
  }
});

const port = process.env.PORT || 7070;

const server = createServer(app.callback());

server.listen(port, () => {
  console.log(`Koa server has been started on port ${port}`);
});