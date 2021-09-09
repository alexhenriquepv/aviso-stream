const express = require('express')
const cors = require('cors')

const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:8000",
        methods: ["GET", "POST"]
    }
})

const { ExpressPeerServer } = require('peer')

const PORT = process.env.PORT || 3000

const peerServer = ExpressPeerServer(server, {
    debug: 3,
})

app.use(cors())
app.use('/peerjs', peerServer)

io.on('connection', (socket) => {
    socket.on('want-join-room', (roomId, peerId) => {
        socket.join(roomId)
        socket.to(roomId).emit('user-connected', peerId)
    })

    socket.on('want-stop-stream', (roomId, peerId) => {
        socket.to(roomId).emit('stop-stream', peerId)
    })
})

app.get('/', (req, res) => {
    res.status(200).send('Stream App');
})

server.listen(3000, () => {
    console.log(`server running on port ${PORT}`)
})