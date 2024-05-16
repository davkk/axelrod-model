import { debounce, mod, randInt } from "./utils";

const canvas = document.querySelector("canvas")!;

const ctx = canvas.getContext("2d")!;
const { width } = canvas.getBoundingClientRect();

const updates: HTMLSpanElement = document.querySelector("#updates")!;
const simSpeed: HTMLInputElement = document.querySelector("#speed")!;
const featuresInput: HTMLInputElement = document.querySelector("#features")!;
const traitsInput: HTMLInputElement = document.querySelector("#traits")!;

// TODO add slider/select for grid size
const cellSize = 32;
const cols = Math.round(width / cellSize);

let numFeatures: number = 2;
let numTraits: number = 2;

function getCells(cols: number, numFeatures: number, numTraits: number) {
    return Array.from({ length: cols }, () => {
        return Array.from({ length: cols }, () => {
            return Array.from({ length: numFeatures }, () => {
                return randInt(numTraits);
            });
        });
    });
}

let cells = getCells(cols, numFeatures, numTraits);

function overlap(cell1: number[], cell2: number[], numFeatures: number) {
    let sameFeatures = 0;
    for (let idx = 0; idx < numFeatures; ++idx) {
        if (cell1[idx] === cell2[idx]) {
            sameFeatures++;
        }
    }
    return 1 - sameFeatures / cell1.length;
}

function drawGrid() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, width, width);

    for (let y = 0; y < cols; ++y) {
        for (let x = 0; x < cols; ++x) {
            const cell = cells[y][x];

            const cellX = cells[y][mod(x + 1, cols)];
            ctx.strokeStyle = `rgba(0, 0, 0, ${overlap(cell, cellX, +featuresInput.value)}`;
            ctx.beginPath();
            ctx.moveTo(x * cellSize, y * cellSize);
            ctx.lineTo((x + 1) * cellSize, y * cellSize);
            ctx.stroke();

            const cellY = cells[mod(y + 1, cols)][x];
            ctx.strokeStyle = `rgba(0, 0, 0, ${overlap(cell, cellY, +featuresInput.value)}`;
            ctx.beginPath();
            ctx.moveTo(x * cellSize, y * cellSize);
            ctx.lineTo(x * cellSize, (y + 1) * cellSize);
            ctx.stroke();
        }
    }
}

const directions = [
    [-1, 0],
    [1, 0],
    [0, 1],
    [0, -1],
];

function tick() {
    for (let inter = 0; inter < +simSpeed.value; ++inter) {
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
    updates.innerHTML = (+updates.innerText + 1).toString();
    // requestAnimationFrame(tick);
}

function updateInputs() {
    numFeatures = +featuresInput.value;
    numTraits = +traitsInput.value;
    updates.innerHTML = "0";

    cells = getCells(cols, numFeatures, numTraits);
    drawGrid();

    tick();
}

const onChange = debounce(updateInputs);
onChange();

featuresInput.addEventListener("change", onChange);
traitsInput.addEventListener("change", onChange);
