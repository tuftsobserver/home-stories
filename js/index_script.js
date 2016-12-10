disable_scroll();
adjustSizeCSS();
hideButtons();

$(window).scroll(hideButtons);
$(window).resize(adjustSizeCSS);

$('header').click(function() {
    headerClick();
});

$('.scroll-article').click(function() {
    scrollTo('article');
});

$('.scroll-map').click(function() {
    scrollTo('.map-container');
});

var canvas, stage;
var mouseTarget; // the display object currently under the mouse, or being dragged
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
    createjs.Touch.enable(stage, false, true);
    stage.preventSelection = false;

    // enabled mouse over / out events
    stage.enableMouseOver(10);

    // load the map:
    var map = new Image();
    map.src = "img/map.png";
    map.onload = handleMapLoad;
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

// modified from http://www.skipser.com/test/googlecode/gplus-youtubeembed/test.html
function loadSoundcloud(id, src) {
    var code = '<iframe width="100%" height="450" scrolling="no" frameborder="no" src= "' + src + '"></iframe>'
    var iframe = document.createElement('div');
    var div=document.getElementById(id + "-soundcloud");

    iframe.innerHTML=code;
    iframe=iframe.firstChild;
    div.parentNode.replaceChild( iframe, div)
}

/*********************** no-scroll functions *********************************/


// credit for the following from http://jsfiddle.net/prSqz/17/
// prevents scrolling
// left: 37, up: 38, right: 39, down: 40,
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
var keys = [37, 38, 39, 40];

function preventDefault(e) {
  e = e || window.event;
  if (e.preventDefault)
      e.preventDefault();
  e.returnValue = false;
}

function keydown(e) {
    for (var i = keys.length; i--;) {
        if (e.keyCode === keys[i]) {
            preventDefault(e);
            return;
        }
    }
}

function wheel(e) {
  preventDefault(e);
}

function disable_scroll() {
  if (window.addEventListener) {
      window.addEventListener('DOMMouseScroll', wheel, false);
  }
  window.onmousewheel = document.onmousewheel = wheel;
  document.onkeydown = keydown;
}

function enable_scroll() {
    if (window.removeEventListener) {
        window.removeEventListener('DOMMouseScroll', wheel, false);
    }
    window.onmousewheel = document.onmousewheel = document.onkeydown = null;
}

/******************* end no-scroll functions *********************************/

var headerClick = headerReplaceText;

function headerReplaceText() {
    $('header > .vertically-center').html("<h1>Click dots on map to hear<br>stories from these homes</h1><br><h2><i class='fa fa-hand-o-up' aria-hidden='true'></i> Click Anywhere</h2>");
    headerClick = headerFade;
}

function headerFade() {
    $('header').fadeOut('fast', enable_scroll());
}

function hideButtons() {
    if (document.body.scrollTop >= $('article').position().top) {
        $('.scroll-article').hide();
        $('.scroll-map').css('bottom', 0);
    } else {
        $('.scroll-article').show();
        $('.scroll-map').css('bottom', '2rem');
    }

    if (document.body.scrollTop > $('.audio-container').position().top) {
        $('.scroll-map').show();
    } else {
        $('.scroll-map').hide();
    }
}

function scrollTo(location) {
    $('html, body').animate({
        scrollTop: $(location).offset().top
    }, 1000);
}

function adjustSizeCSS() {
    var w = $('.soundcloud').width();
    $('.soundcloud').height(w);
    $('.play-button').css('top', 0-w);
}
