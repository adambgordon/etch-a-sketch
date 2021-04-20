/* Main code */
let gridSize;
let shadeColor;
let schemeColor;
initMenu();
initGrid();

/* Functions */

// Initializes all menu items by adding listeners and setting initial values
function initMenu () {
    initSlider();
    initColorPicker();
    initRandomColorButton();
    initRainbowButton();
    initColorSchemeButton();
    initEraserButton();
    initGridlinesButton();
    initClearButton();
}

/* Menu init functions */
function initSlider() {
    const slider = getSliderElement();
    slider.addEventListener("input",sliderMove); // Updates string in real time
    slider.addEventListener("change",resetGrid); // Updates actual grid only when cursor releases
}

function initColorPicker() {
    const colorPicker = document.querySelector(".color-picker");
    colorPicker.addEventListener("change",updateShadeColor);
    setRandomColor();
}

function initRandomColorButton() {
    const randomColorButton = document.querySelector(".random-color-button");
    randomColorButton.addEventListener("click",setRandomColor);
}

function initRainbowButton() {
    const rainbowButton = document.querySelector(".rainbow-button");
    rainbowButton.addEventListener("click",toggleRainbowMode);
}

function initColorSchemeButton() {
    const colorSchemeButton = document.querySelector(".color-scheme-button");
    colorSchemeButton.addEventListener("click",toggleColorSchemeMode);
    colorSchemeButton.addEventListener("mouseenter",toggleColorSchemeButtonHover)
    colorSchemeButton.addEventListener("mouseleave",toggleColorSchemeButtonHover)

}

function initEraserButton () {
    const eraserButton = document.querySelector(".eraser-button");
    eraserButton.addEventListener("click",toggleEraserMode);
}

function initClearButton () {
    const clearButton = document.querySelector(".clear-button");
    clearButton.addEventListener("click",clearAllShading);
}

function initGridlinesButton () {
    const gridlinesButton = document.querySelector(".gridlines-button");
    gridlinesButton.addEventListener("click",toggleGridlines);
}

/* Color manipulation functions */
function setRandomColor() {
    turnOffRainbow();
    turnOffEraser();
    shadeColor = randomHexColor();
    schemeColor = shadeColor;
    const colorPicker = document.querySelector(".color-picker");
    colorPicker.value = shadeColor;
    updateColorSchemeButtonStyle();
}

function randomHexColor() {
    let hexColor = "#";
    for (let i = 0; i < 6; i++) {
        hexColor += Math.floor(Math.random()*16).toString(16);
    }
    return hexColor;
}

// Generates a "rainbow" by randomly setting one rgb component to 255
function randomRainbowColor() {
    let r, g, b;
    let rand = Math.random()*3;
    if (rand < 1) {
        r = 255;
        g = Math.floor(Math.random()*256);
        b = Math.floor(Math.random()*256);
    } else if (rand < 2) {
        r = Math.floor(Math.random()*256);
        g = 255;
        b = Math.floor(Math.random()*256);
    } else if (rand < 3) {
        r = Math.floor(Math.random()*256);
        g = Math.floor(Math.random()*256);
        b = 255;
    }
    return rgbToHex(r,g,b);
}

function updateShadeColor () {
    shadeColor = this.value;
    const colorPicker = document.querySelector(".color-picker");
    colorPicker.value = shadeColor;
    updateColorSchemeButtonStyle();
    schemeColor = shadeColor;
}

function getCurrentColor() {
    if (document.querySelector(".eraser-on") !== null) {
        return "#FFFFFF";
    } else if (document.querySelector(".color-scheme-on") !== null) {
        return shiftColorRandom(schemeColor);
    } else if (document.querySelector(".rainbow-on") !== null) {
        return randomRainbowColor();
    } else {
        return shadeColor;
    }
}

/* Slider manipulation functions */
function getSliderElement() {
    return document.querySelector(".slider");
}

function sliderMove() {
    updateSliderOutput(this.value);
}

function updateSliderOutput(sizeValue) {
    const output = sizeValue + " x " + sizeValue;
    document.querySelector(".slider-output").textContent = output;
}

