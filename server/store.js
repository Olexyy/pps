class Store {
    constructor() {
        this.store = {
            rooms: {},
            socketMap: {}
        };
    }

    syncApp(room, appProps) {
        Object.keys(appProps).forEach(key => {
            this.store.rooms[room].state[key] = appProps[key];
        });
    }

    syncUser(room, id, userProps) {
        this.store.rooms[room].users[id] = this.store.rooms[room].users[id] || {};
        Object.keys(userProps).forEach(key => {
            this.store.rooms[room].users[id][key] = userProps[key];
        });
    }

    syncUsers(room, userProps) {
        Object.values(this.store.rooms[room].users).forEach(user => {
            Object.keys(userProps).forEach(key => {
                user[key] = userProps[key];
            });
        });
    }

    createRoom(room, pass, uuid, state = {}) {
        if (!this.store.rooms.hasOwnProperty(room)) {
            this.store.rooms[room] = {
                sockets: {},
                users: {},
                state: state,
                pass: pass,
                owner: uuid
            };
            return true;
        }
        return false;
    }

    deleteRoom(room) {
        delete this.store.rooms[room];
        Object.keys(this.store.socketMap).forEach(
            socketId => {
                if (this.store.socketMap[socketId] === room) {
                    delete this.store.socketMap[socketId];
                }
            }
        );
    }

    roomExists(room) {
        return this.store.rooms.hasOwnProperty(room);
    }

    roomAccess(room, uuid, pass) {
        if (this.roomExists(room)) {
            // If user is owner.
            if (this.store.rooms[room].owner === uuid) {
                return true;
            }
            // If user already joined.
            else if (this.store.rooms[room].users[uuid] ) {
                return true;
            }
            // If user has pass.
            else if (this.store.rooms[room].pass === pass) {
                return true;
            }
            // If no pass needed.
            else if (this.store.rooms[room].pass === '') {
                return true;
            }
        }
        return false;
    }

    ensureUser(room, socket, uuid) {
        if (!this.store.rooms[room].sockets.hasOwnProperty(socket.id)) {
            this.store.rooms[room].sockets[socket.id] = uuid;
            this.store.rooms[room].users[uuid] = this.store.rooms[room].users[uuid] || {};
            this.store.socketMap[socket.id] = room;
            socket.join(room);
        }
    }

    kickUser(room, uuid) {
        if (this.store.rooms[room].users.hasOwnProperty(uuid)) {
            delete(this.store.rooms[room].users[uuid]);
        }
        let socketId = null;
        Object.keys(this.store.rooms[room].sockets).forEach(key => {
            if (this.store.rooms[room].sockets[key] === uuid) {
                socketId = key;
            }
        });
        return socketId;
    }

    deleteUser(id) {
        if (this.store.socketMap.hasOwnProperty(id)){
            const room = this.store.socketMap[id];
            delete(this.store.rooms[room].sockets[id]);
            return room;
        }
        return null;
    }

    getRoom(room) {
        return this.store.rooms[room];
    }
}

module.exports = Store;