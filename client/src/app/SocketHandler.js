import io from 'socket.io-client/dist/socket.io';
// noinspection JSUnresolvedVariable
class SocketHandler {

    create(app, context) {
        const socket = io('/' + app.appKey, {
            transports: ['websocket'],
            upgrade: false
        });
        window.addEventListener('unload', () => {
            if (socket) socket.close();
        });
        socket.on('connect', () => {
            context.state.dialogs.start.close();
            // Generate local identifier if any.
            const localStore = app.getLocalData();
            app.setLocalData(localStore);
            if (app.isGlobalRoom()) {
                // socket.emit('touch', { users: '$count' });
            } else {
                // Try to join without pass.
                socket.emit('join', app.room, localStore.uuid);
            }
        });
        socket.on('create_room', (room, success) => {
            // Create room success, redirect there.
            if (success) {
                window.location.href = `/room/${room}`;
            }
            else {
                app.roomNameCreateValid = false;
            }
        });
        socket.on('join_room', (room, success) => {
            // Create room success, redirect there.
            if (success) {
                window.location.href = `/room/${room}`;
            }
            else {
                app.roomNameJoinValid = false;
            }
        });
        socket.on('join_fail', (reason) => {
            // Create room success, redirect there.
            if (reason === 'room') {
                if (!context.state.dialogs.not_exist.hasAttribute('open')) {
                    context.state.dialogs.not_exist.showModal();
                }
                app.hasAccess = false;
            }
            else if (reason === 'pass') {
                if (!context.state.dialogs.pass_dialog.hasAttribute('open')) {
                    context.state.dialogs.pass_dialog.showModal();
                    if (app.passAttempt === 'try') {
                        app.passAttempt = 'fail';
                    }
                }
                app.hasAccess = false;
            }
        });
        socket.on('error', () => {
            if (!context.state.dialogs.error.hasAttribute('open')) {
                context.state.dialogs.error.showModal();
            }
        });
        socket.on('disconnect', () => {
            if (!context.state.dialogs.error.hasAttribute('open')) {
                context.state.dialogs.error.showModal();
            }
        });
        socket.on('status', data => {
            app.mapData(data, context);
        });
        socket.on('touch', data => {
            app.doTouch(data, context);
        });
        socket.on('trigger', (name, data) => {
            app.trigger(name, data, context);
        });
        socket.on('kick', () => {
            socket.close();
            window.location.href = '/';
        });
        const liveness = () => {
            setTimeout(function() {
                socket.emit('liveness');
                liveness();
            }, 30000);
        };
        liveness();

        return socket;
    }
}

export default SocketHandler;
