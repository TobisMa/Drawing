const HIDDEN_NODE_CLASS = "hidden";

const SHADOW_PAGE_ELEMENT = document.getElementById("shadow-page");
const SAVE_BUTTON = document.getElementById("save");

const DOWNLOAD_AREA = {
    self: document.getElementById("download-area"),
    preview: document.getElementById("preview"),
    link: document.getElementById("canvas-download-link")
};

// saving canvas
function saveCanvas() {
    let img = new Image();  
    let data = CANVAS.toDataURL();
    img.src = data;

    DOWNLOAD_AREA.preview.innerHTML = "<h4>Download by pressing on the image</h4>";

    DOWNLOAD_AREA.link.href = data;
    DOWNLOAD_AREA.link.innerHTML = "";
    DOWNLOAD_AREA.link.appendChild(img);
    DOWNLOAD_AREA.link.download = new Date().toUTCString() + " Tafelanschrieb.png";

    shadowPage(true);
    DOWNLOAD_AREA.self.classList.remove(HIDDEN_NODE_CLASS);
}

function removeDownloadDialog() {
    DOWNLOAD_AREA.self.classList.add(HIDDEN_NODE_CLASS);
    shadowPage(false);
}

function shadowPage(shadow = false) {
    console.log("Shadowing page?: " + shadow);
    if (shadow) {
        SHADOW_PAGE_ELEMENT.classList.remove(HIDDEN_NODE_CLASS);
    } else {
        SHADOW_PAGE_ELEMENT.classList.add(HIDDEN_NODE_CLASS);
    }
}

SAVE_BUTTON.addEventListener("click", _ => saveCanvas());
SAVE_BUTTON.addEventListener("touchend", _ => saveCanvas());