var app = require('/usr/local/lib/node_modules/express').createServer(), io = require('/usr/local/lib/node_modules/socket.io').listen(app), spawn = require('child_process').spawn;

var statsArray = new Array();
var usersArray = new Array();

function trim(stringToTrim) {
    return stringToTrim.replace(/^\s+|\s+$/g, "");
}

app.listen(2222);

io.sockets.on('connection', function(socket) {
    socket.on('X', function(data) {
        console.log(data);
    });
});
var com = spawn('vmstat', ['-n', '-SM', '3']);
com.stdout.on('data', function(data) {

    var wOut = spawn('../users.sh');

    wOut.stdout.on('data', function(data) {
        var wTxt = trim(new Buffer(data).toString('utf8', 0, data.length));
        usersArray.length = 0
        usersArray[0] = 1;
        usersArray = usersArray.concat(wTxt.split(/\n/g));

    });
    var txt = new Buffer(data).toString('utf8', 0, data.length);
    //console.log(txt.split(/\s+/g));
    statsArray[0] = 0;
    statsArray[1] = 100 - parseInt(txt.split(/\s+/g)[15]);
    statsArray[2] = parseInt(txt.split(/\s+/g)[4]);
    statsArray[3] = parseInt(txt.split(/\s+/g)[5]);
    statsArray[4] = parseInt(txt.split(/\s+/g)[6]);

    io.sockets.send(JSON.stringify(statsArray));
    io.sockets.send(JSON.stringify(usersArray));

});
