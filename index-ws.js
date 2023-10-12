const express = require('express');
const server = require('http').createServer();
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: __dirname });
});

server.on('request', app);
server.listen(PORT, () => console.log('server started on port 3000'));

process.on('SIGINT', () => {
  console.log('sigint');
  wss.clients.forEach(function each(client) {
    client.close();
  });
  server.close(shutdownDB);
});

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

  db.run(`INSERT INTO visitors (count, time)
    VALUES (${clientsCounter}, datetime('now'))
  `);

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
/** End websocket **/

/** Begin database */
const sqlite = require('sqlite3');
const db = new sqlite.Database(':memory:');

db.serialize(() => {
  db.run(`
    CREATE TABLE visitors (
      count INTEGER,
      time TEXT
    )
  `);
});

const getCounts = () => {
  db.each('SELECT * FROM visitors', (err, row) => {
    if (err) {
      console.error(err);
    }

    console.log(row);
  });
};

function shutdownDB() {
  getCounts();
  console.log('Shutting down DB');
  db.close();
}
