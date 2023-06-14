require("dotenv").config()
const http = require("http")
const express = require("express")
const path = require("path")
const socketio = require("socket.io")
const app = express()
const { generateMessage, generateLocationMessage } = require("../src/utils/message")
const server = http.createServer(app);
const staticPath = path.join(__dirname, "../public")
const { addUser, getUser, getUsersInRoom, removeUser } =require('../src/utils/users')
app.use(express.static(staticPath))
const io = socketio(server)
io.on('connection', (socket) => {

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);
        console.log(message)
        io.to(user.room).emit('message', generateMessage(message,user.username))
        callback();
    })

    socket.on('join',(options,callback)=>{
        console.log(options)    
        const {error , user} = addUser({id:socket.id, username:options.username,room:options.room})
        console.log(user)
        if(error)
        {
            return callback(error)
        }
        socket.join(user.room)
        socket.emit('message', generateMessage('Welcome to chat'))
        socket.broadcast.to(user.room).emit('message', generateMessage(`${user.username} has joined!`))
        io.to(user.room).emit('roomData',{
            room:user.room,
            users:getUsersInRoom(user.room)
        })
    })
    

    
    socket.on('sendLocation', (coords, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage', generateLocationMessage('Admin '`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })


    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        io.to(user.room).emit('message', generateMessage('Admin',`${user.username} has left..!`))
        io.to(user.room).emit('roomData',{
            room:user.room,
            users:getUsersInRoom(user.room)
        })
        // location.href()
    })

})
server.listen(process.env.PORT)