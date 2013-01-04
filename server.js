var express = require('express'),
	app = express(),
	http = require('http'),
	server = http.createServer(app),
	io = require('socket.io').listen(server);

// 公開フォルダ
app.use('/', express.static(__dirname + '/public'));

// サーバースタート
server.listen(80);

// socket.ioの設定
io.sockets.on('connection', function(socket) {
	socket.on('login', function(name) {
		// 接続しているユーザー全員にloginを送信
		var time = new Date().toJSON();
		io.sockets.emit('login', time, name);

		// name を記憶
		socket.set('name', name);
	});
	socket.on('post', function(name, text) {
		// 接続しているユーザー全員にpostを送信
		var time = new Date().toJSON();
		io.sockets.emit('post', time, name, text);
	});
	socket.on('disconnect', function() {
		// 接続しているユーザー全員にlogoutを送信
		socket.get('name', function(err, name) {
			var time = new Date().toJSON();
			io.sockets.emit('logout', time, name);
		});
	});
});