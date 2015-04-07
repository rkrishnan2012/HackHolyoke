Meteor.methods({
    saveFile: function(blob){
        var buf = new Buffer(blob, 'base64');
        var fs = Npm.require('fs');
        var wstream = fs.createWriteStream('/tmp/face.jpg');
        wstream.write(buf);
        wstream.end();
        console.log("File was saved");
        return checkEmotion();
    }
});


Meteor.startup(function() {
    Future = Npm.require('fibers/future');
    //checkEmotion();
});

function checkEmotion() {
    var fut = new Future();

    console.log("Starting analysis.");

    var require = Npm.require;
    var spawn = require('child_process').spawn;
    var emotime = spawn("/emotime/assets/runEmotime.sh", []);

    emotime.on('close', function(code) {
        fut.return();
    });
    fut.wait();
    var fs = Npm.require('fs');
    var data = fs.readFileSync('/emotime/output.json', 'utf8');
    var emotionjson = JSON.parse(data);
    console.log("Finished the analysis!");
    console.log(emotionjson);
    return emotionjson;
}