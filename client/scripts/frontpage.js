function setup() {
    var vid_constraints = {
        mandatory: {
            maxHeight: 720,
            minHeight: 720
        }
    };

    navigator.myGetMedia = (navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);
    navigator.myGetMedia({
        video: vid_constraints
    }, connect, error);
}

function connect(stream) {
    video = document.getElementById("video");
    video.src = window.URL ? window.URL.createObjectURL(stream) : stream;
    video.play();
}

function error(e) {
    console.log(e);
}

function captureImage() {
    $(".takePicture").hide("slow");
    $(".progress").show("slow");
    var canvas = document.getElementById('previewCanvas');
    //add canvas to #canvasHolder
    //document.getElementById('canvasHolder').appendChild(canvas);
    var ctx = canvas.getContext('2d');
    //canvas.width = video.videoWidth / 2;
    //canvas.height = video.videoHeight / 2;
    canvas.width = 1280;
    canvas.height = 720;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
    //save canvas image as data url
    dataURL = canvas.toDataURL("image/jpeg");
    var dataURLRegExp = /^data:image\/\w+;base64,/;
    var blob = dataURL.replace(dataURLRegExp, "");

    //document.write('<img src="'+outputImage+'"/>');
    //set preview image src to dataURL
    //document.getElementById('preview').src = dataURL;
    // place the image value in the text box
    //document.getElementById('progressimageToForm').value = dataURL;
    Meteor.call('saveFile', blob, function(err, data) {
        console.log(data);
        var maxValue = 0;
        var maxEmotion = "unknown";
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                var obj = data[key];
                if (obj > maxValue) {
                    maxValue = obj;
                    maxEmotion = key;
                }
            }
        }


        /*SC.initialize({
            client_id: 'c6448c35039321086973e26ec3008005'
        });

        var track_url = 'http://soundcloud.com/forss/flickermood';
        SC.oEmbed(track_url, {
            auto_play: true,
            sharing: false,
            liking: false,
            download: false,
            buying: false,
            show_user: false,
            show_artwork: false
        }, function(oEmbed) {
        	$(".musicplayer").html(oEmbed.html);
            console.log(oEmbed);
        });*/
        var neutralSongs = ['110078725', '116961087', '48597328', '136909816', '25344813'];
        var angerSongs = ['5064840', '159670620', '7723321', '85180525', '204557875'];
        var contemptSongs = ['5064840', '159670620', '7723321', '85180525', '20455785'];
        var disgustSongs = ['29966796', '44975506', '175263031', '140432643', '17605212'];
        var fearSongs = ['37308307', '47744182', '10730689', '67238775', '58279481'];
        var happySongs = ['16234610', '181404648', '158475500', '179612942', '89229498'];
        var sadnessSongs = ['142370360', '106298480', '3007277', '164322443', '166966133'];
        var surpriseSongs = ['120083679', '125259228', '123015980', '109545056', '148596707'];
        var currentURL;
        if (maxEmotion == "neutral") {
            currentURL = neutralSongs[Math.floor(Math.random() * neutralSongs.length)];
        } else if (maxEmotion == "anger") {
            currentURL = angerSongs[Math.floor(Math.random() * angerSongs.length)];
        } else if (maxEmotion == "contempt") {
            currentURL = contemptSongs[Math.floor(Math.random() * contemptSongs.length)];
        } else if (maxEmotion == "disgust") {
            currentURL = disgustSongs[Math.floor(Math.random() * disgustSongs.length)];
        } else if (maxEmotion == "fear") {
            currentURL = fearSongs[Math.floor(Math.random() * fearSongs.length)];
        } else if (maxEmotion == "happy") {
            currentURL = happySongs[Math.floor(Math.random() * happySongs.length)];
        } else if (maxEmotion == "sadness") {
            currentURL = sadnessSongs[Math.floor(Math.random() * sadnessSongs.length)];
        } else if (maxEmotion == "surprise") {
            currentURL = surpriseSongs[Math.floor(Math.random() * surpriseSongs.length)];
        }


        var widgetIframe = document.getElementById('sc-widget'),
            widget = SC.Widget(widgetIframe),
            newSoundUrl = 'http://api.soundcloud.com/tracks/' + currentURL;
        $(".leftLogo").hide("fast");
        $(".rightLogo").hide("fast");
        $("#video").hide("slow", function() {
            $(widgetIframe).show("slow");
            $('#previewCanvas').show("slow");
            $(".retakePicture").show("slow");
            $(".progress").hide("slow");
            $("#radarChart").show("slow", function() {
                renderRadarChart(data);

            });
        });

        widget.load(newSoundUrl, {
            show_artwork: true,
            auto_play: true
        });
        widget.bind(SC.Widget.Events.READY, function() {
            widget.bind(SC.Widget.Events.PLAY, function() {
                widget.getDuration(function(result) {
                    console.log(result);
                    widget.seekTo(result / 2);
                });
            });
        });

        console.log("Your emotion is " + maxEmotion + " with value equals to " + maxValue);
    });


}

