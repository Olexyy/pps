/* eslint-disable no-prototype-builtins */
import {v4 as uuidV4} from "uuid";

class App {

    constructor(timer, result, socketHandler) {
        // Namespace id.
        this.appKey = 'poker';
        this.vote = '';
        this.topic = '';
        this.data = null;
        this.userName = '';
        this.discuss = 'idle';
        this.othersNonVoted = false;
        this.timer = timer;
        this.result = result;
        this.room = null;
        this.socketHandler = socketHandler;
        this.socket = null;
        this.voting = true;
        // Current user uuid.
        this.uuid = '';
        this.isOwner = false;
        this.hasAccess = false;
        this.debug = null;
        this.rooms = {};
        // Predicate to define if room create name is valid.
        this.roomNameCreateValid = true;
        // Predicate to define if room join name is valid.
        this.roomNameJoinValid = true;
        // Predicate to define if pass is valid.
        this.passValid = true;
        this.sound = false;
        this.proposeMax = false;
        this.adminUsers = [];
        this.passAttempt = 'none';
    }

    getAllExceptOwner() {
        const users = {};
        const uuid = this.uuid;
        if (this.data && this.data.hasOwnProperty('users')) {
            Object.values(this.data.users).forEach(function (value) {
                if (value.uuid !== uuid) {
                    users[value.uuid] = value.name;
                }
            });
        }

        return users;
    }

    isGlobalRoom() {
        return this.room === 'global';
    }

    initRoom() {
        let match = window.location.pathname.match(/\/room\/(.+)/);
        if (!match || match.length !== 2) {
            this.room = 'global';
        } else {
            this.room = match[1];
        }
        if (this.isDebug()) {
            console.log(this.room);
        }
    }

    nameExists(name) {
        let exists = false;
        Object.values(this.data.users).forEach(user => {
            if (typeof user === 'object') {
                if (user.hasOwnProperty('name')) {
                    if (user.name === name) {
                        exists = true;
                    }
                }
            }
        });
        return exists;
    }

    isObject(value) {
        return Object(value) === value;
    }

    buildUser(data) {
        const uuid = this.getLocalData().uuid;
        if (!data.hasOwnProperty('uuid')) {
            data.uuid = uuid;
        }
        if (!data.hasOwnProperty('name')) {
            if (this.data.users.hasOwnProperty(uuid)) {
                data.name = this.data.users[uuid].name || '';
            }
            else data.name = '';
        }
        if (!data.hasOwnProperty('vote')) {
            if (this.data.users.hasOwnProperty(uuid)) {
                data.vote = this.data.users[uuid].vote || '';
            }
            else data.vote = '';
        }
        if (!data.hasOwnProperty('voting')) {
            if (this.data.users.hasOwnProperty(uuid)) {
                data.voting = this.data.users[uuid].voting || true;
            }
            else data.voting = true;
        }
        return data;
    }

    isOnline(uuid) {
        let online = false;
        Object.values(this.data.sockets).forEach(id => {
            if (id === uuid) online = true;
        });
        return online;
    }

    validateData(value) {
        let valid = this.isObject(value) &&
            value.hasOwnProperty('sockets') &&
            value.hasOwnProperty('users') &&
            value.hasOwnProperty('state');
        if (valid) {
            const uuid = this.getLocalData().uuid;
            valid = this.isObject(value.users[uuid]);
        }

        return valid;
    }

    doTouch(value) {
        if (this.isObject(value)) {
            this.data = value;
            if (value.hasOwnProperty('rooms')) {
                this.rooms = value.rooms;
            }
        }
    }

