const http = require('http');
const path = require('path');
const Koa = require('koa');
const koaBody = require('koa-body');
const koaStatic = require('koa-static');
const uuid = require('uuid');
const app = new Koa();

app.use(async(ctx) => {
    ctx.response.body = 'server response';
});

// для обработки форм методом POST
app.use(koaBody({
    urlencoded:true,
}));

// => Static file handling
const public = path.join(__dirname, '/public')
app.use(koaStatic(public));

const tickets = [
    {
        id: uuid(),
        name: 'Купить билеты',
        description: 'Купить билеты на самолет СПб-Лондон',
        status: false,
        created: Date.now()
    },
    {
        id: uuid(),
        name: 'Назначить встречу',
        description: 'Назначить встречу по новому проекту(Алексей, +79858347766)',
        status: true,
        created: Date.now()
    },
    {
        id: uuid(),
        name: 'Сделать дз',
        description: 'Дз в нетологии',
        status: false,
        created: Date.now()
    }
];

//чтобы с сервера отдавать данные
app.use(async ctx => {
    const { method, id } = ctx.request.querystring;

    switch (method) {
        case 'allTickets':
            ctx.response.body = Object.keys(tickets).filter(function(k) {return [description].indexOf(k) < 0});
            return;
        case 'ticketById':
            ctx.response.body = tickets.find(ticket => ticket.id === id);
            return;
        case 'createTicket':
            const form = JSON.parse(ctx.request.body)
            const newTicket = {
                id: uuid(),
                name: form.name,
                status: false,
                description: form.description || '',
                created: Date.now()
            };
            tickets.push(newTicket);
            ctx.response.body = [newTicket];
            return;
        // TODO: обработка остальных методов
        default:
            ctx.response.status = 404;
            return;
    }
});

const server = http.createServer(app.callback()).listen(7070);










// => CORS
// app.use(async (ctx, next) => {
//   const origin = ctx.request.get('Origin');
//   if (!origin) {
//     return await next();
//   }

//   const headers = { 'Access-Control-Allow-Origin': '*', };

//   if (ctx.request.method !== 'OPTIONS') {
//     ctx.response.set({...headers});
//     try {
//       return await next();
//     } catch (e) {
//       e.headers = {...e.headers, ...headers};
//       throw e;
//     }
//   }

//   if (ctx.request.get('Access-Control-Request-Method')) {
//     ctx.response.set({
//       ...headers,
//       'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH',
//     });

//     if (ctx.request.get('Access-Control-Request-Headers')) {
//       ctx.response.set('Access-Control-Allow-Headers', ctx.request.get('Access-Control-Request-Headers'));
//     }

//     ctx.response.status = 204;
//   }
// });
