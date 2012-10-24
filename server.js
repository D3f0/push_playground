var http = require('http')
  , socketio = require('socket.io')
  , fs = require('fs')
  , path = require('path')
  , zmq = require('zmq')
  
  

function handler (request, response) {
	var filePath = '.' + request.url;
	if (filePath == './')
		filePath = './index.html';
	
  console.log("El path es", filePath);

	fs.exists(filePath, function(exists) {
    console.log(filePath, "existe:", exists);
	  if (exists) {
			fs.readFile(filePath, function(error, content) {
				if (error) {
					console.error("No se puede entregar",filePath, 
					error, content);
					response.writeHead(500);
					response.end();
				} else {
					// Retornamos el archivo estático
					console.log("Entregando contenido para", filePath);
					response.writeHead(200, { 'Content-Type': 'text/html' });
					response.end(content, 'utf-8');
				}
	  	});
	  } else {
			response.writeHead(404);
			response.end();
	  }
	
	});
}

app = http.createServer(handler);
app.listen(8080);
io = socketio.listen(app);

var clientSockets = [];
function addClientSocket(socket){
	
}
function broadcastToClientSockets(msg){
	clientSockets.forEach(function(sock){
		try {
			sock.emit('news', msg);
		} catch(e){
			console.error("No se pudo mandar ", msg, "por", sock);
		}
	})
}

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
  clientSockets.push(socket);
});


dataSource = zmq.socket('pull');
dataSource.connect('tcp://127.0.0.1:2345')


dataSource.on('message', function (msg){
	var msg = ''+msg;
	console.log("Mensaje fue:", msg);
	broadcastToClientSockets(msg)
	
	
})