const express = require('express');
const server = require('http').createServer();
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: __dirname });
});

server.on('request', app);
server.listen(PORT, () => console.log('server started on port 3000'));

/** Begin websocket */
const WebSocketServer = require('ws').Server;

const wss = new WebSocketServer({ server });

wss.on('connection', function connection(ws) {
  const clientsCounter = wss.clients.size;

  console.log('clients connected: ', clientsCounter);

  wss.broadcast(`Current visitors: ${clientsCounter}`);

  if (ws.readyState === ws.OPEN) {
    ws.send('Hey, welcome to the cookie smart server!');
  }

  ws.on('close', function close() {
    wss.broadcast(`Current visitors: ${clientsCounter}`);
    console.log('A client has disconnected');
  });

  ws.on('error', function error() {
    //
  });
});

/**
 * Broadcast data to all connected clients
 * @param  {Object} data
 * @void
 */
wss.broadcast = function broadcast(data) {
  console.log('Broadcasting: ', data);
  wss.clients.forEach(function each(client) {
    client.send(data);
  });
};
/** End Websocket **/