/* Box shading functions */
function startShading() {
    const boxes = getBoxesList();
    boxes.forEach(box => box.addEventListener("mouseover",addShading));
    let currentBoxColor = getCurrentColor();
    this.setAttribute("style",`background-color: ${currentBoxColor};`); // Adds shading to first box clicked (otherwise only starts with next box)
}

function addShading() {
    let currentBoxColor = getCurrentColor();
    this.setAttribute("style",`background-color: ${currentBoxColor};`);
}



function stopShading() {
    const boxes = getBoxesList();
    boxes.forEach(box => box.removeEventListener("mouseover",addShading));
}

function addBoxListeners() {
    const boxes = getBoxesList();
    boxes.forEach(box => box.addEventListener("mouseup",stopShading));
    boxes.forEach(box => box.addEventListener("mousedown",startShading));
}

function clearAllShading() {
    turnOffRainbow();
    turnOffColorScheme();
    turnOffEraser();
    const boxes = getBoxesList();
    boxes.forEach(box => box.setAttribute("style","background-color: white;"));
}

function getBoxesList() {
    return document.querySelectorAll(".box");
}


// Returns canvas grid element
function getCanvasElement() {
    return document.querySelector(".canvas");
}

/* Grid manipulation functions */
function resetGrid() {
    gridSize = this.value;
    deleteGrid();
    buildGrid(getGapValue());
}

// Deletes all box elements from the DOM
function deleteGrid () {
    const canvas = getCanvasElement();
    while (canvas.firstChild) {
        canvas.removeChild(canvas.lastChild);
    }
}

// Initializes grid to 32x32 with 1px gap for gridlines
function initGrid() {
    gridSize = 50;
    const gap = 1;
    updateSliderOutput(gridSize);
    buildGrid(gap);
}

// Builds grid by creating and appending box elements
function buildGrid() {
    setGridDimensions(getGapValue());
    for (let i = 0; i < gridSize**2; i++) {
        let newBox = document.createElement("div");
        newBox.classList.add("box");
        canvas.appendChild(newBox);
    }
    addBoxListeners();
}

function getGapValue () {
    canvas = getCanvasElement();
    return parseInt(getComputedStyle(canvas).getPropertyValue("row-gap"),10);
}


function toggleGridlines() {
    let gap = getGapValue() === 1 ? 0 : 1;
    setGridDimensions(gap);
}

function setGridDimensions(gap) {
    const canvas = getCanvasElement();
    let gridUnitDimension = Math.floor(512/gridSize) - gap;
    let canvasDimension = gridSize * (gridUnitDimension + gap) - gap;

    canvas.setAttribute("style",
    `grid-template-columns: repeat(${gridSize},${gridUnitDimension}px);
    grid-template-rows: repeat(${gridSize},${gridUnitDimension}px);
    width: ${canvasDimension}px;
    height: ${canvasDimension}px;
    row-gap: ${gap}px;
    column-gap: ${gap}px;`);
}

function turnOffRainbow () {
    const rainbowButton = document.querySelector(".rainbow-button");
    if (rainbowButton.classList.contains("rainbow-on")) {
        rainbowButton.classList.remove("rainbow-on");
    }
}

function turnOffEraser () {
    const eraserButton = document.querySelector(".eraser-button");
    if (eraserButton.classList.contains("eraser-on")) {
        eraserButton.classList.remove("eraser-on");
    }
}

function turnOffColorScheme () {
    const colorSchemeButton = document.querySelector(".color-scheme-button");
    if(colorSchemeButton.classList.contains("color-scheme-on")) {
        colorSchemeButton.classList.remove("color-scheme-on");
    }
    updateColorSchemeButtonStyle();
}

/* Eraser functions */
function toggleEraserMode() {
    const eraserOn = "eraser-on";
    const eraserButton = document.querySelector(".eraser-button");
    
    if (eraserButton.classList.contains(eraserOn)) {
        eraserButton.classList.remove(eraserOn);
    } else {
        turnOffRainbow();
        turnOffColorScheme();
        eraserButton.classList.add(eraserOn);
    }
}

