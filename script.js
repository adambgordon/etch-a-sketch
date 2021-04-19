// Main code
let gridSize = 32;

const slider = getSliderElement();
slider.addEventListener("input",updateSliderOutput);
slider.addEventListener("change",resetGrid);

// Gets slider element
function getSliderElement() {
    return document.querySelector(".slider");
}

// Sets output, e.g. "32 x 32"
function updateSliderOutput(event) {
    gridSize = this.value;
    const output = gridSize + " x " + gridSize;
    document.querySelector(".slider-output").textContent = output;
}

// Returns canvas grid element
function getCanvasElement() {
    return document.querySelector(".canvas");
}

// Builds grid based on a grid size
function resetGrid(event) {
    gridSize = this.value;
    const canvas = getCanvasElement();
    const gridUnitDimension = Math.floor(500/gridSize);

    canvas.setAttribute("style",
    `grid-template-columns: repeat(${gridSize},${gridUnitDimension}px);
    grid-template-rows: repeat(${gridSize},${gridUnitDimension}px);
    width: ${gridSize * gridUnitDimension};
    height: ${gridSize * gridUnitDimension};`);

    for (let i = 0; i < gridSize * gridSize; i++) {
        canvas.appendChild(document.createElement("div"));
    }
}