var sanitizeHtml = require('sanitize-html');

module.exports = function(http){
	var io = require('socket.io')(http);
	
	var clients = {};
	var disconnecting = [];
	
	io.on('connection', function(socket){
		if (socket.handshake.session && socket.handshake.session.player){
			// Connection by logged in user
			var username = socket.handshake.session.player.name;
			if (username){
				
				if (!clients[username]){
					msg = {username: username};
					// Alert others of user connection
					var index = disconnecting.indexOf(username);
					if (index > -1){
						// Page change
						disconnecting.splice(index, 1);
					} else {
						// New user
						io.emit('user connected', msg);
					}
				}
				clients[username] = socket;
			
				socket.on('disconnect', function(){
					clients[username] = null;
					disconnecting.push(username);
					msg = {username: username};
					// Alert others of user disconnection
					setTimeout(function(){
						// Check the disconnection wasn't just a page change
						var index = disconnecting.indexOf(username);
						if (index > -1){
							disconnecting.splice(index, 1);
							// Alert other of user disconnection
							io.emit('user disconnected', msg);
						}
					}, 5000);
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