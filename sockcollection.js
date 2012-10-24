/*
 * Collection of client sockets
 */

function ClientSocketCollection(){
    this._clientSockets = [];
        
}
// Agregamos algunos metodos
ClientSocketCollection.prototype = {
    /* Adds a socket to the collection */
    addClientSocket: function(socket){
        this._clientSockets.push(socket);
    },
    removeClientSocket: function(socket){
        var index = this._clientSockets.indexOf(socket);
        if ( index > -1){
            this._clientSockets.splice(index, 1);
        }
    },
    broadcast: function(message, messageName){
        if (!messageName){
            messageName = 'news'
        }
        this._clientSockets.forEach(function(sock){
    		try {
    			console.log("Emitiendo");
    			sock.emit(messageName, message);
    		} catch(e){
    			console.error("No se pudo mandar ", msg, "por", sock);
    		}
	   });
        
    }
}

// exports
exports.ClientSocketCollection = ClientSocketCollection;