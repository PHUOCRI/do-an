import { Server } from 'socket.io'

export const ConnectSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.NODE_ENV === 'production'
                ? ['https://your-production-domain.com']
                : ['http://localhost:3000'],
            methods: ['GET', 'POST']
        }
    })

    io.on('connection', (socket) => {
        console.log('User connected:', socket.id)

        socket.on('join_room', (data) => {
            socket.join(data)
            console.log(`User with ID: ${socket.id} joined room: ${data}`)
        })

        socket.on('send_message', (data) => {
            socket.to(data.room).emit('receive_message', data)
        })

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id)
        })
    })
}
