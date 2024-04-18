const fastify = require('fastify')({ logger: true });
const mongoose = require('mongoose');
const screenRoutes = require('./src/routes/screensRoutes');
const collectionsRoutes = require('./src/routes/collectionsRoutes');
const funcs = require("./src/utils");

fastify.register(require('@fastify/websocket'));

//const contentRangeHook = require('./hooks/preHandlerHook');

//const app = fastify();

try {
  mongoose.connect('mongodb://user:c1v2b3n4@127.0.0.1:27017/main_db');
  mongoose.connection.once('connected', function() {
    console.log("Database connected successfully")
  });
} catch (e) {
  console.error(e, 'start error');
}

//app.addHook('preHandler', contentRangeHook);

screenRoutes(fastify);
collectionsRoutes(fastify);

fastify.get('/', async (request, reply) => {
  return { };
});

fastify.register(async function(fastify) {
  fastify.get('/chart', { websocket: true }, async (connection, req) => {
    const existCharts = await funcs.getCharts();
    console.log(existCharts, ' === exist')
    await existCharts?.forEach(element => {
      funcs.updateChartData(element, connection);
    });

    //connection.socket.send('hi from server');
//! at start get all charts and get their info, further check upd time and 
//! kick off setinterval for everyone and send every upd time data to user. 

    connection.socket.on('open', () => {
      console.log('start ws')
    });
    connection.socket.on('close', () => {
      
    });
  // Broadcast incoming message
    connection.socket.on('message', (message) => {
        message = JSON.parse(message.toString());
        console.log('ws');


    });
  });
})

// Run the server!
fastify.listen({ port: 8000 }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }

  //console.log(`Server running on ${address}`);
})