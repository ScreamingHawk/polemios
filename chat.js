var sanitizeHtml = require('sanitize-html');

module.exports = function(http){
	var io = require('socket.io')(http);
	
	var clients = {};
	
	io.on('connection', function(socket){
		if (socket.handshake.session && socket.handshake.session.user){
			// Connection by logged in user
			var username = socket.handshake.session.user.username;
			if (username){
				
				if (!clients[username]){
					clients[username] = socket;
					msg = {username: username};
					// Alert others of user connection
					io.emit('user connected', msg);
				}
			
				socket.on('disconnect', function(){
					clients[username] = null;
					msg = {username: username};
					// Alert others of user disconnection
					io.emit('user disconnected', msg);
				});
				
				socket.on('chat', function(msg){
					msg.message = sanitizeHtml(msg.message);
					msg.username = username;
					// Send chat message to others
					io.emit('chat', msg);
				});
			}
		}
	});
	
	return io;
}