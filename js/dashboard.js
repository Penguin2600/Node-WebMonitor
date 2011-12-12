$(document).ready(function() {

    var ccanvas = document.getElementById('cpucanvas'), cpuCanvas = ccanvas.getContext("2d");
    var mcanvas = document.getElementById('memcanvas')
    memCanvas = mcanvas.getContext("2d");

    var socket = new io.connect('ihacku.org', {
        port : 2222
    });

    socket.on('message', function(data) {
        var JSONData = JSON.parse(data);
        if(parseInt(JSONData[0]) == 0) {
            animateSliders(JSONData);
        }

        if(parseInt(JSONData[0]) == 1) {
            updateUsers(JSONData);
        }

    });
    var lastCpu = 0;

    cpuCanvas.textAlign = "center";
    memCanvas.textAlign = "center";
    function animateSliders(data) {
        var totalMem = 512;
        var cpu = parseInt(data[1]);
        var free = Math.round(mcanvas.height * (data[2]) / totalMem);
        var buff = Math.round(mcanvas.height * (data[3]) / totalMem);
        var cache = Math.round(mcanvas.height * (data[4]) / totalMem);
        var inuse = Math.round(totalMem - data[4] - data[3] - data[2]);

        var step = 1, interval = setInterval(function() {

            cpuCanvas.clearRect(0, 0, ccanvas.width, ccanvas.height);
            memCanvas.clearRect(0, 0, mcanvas.width, mcanvas.height);

            cpuCanvas.fillStyle = "rgba(220,50,47,1)";
            cpuCanvas.fillRect(0, ccanvas.height, ccanvas.width, -Math.round(lastCpu + (cpu - lastCpu) / 9 * step) * 3);

            memCanvas.fillStyle = "rgba(38,139,210,1)";
            memCanvas.fillRect(0, 0, mcanvas.width, free);
            memCanvas.fillStyle = "rgba(108,113,196,1)";
            memCanvas.fillRect(0, 0 + free, mcanvas.width, cache);
            memCanvas.fillStyle = "rgba(42,161,152,1)";
            memCanvas.fillRect(0, 0 + free + cache, mcanvas.width, buff);
            memCanvas.fillStyle = "rgba(133,153,0,1)";
            memCanvas.fillRect(0, 0 + free + cache + buff, mcanvas.width, mcanvas.height - free + cache + buff);

            memCanvas.font = "9px sans-serif";
            cpuCanvas.font = "9px sans-serif";
            cpuCanvas.fillStyle = "black";
            cpuCanvas.fillText(cpu + "%", ccanvas.width / 2, ccanvas.height / 2);

            memCanvas.fillStyle = "black";
            memCanvas.fillText(data[2] + "MB Free", mcanvas.width / 2, 4 + free / 2);
            memCanvas.fillText(data[4] + "MB Cached", mcanvas.width / 2, 4 + free + cache / 2);
            memCanvas.fillText(data[3] + "MB Buffered", mcanvas.width / 2, 4 + free + cache + buff / 2);
            memCanvas.fillText(inuse + "MB In Use", mcanvas.width / 2, 4 + free + cache + buff + (mcanvas.height - (free + cache + buff)) / 2);

            if(step === 10) {
                clearInterval(interval);
                lastCpu = cpu;
            }
            step++;
        }, 100);
    }

    function updateUsers(data) {
        for( i = 0; i < data.length - 1; i++) {
            name = data[i+1].split(/\s+/g)[0];
            $("#" + name).find("p").remove();
        }
        for( i = 0; i < data.length - 1; i++) {
            name = data[i+1].split(/\s+/g)[0];
            if($("#" + name).length != 0) {
                $("#" + name).append("<p>" + data[i+1].split(/\s+/g)[1] + " : " + data[i+1].split(/\s+/g)[2] + "</p>");
            } else {
                $("#userlist").append("<div id='" + data[i+1].split(/\s+/g)[0] + "'class='user'><h1>" + data[i+1].split(/\s+/g)[0] + "</h1><p>" + data[i+1].split(/\s+/g)[1] + " : " + data[i+1].split(/\s+/g)[2] + "</p></div>");
            }
        }
    }


    $('.user').live("click", function() {
        socket.emit('UserEvent', $(this).find('h1').html());
    });
});
