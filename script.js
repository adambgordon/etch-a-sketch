buildGrid();


// Returns grid size element
function getGridSizeElement() {
    return document.querySelector(".grid-size");
}

function getCanvasElement() {
    return document.querySelector(".canvas");
}


function buildGrid() {
    const canvas = getCanvasElement();

    const gridSize = getGridSizeElement().textContent;
    const gridUnitDimension = Math.round(500/gridSize);
    console.log(gridUnitDimension);
    canvas.setAttribute("style",
    `grid-template-columns: repeat(${gridSize},${gridUnitDimension}px);
    grid-template-rows: repeat(${gridSize},${gridUnitDimension}px);`);

    for (let i = 0; i < gridSize * gridSize; i++) {
        canvas.appendChild(document.createElement("div"));
    }
}