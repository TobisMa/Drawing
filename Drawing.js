const CANVAS = document.getElementById('drawing-canvas');
const CTX = CANVAS.getContext('2d');

const TOOLBAR = document.getElementById('toolbar');
const EXPAND_BUTTON = document.getElementById('expand-button');
const CLEAR_BUTTON = document.getElementById('clear');
const RESET_BUTTON = document.getElementById('reset');
const COLOR_SELECTOR = document.getElementById('stroke');
const LINE_WIDTH_INPUT = document.getElementById('lineWidth');
const DRAW_TYPE = document.getElementById('drawType')

const DRAW_CIRCLE = document.getElementById("drawCircle");


const CANVAS_OFFSET_X = CANVAS.offsetLeft;
const CANVAS_OFFSET_Y = CANVAS.offsetTop;

const PAINT_MODE_RUBBER = "rubber";
const PAINT_MODE_PENCIL = "pencil";

const SUPPORTS_TOUCH = ("ountouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0);

CANVAS.width = window.innerWidth - CANVAS_OFFSET_X;
CANVAS.height = window.innerHeight - CANVAS_OFFSET_Y;

let paintMode = DRAW_TYPE.value;
let isPainting = false;
let lineWidth = 1;
let startX;
let startY;

let drawOffsetY = 0;

let lastPencilColor = COLOR_SELECTOR.value;
let lastStrokeWidth = lineWidth;

let mouseState = undefined;
let lockScrolling = false;

function initalizePage() {
    setLineWidth(LINE_WIDTH_INPUT.value);
    setColor(COLOR_SELECTOR.value);
    clearCanvas();
    DRAW_TYPE.value = PAINT_MODE_PENCIL;
}

function setColor(color) {
    // update color and element
    lastPencilColor = CTX.strokeStyle;
    CTX.strokeStyle = color;
    COLOR_SELECTOR.value = color;

    console.log("Set color to " + color);
}

function setLineWidth(newLineWidth) {
    // update lineWidth and element
    if (lineWidth <= 0) {
        lineWidth = newLineWidth < 0 ? Math.abs(newLineWidth) : 1;
        LINE_WIDTH_INPUT.value = lineWidth;
        console.log("Set line width to " + newLineWidth);
        return;
    }
    lastStrokeWidth = lineWidth;
    lineWidth = newLineWidth;
    LINE_WIDTH_INPUT.value = lineWidth;

    console.log("Set line width to " + newLineWidth);
}

function resetDrawPath() {
    pathPoints = [];
}

// clearing canvas
function clearCanvas(resetSize=true) {
    let prevColor = CTX.strokeStyle;

    // reseting canvas size
    if (resetSize) {
        drawOffsetY = 0;
        CANVAS.style.height = "100%";
        CANVAS.width = window.innerWidth - CANVAS_OFFSET_X;
        CANVAS.height = window.innerHeight - CANVAS_OFFSET_Y;
    }
    // drawing and so on;
    CTX.clearRect(0, 0, CANVAS.width, CANVAS.height + drawOffsetY);
    CTX.fillStyle = "#ffffff";
    CTX.fillRect(0, 0, CANVAS.width, CANVAS.height + drawOffsetY);
    setColor(prevColor);

}

function expandCanvas() {
    let prevColor = CTX.strokeStyle;
    let imgData = CTX.getImageData(0, 0, CANVAS.width, CANVAS.height);
    CANVAS.height *= 2;
    if (!CANVAS.style.height) {
        CANVAS.style.height = "200%";
    }
    else {
        let h = CANVAS.style.height
        nh = h.substring(0, h.length - 1);
        CANVAS.style.height = 2 * nh + "%";
    }
    clearCanvas(false);
    CTX.putImageData(imgData, 0, 0);
    setColor(prevColor);
}


// circle methods
showDrawCircle = () => DRAW_CIRCLE.style.display = "block";
hideDrawCirlce = () => DRAW_CIRCLE.style.display = "none";
function setDrawCircle(x, y) {
    // TODO aligning circle to mouse
    // console.log("Drawing circle");
    // r = (lineWidth + 1) / 2;
    // drawCircle.style.left = x + r;
    // drawCircle.style.top = y + r;
    // drawCircle.style.width = r / 2;
    // drawCircle.style.height = r / 2; 
}

// toolbar events
CLEAR_BUTTON.addEventListener('click', _ => clearCanvas());
CLEAR_BUTTON.addEventListener('touchend', _ => clearCanvas());

RESET_BUTTON.addEventListener('click', _ => resetDrawPath());

COLOR_SELECTOR.addEventListener('change', (e) => setColor(e?.target?.value));

EXPAND_BUTTON.addEventListener("click", _ => expandCanvas());
EXPAND_BUTTON.addEventListener("touchend", _ => expandCanvas());

LINE_WIDTH_INPUT.addEventListener('change', (e) => setLineWidth(e?.target?.value));
LINE_WIDTH_INPUT.addEventListener('keyup', (e) => {
    if (e.code.codePointAt() === 69) {  // 69 refers to enter; 
        setLineWidth(e?.target?.value)
    };
});


DRAW_TYPE.addEventListener('change', (e) => {
    // mode with which to draw
    pathPoints = [];
    switch (e?.target?.value) {
        case PAINT_MODE_RUBBER:
            setColor("#ffffff");  // set color to white
            setLineWidth(8 + Number.parseInt(lineWidth));
            console.log("e");
            break;
            
        case PAINT_MODE_PENCIL:
            setColor(lastPencilColor);  // set color to previous pencil color
            setLineWidth(lastStrokeWidth);
            break;
    }
    if (e?.target?.value !== undefined) {
        paintMode = e.target.value;
    }
});

// drawing
const draw = (e) => {
    if(!isPainting || (paintMode !== PAINT_MODE_PENCIL && paintMode !== PAINT_MODE_RUBBER)) {
        return;
    }
    CTX.lineWidth = lineWidth;
    CTX.lineCap = 'round';

    if (e?.changedTouches?.length > 0) {
        clientX = e.changedTouches[0].clientX;
        clientY = e.changedTouches[0].clientY;
    }
    else {
        clientX = e.clientX;
        clientY = e.clientY;
    }
    
    setDrawCircle(clientX - CANVAS_OFFSET_X, clientY + drawOffsetY);

    CTX.lineTo(clientX - CANVAS_OFFSET_X, clientY + drawOffsetY);
    CTX.stroke();
}

startDrawing = (e) => {
    lockScrolling = true;
    switch (paintMode) {
        case PAINT_MODE_PENCIL:
            startX = e.clientX;
            startY = e.clientY + drawOffsetY;
            isPainting = true;
            showDrawCircle();
            break;
        
        case PAINT_MODE_RUBBER:
            console.log("Painting allowed rubber")
            isPainting = true;
            showDrawCircle();
    }
};

endDrawing = (e) => {
    lockScrolling = false;
    isPainting = false; // since ending drawing, event doesn't matter
    switch (paintMode) {
        case PAINT_MODE_PENCIL:
            CTX.stroke();
            CTX.beginPath();
            hideDrawCirlce();
            break;
        
        case PAINT_MODE_RUBBER:
            CTX.stroke();
            CTX.beginPath();
            hideDrawCirlce();
            break;
    }
    
}

// event listeners for drawing
CANVAS.addEventListener('mousedown', startDrawing);
CANVAS.addEventListener('touchstart', startDrawing, true);

CANVAS.addEventListener('mouseenter', (e) => {
    if (mouseState === "mouseleft") startDrawing(e);
    mouseState = "mouseentered";
});

CANVAS.addEventListener('mouseup', endDrawing);
CANVAS.addEventListener('mouseleave', (e) => {
    let wasPainting = isPainting;
    if (mouseState === "mouseentered") endDrawing(e);
    if (wasPainting && DRAW_TYPE.value === PAINT_MODE_PENCIL) {
        mouseState = "mouseleft";
    }
    else {
        mouseState = undefined;
    }
});
CANVAS.addEventListener('touchend', endDrawing);
CANVAS.addEventListener('touchcancel', endDrawing);

CANVAS.addEventListener('mousemove', draw);
CANVAS.addEventListener('touchmove', draw);

document.getElementById("drawing-board").addEventListener("scroll", (e) => {
    if (e?.target?.scrollTop !== undefined) {
        drawOffsetY = e?.target?.scrollTop;
    }
})

document.body.onload = initalizePage;