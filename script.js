const getEle = (name) => document.getElementById(name);
const activeToolEl = getEle("active-tool");
const brushColorBtn = getEle("brush-color");
const brushIcon = getEle("brush");
const brushSize = getEle("brush-size");
const brushSlider = getEle("brush-slider");
const bucketColorBtn = getEle("bucket-color");
const eraser = getEle("eraser");
const clearCanvasBtn = getEle("clear-canvas");
const saveStorageBtn = getEle("save-storage");
const loadStorageBtn = getEle("load-storage");
const clearStorageBtn = getEle("clear-storage");
const downloadBtn = getEle("download");
const warning = getEle("warning");
const close = getEle("exit");
const confirm = getEle("confirm-clear");
const { body } = document;

const canvas = document.createElement("canvas");
canvas.id = "canvas";
const context = canvas.getContext("2d");

let currentSize = 10;
let bucketColor = "#FFFFFF";
let currentColor = "#A51DAB";
let isMouseDown = false;
let drawnArray = [];

function displayBrushSize() {
  if (brushSlider.value < 10) {
    brushSize.textContent = `0${brushSlider.value}`;
  } else {
    brushSize.textContent = brushSlider.value;
  }
}
brushSlider.addEventListener("change", () => {
  currentSize = brushSlider.value;
  displayBrushSize();
});

brushColorBtn.addEventListener("change", () => {
  currentColor = `#${brushColorBtn.value}`;
  brushIcon.style.color = `#${brushColorBtn.value}`;
});

bucketColorBtn.addEventListener("change", () => {
  bucketColor = `#${bucketColorBtn.value}`;
  createCanvas();
  restoreCanvas();
});

function switchToBrush() {
  activeToolEl.textContent = "Draw";
  currentColor = `#${brushColorBtn.value}`;
  currentSize = brushSlider.value;
}
function createCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 50;
  context.fillStyle = bucketColor;
  context.fillRect(0, 0, canvas.width, canvas.height);
  body.appendChild(canvas);
  switchToBrush();
  currentSize = 10;
  brushSlider.value = 10;
  displayBrushSize();
}

close.addEventListener("click", () => {
  warning.style.display = "none";
});

eraser.addEventListener("click", () => {
  warning.style.display = "block";
});

confirm.addEventListener("click", () => {
  brushIcon.style.color = "white";
  activeToolEl.textContent = "All Clear";
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = bucketColor;
  context.fillRect(0, 0, canvas.width, canvas.height);
  drawnArray = [];
  setTimeout(switchToBrush, 900);
  warning.style.display = "none";
});
function restoreCanvas() {
  for (let i = 1; i < drawnArray.length; i++) {
    context.beginPath();
    context.moveTo(drawnArray[i - 1].x, drawnArray[i - 1].y);
    context.lineWidth = drawnArray[i].size;
    context.lineCap = "round";
    context.strokeStyle = drawnArray[i].color;
    context.lineTo(drawnArray[i].x, drawnArray[i].y);
    context.stroke();
  }
}

function storeDrawn(x, y, size, color) {
  const lineObj = { x, y, size, color };
  drawnArray.push(lineObj);
}
function getMousePosition(event) {
  const boundary = canvas.getBoundingClientRect();
  // x, y, top,right,left,bottom  // remember there is a topbar
  return {
    x: event.clientX,
    y: event.clientY - boundary.top,
  };
}

canvas.addEventListener("mousedown", (event) => {
  isMouseDown = true;
  const currentPosition = getMousePosition(event);
  context.moveTo(currentPosition.x, currentPosition.y);
  context.beginPath();
  context.lineWidth = currentSize;
  context.lineCap = "round";
  context.lineJoin = "miter";
  context.strokeStyle = currentColor;
});

canvas.addEventListener("mousemove", (event) => {
  if (isMouseDown) {
    const currentPosition = getMousePosition(event);
    context.lineTo(currentPosition.x, currentPosition.y);
    context.stroke();
    storeDrawn(currentPosition.x, currentPosition.y, currentSize, currentColor);
  } else {
    storeDrawn(undefined);
  }
});

canvas.addEventListener("mouseup", () => {
  isMouseDown = false;
});

saveStorageBtn.addEventListener("click", () => {
  localStorage.setItem("savedCanvas", JSON.stringify(drawnArray));
  activeToolEl.textContent = "Canvas Saved";
  setTimeout(switchToBrush, 1200);
});

loadStorageBtn.addEventListener("click", () => {
  if (localStorage.getItem("savedCanvas")) {
    drawnArray = JSON.parse(localStorage.savedCanvas);
    restoreCanvas();
    activeToolEl.textContent = "Canvas Loaded";
    setTimeout(switchToBrush, 1200);
  } else {
    activeToolEl.textContent = "No Canvas Found";
    setTimeout(switchToBrush, 1200);
  }
});

clearStorageBtn.addEventListener("click", () => {
  localStorage.removeItem("savedCanvas");
  activeToolEl.textContent = "Clear Saved Canvas";
  setTimeout(switchToBrush, 1200);
});

downloadBtn.addEventListener("click", () => {
  downloadBtn.href = canvas.toDataURL("image/jpeg");
  downloadBtn.download = "Awesome-Work.jpeg";
  activeToolEl.textContent = "Image Download!";
  setTimeout(switchToBrush, 1200);
});

brushIcon.addEventListener("click", switchToBrush);

createCanvas();
