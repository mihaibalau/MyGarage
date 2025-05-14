const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const cars = require('./routes/cars');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.json());
app.use(cors());
app.use('/api/cars', cars);

io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
});

// END

const port = process.env.PORT || 3001;
server.listen(port, () => console.log(`Server + WebSocket listening on port ${port}...`));

module.exports = app;
