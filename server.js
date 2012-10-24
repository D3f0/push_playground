/* Imports
 * 
 */
var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')
  , path = require('path')
  , zmq = require('zmq')
  , scol = require('./sockcollection.js')
  
  
  
app.listen(8999);

function handler(request, response) {
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

/*
 * Socket collection
 */
var col = new scol.ClientSocketCollection();


io.sockets.on('connection', function (socket) {
	socket.emit('news', {
		value_update: 50
	});
  col.addClientSocket(socket);
});

// Conexion con el socket contra el origen de eventos
dataSource = zmq.socket('pull');
dataSource.connect('tcp://127.0.0.1:2345')

dataSource.on('message', function (msg){
	console.log("Mensaje fue:", ''+msg);
	col.broadcast(msg);
});