$('header').click(function() {
    $(this).fadeOut();
});

var canvas, stage;
var mouseTarget;	// the display object currently under the mouse, or being dragged
var dragStarted;	// indicates whether we are currently in a drag operation
var offset;
var update = true;

var coords = [
    ["kavya",     500, 500],  // andhra
    ["tiara",     650, 380],  // calcutta
    ["natasha-ka",540, 650],  // colombo
    ["maimuna",   690, 360],  // dhaka
    ["ravi",      390, 380],  // gujarat
    ["danish",    330, 360],  // karachi
    ["natasha-kw",450, 230],  // lahore
    ["arushi",    440, 320],  // rajasthan
    ["iris",      510, 610],  // tamil nadu
];

window.onload = function() {
    canvas = document.getElementById("mapCanvas");
    stage = new createjs.Stage(canvas);

    // enable touch interactions if supported on the current device:
    createjs.Touch.enable(stage);

    // enabled mouse over / out events
    stage.enableMouseOver(10);
    stage.mouseMoveOutside = true; // keep tracking the mouse even when it leaves the canvas

    // load the map:
    var map = new Image();
    map.src = "img/map.png";
    map.onload = handleMapLoad;

    // load the audio into their iframes
    // loading is deffered until here for faster page load
    // thx to https://varvy.com/pagespeed/defer-videos.html
    var vidDefer = document.getElementsByTagName('iframe');
    for (var i = 0; i < vidDefer.length; i++) {
        if (vidDefer[i].getAttribute('data-src')) {
            vidDefer[i].setAttribute('src',vidDefer[i].getAttribute('data-src'));
        }
    }
};

function stop() {
    createjs.Ticker.removeEventListener("tick", tick);
}

function handleMapLoad(event) {
    var map = event.target;
    var bitmap;
    var container = new createjs.Container();
    stage.addChild(container);

    bitmap = new createjs.Bitmap(map);
    container.addChild(bitmap);

    var circle = new Image();
    circle.src = "img/circle.png";
    circle.onload = handleImageLoad;
}

function handleImageLoad(event) {
    var image = event.target;
    var bitmap;
    var container = new createjs.Container();
    stage.addChild(container);

    var circle = new createjs.Graphics();
    circle.setStrokeStyle(3);
    circle.beginStroke(createjs.Graphics.getRGB(119,119,119));
    circle.beginFill(createjs.Graphics.getRGB(255,255,255,0.5));
    circle.drawCircle(0,0,30);

    // throw clickable circles onto the map
    for (var i = 0; i <= 8; i++) {
        var button = new createjs.Shape(circle);
        button.x = coords[i][1];
        button.y = coords[i][2];
        button.scaleX = button.scaleY = button.scale = 1;

        button.name = coords[i][0];
        button.cursor = "pointer";

        container.addChild(button);

        // using "on" binds the listener to the scope of the currentTarget by default
        // in this case that means it executes in the scope of the button.
        button.on("mousedown", function (evt) {
            this.parent.addChild(this);
            this.offset = {x: this.x - evt.stageX, y: this.y - evt.stageY};
        });

        // the pressmove event is dispatched when the mouse moves after a mousedown on the target until the mouse is released.
        button.on("pressmove", function (evt) {
            this.x = evt.stageX + this.offset.x;
            this.y = evt.stageY + this.offset.y;
            // indicate that the stage should be updated on the next tick:
            update = true;
        });

        // make circle bigger when you hover over it
        button.on("rollover", function (evt) {
            this.scaleX = this.scaleY = this.scale * 1.2;
            update = true;
        });

        // return to previous size when unnhover
        button.on("rollout", function (evt) {
            this.scaleX = this.scaleY = this.scale;
            update = true;
        });

        // scroll to the given person's section when click a circle
        button.on("click", function (evt) {
            $('html, body').animate({
                scrollTop: $('#' + this.name).offset().top
            }, 1000);
        });

        createjs.Ticker.addEventListener("tick", tick);
    }
}

function tick(event) {
    // this set makes it so the stage only re-renders when an event handler indicates a change has happened.
    if (update) {
        update = false; // only update once
        stage.update(event);
    }
}
