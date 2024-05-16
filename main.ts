const canvas = document.querySelector("canvas");
if (canvas == null) throw new Error("Canvas not found");

const ctx = canvas.getContext("2d");
if (ctx == null) throw new Error("Context could not be created");

const { width } = canvas.getBoundingClientRect();

const cellSize = 16;
const cols = width / cellSize;

let running = true;
let numFeatures = 4;
let numTraits = 5;

const cells = Array.from({ length: cols }, () => {
    return Array.from({ length: cols }, () => {
        return Array.from({ length: numFeatures }, () => {
            return randInt(numTraits);
        });
    });
});

function randInt(max: number) {
    return Math.floor(Math.random() * max);
}

function mod(a: number, b: number) {
    return ((a % b) + b) % b;
}

function mapFeaturesToColor(features: number[]) {
    const hue = features.reduce((a, b) => a + b, 0) / features.length;
    const saturation = 0.8;
    const lightness = 0.5;
    const hslColor = `hsl(${hue * 360}, ${saturation * 100}%, ${lightness * 100}%)`;
    return hslColor;
}

function drawGrid() {
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, width, width);

    for (let y = 0; y < cols; ++y) {
        for (let x = 0; x < cols; ++x) {
            ctx.fillStyle = mapFeaturesToColor(cells[y][x]);
            ctx.fillRect(y * cellSize, x * cellSize, cellSize, cellSize);
        }
    }
}

const directions = [
    [-1, 0],
    [1, 0],
    [0, 1],
    [0, -1],
];

function simulate() {
    for (let step = 0; step < 1000000; ++step) {
        const y = randInt(cols);
        const x = randInt(cols);
        const [dy, dx] = directions[randInt(directions.length)];

        const cell1 = cells[y][x];
        const cell2 = cells[mod(y + dy, cols)][mod(x + dx, cols)];

        let sameFeatures = 0;
        const availableFeatures = [];
        for (let idx = 0; idx < numFeatures; ++idx) {
            if (cell1[idx] === cell2[idx]) {
                sameFeatures++;
            } else {
                availableFeatures.push(idx);
            }
        }

        if (
            sameFeatures < numFeatures &&
            Math.random() < sameFeatures / numFeatures
        ) {
            const randFeature = randInt(availableFeatures.length);
            cells[y][x][randFeature] = cell2[randFeature];
        }
    }
    drawGrid();
    requestAnimationFrame(simulate);
}

simulate();