function renderRadarChart(data) {

    var labels = [];
    var emotionValues = [];
    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            var obj = data[key];
            labels.push(key);
            emotionValues.push(obj);
        }
    }
    var data = {
        labels: labels,
        datasets: [{
            label: "My First dataset",
            fillColor: "rgba(0,0,225,0.5)",
            strokeColor: "rgba(0,0,255,.7)",
            pointColor: "rgba(0,0,255,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: emotionValues
        }]
    };

    var options = {
        animation: true,

        // Number - Number of animation steps
        animationSteps: 60,

        // String - Animation easing effect
        animationEasing: "easeOutBounce",
        //Boolean - Whether to show lines for each scale point
        scaleShowLine: true,

        //Boolean - Whether we show the angle lines out of the radar
        angleShowLineOut: true,

        //Boolean - Whether to show labels on the scale
        scaleShowLabels: false,

        // Boolean - Whether the scale should begin at zero
        scaleBeginAtZero: true,

        //String - Colour of the angle line
        angleLineColor: "rgba(0,0,0,.1)",

        //Number - Pixel width of the angle line
        angleLineWidth: 1,

        //String - Point label font declaration
        pointLabelFontFamily: "'Arial'",

        //String - Point label font weight
        pointLabelFontStyle: "normal",

        //Number - Point label font size in pixels
        pointLabelFontSize: 20,

        //String - Point label font colour
        pointLabelFontColor: "rgba(0,0,0,1)",

        //Boolean - Whether to show a dot for each point
        pointDot: true,

        //Number - Radius of each point dot in pixels
        pointDotRadius: 3,

        //Number - Pixel width of point dot stroke
        pointDotStrokeWidth: 1,

        //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
        pointHitDetectionRadius: 20,

        //Boolean - Whether to show a stroke for datasets
        datasetStroke: true,

        //Number - Pixel width of dataset stroke
        datasetStrokeWidth: 2,

        //Boolean - Whether to fill the dataset with a colour
        datasetFill: true,

        //String - A legend template
        legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"
    }
    var ctx = $("#radarChart").get(0).getContext("2d");
    var myRadarChart = new Chart(ctx);
    new Chart(ctx).Radar(data, options);
}

function retakePicture() {
    $(".retakePicture").hide("slow");
    $(".progress").hide("slow");
    var widgetIframe = document.getElementById('sc-widget');

    $("#previewCanvas").hide("slow", function() {
        $(widgetIframe).hide("slow");
        $(".leftLogo").show("fast");
        $(".rightLogo").show("fast");
        $('#video').show("slow");
        $(".takePicture").show("slow");
        $("#radarChart").hide("slow");
    });

}

addEventListener("load", setup);

Template.frontpage.rendered = function() {

};

Template.frontpage.events({
    "click .takePicture": function(event, template) {
        captureImage();
    },
    "click .retakePicture": function(event, template) {
        retakePicture();
    }
})