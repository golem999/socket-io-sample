/**
 * Created by zvs on 3/24/15.
 */


var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendFile('index.html', { root: __dirname });
});

io.on('connection', function(socket){
    //console.log("connected");
    var timer;
    socket.broadcast.emit("chat message", "new user connected");// for everyone except for a certain sender
    socket.on('chat message', function(msg){
        io.emit('chat message', msg);
        timer = setInterval(function(){
            io.emit("update", Date.now().toLocaleString());
        }, 200);
    });
    socket.on("disconnect", function(){
        socket.broadcast.emit("chat message", "user leave chat");
        clearInterval(timer);
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});