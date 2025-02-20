module.exports = function(io) {

    io.on('connection', function(socket) {
                    
        socket.on('set_nickname', function(nickname, callback) {
            var isAvailable = isNicknameAvailable(nickname);

            if (isAvailable) {
                socket.nickname = nickname;
            }

            callback(isAvailable);
            
            io.emit('user_connected', socket.id, socket.nickname);
            
            io.emit('user_new');

            for (let [socketID, connectedSocket] of io.of("/").sockets) {
                io.emit('user_connected', socketID, connectedSocket.nickname);
            }

            sendMessage("SERVER", "User <b>" + nickname + "</b> connected.");
        });

        socket.on('message', function(message) {
            sendMessage(socket.nickname, message);
        });

        socket.on('disconnect', function() {
            io.emit('user_disconnected', socket.id);
            sendMessage("SERVER", "User <b>" + socket.nickname + "</b> disconnected.");
        });

    });

    var sendMessage = function(nickname, message) {
        io.emit('message', nickname, message);
    };

    var isNicknameAvailable = function(nickname) {
        for (let [_, client] of io.of("/").sockets) {
            if (client.nickname === nickname) {
                return false;
            }
        }
        return true;
    };

}