function toggleRainbowMode () {
    const rainbowOn = "rainbow-on";
    const rainbowButton = document.querySelector(".rainbow-button");

    if (rainbowButton.classList.contains(rainbowOn)) {
        rainbowButton.classList.remove(rainbowOn);
    } else {
        turnOffColorScheme();
        turnOffEraser();
        rainbowButton.classList.add(rainbowOn);
    }
}

function toggleColorSchemeMode () {
    const colorSchemeOn = "color-scheme-on";
    const colorSchemeHover = "color-scheme-hover";
    const colorSchemeButton = document.querySelector(".color-scheme-button");

    if (colorSchemeButton.classList.contains(colorSchemeHover)) {
        colorSchemeButton.classList.remove(colorSchemeHover);
    } else {
        colorSchemeButton.classList.add(colorSchemeHover);
    }

    if (colorSchemeButton.classList.contains(colorSchemeOn)) {
        turnOffColorScheme();
    } else {
        turnOffRainbow();
        turnOffEraser();
        colorSchemeButton.classList.add(colorSchemeOn);
    }
    updateColorSchemeButtonStyle();
}

function updateColorSchemeButtonStyle () {
    const colorSchemeButton = document.querySelector(".color-scheme-button")

    let fillColor, textColor;

    if (colorSchemeButton.classList.contains("color-scheme-on")) {
        textColor = textColorAgainstBackground(shadeColor);
        if (colorSchemeButton.classList.contains("color-scheme-hover")) {
            fillColor = lightenColor(shadeColor);
        } else {
            fillColor = shadeColor;
        }
    } else {
        fillColor = "";
        textColor = "#000000";
    }
    colorSchemeButton.setAttribute("style",`background-color:${fillColor}; color:${textColor};`);
}

function toggleColorSchemeButtonHover (event) {
    const colorSchemeButton = document.querySelector(".color-scheme-button")

    if (colorSchemeButton.classList.contains("color-scheme-on")) {
        if(colorSchemeButton.classList.contains("color-scheme-hover")) {
            colorSchemeButton.classList.remove("color-scheme-hover");
        } else {
            colorSchemeButton.classList.add("color-scheme-hover");
        }
        updateColorSchemeButtonStyle();
    }
}

function textColorAgainstBackground(hexColor) {
    let r = hexToR(hexColor);
    let g = hexToG(hexColor);
    let b = hexToB(hexColor);

    let rgbAverage = (r+g+b)/3;
    let rgbMax = Math.max(r,g,b);

    return (rgbAverage > 160 || rgbMax > 230) ? "#000000" : "#FFFFFF";
}

function lightenColor (hexColor) {
    let r = hexToR(hexColor);
    let g = hexToG(hexColor);
    let b = hexToB(hexColor);

    const lighten = 40;

    r = constrain(r + lighten);
    g = constrain(g + lighten);
    b = constrain(b + lighten);

    hexColor = rgbToHex(r,g,b);
    
    return hexColor;
}


function shiftColorRandom (hexColor) {
    let r = hexToR(hexColor);
    let g = hexToG(hexColor);
    let b = hexToB(hexColor);

    r = randomShift(r);
    g = randomShift(g);
    b = randomShift(b);

    r = constrain(r);
    g = constrain(g);
    b = constrain(b);

    hexColor = rgbToHex(r,g,b);
    
    return hexColor;
}

function randomShift (num) {
    return num + (40*randomSign());
}

function randomSign() {
    return Math.random() < 0.5 ? -1 : 1;
}


function constrain (num) {
    return Math.max(0,Math.min(num,255));
}

function rgbToHex(r,g,b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function componentToHex(component) {
    let hex = component.toString(16);
    hex = hex.length === 1 ? "0" + hex : hex;
    return hex;
}

function hexToR (hexColor) {
    return parseInt(hexColor.substr(1,2), 16);
}

function hexToG (hexColor) {
    return parseInt(hexColor.substr(3,2), 16);
}

function hexToB (hexColor) {
    return parseInt(hexColor.substr(5,2), 16);
}
