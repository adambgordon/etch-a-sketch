// Main code
let gridSize;
initGrid();
initSlider();




// Adds the slider listeners
function initSlider() {
    const slider = getSliderElement();
    slider.addEventListener("input",sliderMove);
    slider.addEventListener("change",resetGrid);
}

function startShading(event) {
    const boxes = document.querySelectorAll(".box");
    boxes.forEach(box => box.addEventListener("mouseover",addShading));
    this.classList.add("shading"); // Adds shading to first box clicked (otherwise only starts with next box)
}

function addShading(event) {
    this.classList.add("shading");
}

function stopShading(event) {
    const boxes = document.querySelectorAll(".box");
    boxes.forEach(box => box.removeEventListener("mouseover",addShading));
}

function addBoxListeners() {
    console.log("test");
    const boxes = document.querySelectorAll(".box");
    boxes.forEach(box => box.addEventListener("mouseup",stopShading));
    boxes.forEach(box => box.addEventListener("mousedown",startShading));
}

// Gets slider element
function getSliderElement() {
    return document.querySelector(".slider");
}

// Called whenever slider moves
function sliderMove(event) {
    updateSliderOutput(this.value);
}

// Sets output, e.g. "32 x 32"
function updateSliderOutput(sizeValue) {
    const output = sizeValue + " x " + sizeValue;
    document.querySelector(".slider-output").textContent = output;
}

// Returns canvas grid element
function getCanvasElement() {
    return document.querySelector(".canvas");
}

// Resets the grid when the slider is released on a value
function resetGrid(event) {
    gridSize = this.value;
    deleteGrid();
    buildGrid();
}

// Deletes all box elements from the DOM
function deleteGrid () {
    const canvas = getCanvasElement();
    while (canvas.firstChild) {
        canvas.removeChild(canvas.lastChild);
    }
}

// Initializes grid to 32x32
function initGrid() {
    gridSize = 32;
    updateSliderOutput(gridSize);
    buildGrid();
}

// Builds grid by adding box elements
function buildGrid() {
    const canvas = getCanvasElement();

    let gap = parseInt(getComputedStyle(canvas).getPropertyValue("row-gap"),10);
    let gridUnitDimension = Math.floor(512/gridSize) - gap;
    let canvasDimension = gridSize * (gridUnitDimension + gap) - 1;

    canvas.setAttribute("style",
    `grid-template-columns: repeat(${gridSize},${gridUnitDimension}px);
    grid-template-rows: repeat(${gridSize},${gridUnitDimension}px);
    width: ${canvasDimension}px;
    height: ${canvasDimension}px;`);


    for (let i = 0; i < gridSize**2; i++) {
        let newBox = document.createElement("div");
        newBox.classList.add("box");
        canvas.appendChild(newBox);
    }

    addBoxListeners();
}