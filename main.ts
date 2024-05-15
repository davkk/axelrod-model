const canvas = document.querySelector("canvas");
if (canvas == null) throw new Error("Canvas not found");

const ctx = canvas.getContext("2d");
if (ctx == null) throw new Error("Context could not be created");

const { width } = canvas.getBoundingClientRect();

const cellSize = 8;
const cols = width / cellSize;

let running = true;
let numFeatures = 3;
let numTraits = 3;

function getCells() {
    return Array.from({ length: cols }, () => {
        return Array.from({ length: cols }, () => {
            return Array.from({ length: numFeatures }, () => {
                return Math.floor(Math.random() * numTraits);
            });
        });
    });
}

function drawGrid(element: HTMLCanvasElement) {
    const ctx = element.getContext("2d");
    if (ctx == null) throw new Error("Could not get context");

    ctx.clearRect(0, 0, element.width, element.height);

    for (let row = 0; row < cols; ++row) {
        for (let col = 0; col < cols; ++col) {
            ctx.fillStyle = "white";
            ctx.fillRect(row * cellSize, col * cellSize, cellSize, cellSize);
        }
    }
}

function simulate() {
    for (let i = 0; i < cols; ++i) {
        const cell1 = Math.floor(Math.random() * cols);
        const cell2 = Math.floor(Math.random() * cols);
    }
    setTimeout(simulate, 250);
}
