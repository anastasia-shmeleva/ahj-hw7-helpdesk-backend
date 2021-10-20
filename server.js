import ticketController from './TicketController.js';
import Koa from 'koa';
import koaBody from 'koa-body';
import cors from 'koa2-cors';
import http from 'http';
const app = new Koa();

app.use(koaBody({
    text: true,
    urlencoded: true,
    multipart: true,
    json: true,
}));

//Cors
app.use(
    cors({
      origin: '*',
      credentials: true,
      'Access-Control-Allow-Origin': true,
      allowMethods: ['GET', 'POST', 'PATCH', 'DELETE'],
    })
);

app.use(async (ctx) => {
  let method;
  if (ctx.request.method === 'GET' || ctx.request.method === 'DELETE'|| ctx.request.method === 'PATCH') ({ method } = ctx.request.query);
  else if (ctx.request.method === 'POST') ({ method } = ctx.request.body);

  switch (method) {
    case 'allTickets': ctx.response.body = ticketController.getTickets();
      break;
    case 'ticketById': ctx.response.body = ticketController.ticketById(ctx.request.query.id);
      break;
    case 'createTicket': ctx.response.body = `Request Body: ${JSON.stringify(ctx.request.body)}`;
      break;
    case 'changeStatus': ctx.response.body = ticketController.changeStatus(ctx.request.query.id);
      break;
    case 'updateTicket': ctx.response.body = ticketController.updateTicket(ctx.request.query);
      break;
    case 'deleteTicket': ctx.response.body = ticketController.deleteTicket(ctx.request.query.id);
      break;
    default:
      ctx.response.status = 404;
      ctx.response.body = `Unknown method '${method}' in request parameters`;
  }
});

const port = process.env.PORT || 7070;

const server = http.createServer(app.callback());

server.listen(port, () => {
  console.log(`Koa server has been started on port ${port}`);
});