    mapData(value, context) {
        if (this.isDebug()) {
            console.log('status:' + JSON.stringify(value));
        }
        // Validate incoming data.
        if (!this.validateData(value)) {
            if (this.isDebug()) {
                console.log('Incoming data is invalid.');
            }
            return;
        }
        // Update fresh data.
        this.rooms = value.rooms;
        this.data = value;
        const uuid = this.getLocalData().uuid;
        this.uuid = uuid;
        if (uuid === value.owner) {
            this.isOwner = true;
        }
        this.hasAccess = true;
        const user = value.users[uuid];
        // This is first time sync.
        if (!user.hasOwnProperty('name') && this.room !== 'global') {
            const storeData = this.getLocalData();
            let storeName = storeData.name;
            if (storeData.name !== '' && !this.nameExists(storeName)) {
                this.emit('update', this.buildUser({
                    name: storeData.name
                }));
                return;
            }
            else {
                if (!context.state.dialogs.name_dialog.hasAttribute('open')) {
                    context.state.dialogs.name_dialog.showModal();
                }
            }
        }
        this.userName = user.name;
        this.voting = user.voting;
        this.result.clear();
        let othersNonVoted = false;
        Object.keys(value.users).forEach((id) => {
            if (value.users[id].vote === '') {
                // Take into account only online users.
                if (this.isOnline(id)) {
                    // Take into account only voting users.
                    if (value.users[id].voting) {
                        // If this is not current user.
                        if (id !== uuid) {
                            othersNonVoted = true;
                        }
                    }
                }
            }
            this.result.addResult(value.users[id].vote, id);
            if (id === uuid) {
                this.vote = value.users[id].vote;
                this.userName = value.users[id].name;
            }
        });
        this.othersNonVoted = othersNonVoted;
        this.discuss = value.state.discuss || 'idle';
        this.topic = value.state.topic || '';
        this.sound = value.state.sound || false;
        this.proposeMax = value.state.proposeMax;
        this.result.setMax(this.proposeMax);
        if (value.state.hasOwnProperty('adminUsers')) {
            this.adminUsers = value.state.adminUsers;
        }
        // If we just started discuss.
        if (this.discuss === 'discuss') {
            this.timer.start();
        }

        if (this.discuss === 'result') {
            this.timer.stop();
            this.result.submit();
        }

        if (this.discuss === 'idle') {
            this.timer.clear();
            this.result.clear();
        }
    }

    createSocket(context) {
        this.socket = this.socketHandler.create(this, context);
    }
    // eslint-disable-next-line no-unused-vars
    trigger(name, data, context) {
        if (name === 'sound') {
            if (this.sound) {
                let src = '/pop_50.mp3';
                let audio = new Audio(src);
                audio.play();
            }
        }
    }

    emit(name, value1 = {}, value2 = {}, value3 = {}, value4 = {}) {
        return this.socket.emit(name, this.room, value1, value2, value3, value4);
    }

    getQueryParam(name, url = window.location.href) {
        const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
        const results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    isSU() {
        return this.getQueryParam('su') === 'me';
    }

    isDebug() {
        if (this.debug === null) {
            this.debug = this.getQueryParam('debug') === '1';
        }
        return this.debug;
    }

    isAdmin() {
        return this.adminUsers.includes(this.uuid);
    }

    isUserOwner(uuid) {
        return this.data.owner === uuid;
    }

    isUserAdmin(uuid) {
        return this.adminUsers.includes(uuid);
    }

    isOwnerOrAdmin() {
        return this.isOwner || this.isAdmin();
    }

    toJson() {
        return {
            vote: this.vote,
            topic: this.topic,
            data: this.data,
            userName: this.userName,
            discuss: this.discuss,
            othersNonVoted: this.othersNonVoted,
            timer: this.timer,
            result: this.result,
            room: this.room,
            uuid: this.uuid,
            rooms: this.rooms,
            sound: this.sound,
            proposeMax: this.proposeMax,
            adminUsers: this.adminUsers
        };
    }

    getLocalData() {
        const data = window.localStorage.getItem(this.appKey);
        if (!data) {
            const uuid = uuidV4();
            return { uuid: uuid, name : ''};
        }
        return JSON.parse(data);
    }

    setLocalData(data) {
        window.localStorage.setItem(this.appKey, JSON.stringify(data));
    }
}

export default App;