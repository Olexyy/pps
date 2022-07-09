class App {

    constructor(io, store, debug) {
        this.io = io;
        this.sockets = io.of('/poker');
        this.store = store;
        this.debug = debug;
    }

    bind() {
        this.sockets.on('connect', socket => {
            socket.on('join', (room, uuid, pass) => {
                if (this.debug) {
                    console.log('join::', JSON.stringify(room), JSON.stringify(uuid), JSON.stringify(pass));
                }
                if (!this.store.roomExists(room)) {
                    this.sockets.to(socket.id).emit('join_fail', 'room');
                } else if (!this.store.roomAccess(room, uuid, pass)) {
                    this.sockets.to(socket.id).emit('join_fail', 'pass');
                } else {
                    this.store.ensureUser(room, socket, uuid);
                    this.sockets.to(room).emit('status', this.store.getRoom(room));
                }
            });
            socket.on('create_room', (global, room, uuid, pass, state) => {
                if (this.debug) {
                    console.log('create_room::',JSON.stringify(room), JSON.stringify(uuid), JSON.stringify(pass));
                }
                if (this.store.createRoom(room, pass, uuid, state)) {
                    this.store.ensureUser(room, socket, uuid);
                    console.log(JSON.stringify(this.store.getRoom(room)));
                    this.sockets.to(socket.id).emit('create_room', room, true);
                } else {
                    this.sockets.to(socket.id).emit('create_room', room, false);
                }
            });
            socket.on('join_room', (global, room) => {
                if (this.debug) {
                    console.log('join_room::',JSON.stringify(room));
                }
                if (this.store.roomExists(room)) {
                    this.sockets.to(socket.id).emit('join_room', room, true);
                } else {
                    this.sockets.to(socket.id).emit('join_room', room, false);
                }
            });
            socket.on('delete_room', (room) => {
                if (this.debug) {
                    console.log('delete_room::' + room);
                }
                this.store.deleteRoom(room);
                this.sockets.to(room).emit('kick', room, true);
            });
            socket.on('update', (room, userProps = {}, appProps = {}) => {
                if (this.debug) {
                    console.log('update::',JSON.stringify(room), JSON.stringify(userProps), JSON.stringify(appProps));
                }
                this.store.syncApp(room, appProps);
                const id = this.store.getRoom(room).sockets[socket.id];
                this.store.syncUser(room, id, userProps);
                this.sockets.to(room).emit('status', this.store.getRoom(room));
            });
            socket.on('trigger', (room, name, data = {}) => {
                if (this.debug) {
                    console.log('trigger::' + room + name);
                }
                this.sockets.to(room).emit('trigger', name, data);
            });
            socket.on('bulk', (room, usersProps = {}, appProps = {}) => {
                if (this.debug) {
                    console.log('bulk::',JSON.stringify(room), JSON.stringify(usersProps), JSON.stringify(appProps));
                }
                this.store.syncApp(room, appProps);
                this.store.syncUsers(room, usersProps);
                this.sockets.to(room).emit('status', this.store.getRoom(room));
            });
            socket.on('kick', (room, uuid) => {
                if (this.debug) {
                    console.log('kick::' + room + uuid);
                }
                const socketId = this.store.kickUser(room, uuid);
                if (socketId) {
                    this.sockets.to(socketId).emit('kick');
                }
                this.sockets.to(room).emit('status', this.store.getRoom(room));
            });
            socket.on('liveness', () => {
                if (this.debug) {
                    console.log(`liveness::${socket.id}`);
                }
            });
            socket.on('disconnect', () => {
                if (this.debug) {
                    console.log('disconnect::' + socket.id);
                }
                this.store.deleteUser(socket.id);
            });
            socket.on('error', e => {
                if (this.debug) {
                    console.log('error::' + JSON.stringify(e));
                }
                const room = this.store.deleteUser(socket.id);
                if (room) {
                    this.sockets.to(room).emit('status', this.store.getRoom(room));
                }
            });
        });
    }
}

module.exports = App;