var socket = io();

$('#chatbox_form').submit(function(){
	var msg = {};
	msg.message = $('#chatbox_input').val();
	socket.emit('chat', msg);
	$('#chatbox_input').val('');
	return false;
});

var chatbox_messages = $('#chatbox_messages');

socket.on('chat', function(msg){
	chatbox_messages.append('<li><span class="text"><span class="user">' + msg.username + '</span>: ' + msg.message + '</span></li>');
	chatbox_messages.scrollTop(chatbox_messages[0].scrollHeight);
});

socket.on('user connected', function(msg){
	chatbox_messages.append('<li><span class="text connect"><span class="user">' + msg.username + '</span> connected</span></li>');
	chatbox_messages.scrollTop(chatbox_messages[0].scrollHeight);
});

socket.on('user disconnected', function(msg){
	chatbox_messages.append('<li><span class="text disconnect"><span class="user">' + msg.username + '</span> disconnected</span></li>');
	chatbox_messages.scrollTop(chatbox_messages[0].scrollHeight);
});