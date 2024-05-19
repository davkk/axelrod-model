import { debounce, mod, randInt } from "./utils";

const canvas = document.querySelector("canvas")!;

const ctx = canvas.getContext("2d")!;
const { width } = canvas.getBoundingClientRect();

const interactionsDisplay: HTMLSpanElement =
    document.querySelector("#interactions")!;
const gridSizeSelect: HTMLSelectElement = document.querySelector("#grid-size")!;
const simSpeed: HTMLInputElement = document.querySelector("#speed")!;
const featuresInput: HTMLInputElement = document.querySelector("#features")!;
const traitsInput: HTMLInputElement = document.querySelector("#traits")!;

class Axelrod {
    private cols: number;
    private cells: number[][][];
    private interactions: number;

    constructor(
        width: number,
        private cellSize: number,
        private numFeatures: number,
        numTraits: number,
    ) {
        this.interactions = 0;
        this.cols = Math.round(width / cellSize);

        this.cells = Array.from({ length: this.cols }, () => {
            return Array.from({ length: this.cols }, () => {
                return Array.from({ length: numFeatures }, () => {
                    return randInt(numTraits);
                });
            });
        });
    }

    private overlap(cell1: number[], cell2: number[], numFeatures: number) {
        let sameFeatures = 0;
        for (let idx = 0; idx < numFeatures; ++idx) {
            if (cell1[idx] === cell2[idx]) {
                sameFeatures++;
            }
        }
        return 1 - sameFeatures / cell1.length;
    }

    private drawGrid() {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, width, width);

        for (let y = 0; y < this.cols; ++y) {
            for (let x = 0; x < this.cols; ++x) {
                const cell = this.cells[y][x];

                const cellX = this.cells[y][mod(x + 1, this.cols)];
                ctx.strokeStyle = `rgba(0, 0, 0, ${this.overlap(cell, cellX, +featuresInput.value)}`;
                ctx.beginPath();
                ctx.moveTo(x * this.cellSize, y * this.cellSize);
                ctx.lineTo((x + 1) * this.cellSize, y * this.cellSize);
                ctx.stroke();

                const cellY = this.cells[mod(y + 1, this.cols)][x];
                ctx.strokeStyle = `rgba(0, 0, 0, ${this.overlap(cell, cellY, +featuresInput.value)}`;
                ctx.beginPath();
                ctx.moveTo(x * this.cellSize, y * this.cellSize);
                ctx.lineTo(x * this.cellSize, (y + 1) * this.cellSize);
                ctx.stroke();
            }
        }
    }

    private directions = [
        [-1, 0],
        [1, 0],
        [0, 1],
        [0, -1],
    ];

    tick() {
        for (let inter = 0; inter < +simSpeed.value; ++inter) {
            const y = randInt(this.cols);
            const x = randInt(this.cols);
            const [dy, dx] = this.directions[randInt(this.directions.length)];

            const cell1 = this.cells[y][x];
            const cell2 =
                this.cells[mod(y + dy, this.cols)][mod(x + dx, this.cols)];

            let sameFeatures = 0;
            const availableFeatures = [];
            for (let idx = 0; idx < this.numFeatures; ++idx) {
                if (cell1[idx] === cell2[idx]) {
                    sameFeatures++;
                } else {
                    availableFeatures.push(idx);
                }
            }

            if (
                sameFeatures < this.numFeatures &&
                Math.random() < sameFeatures / this.numFeatures
            ) {
                const randFeature = randInt(availableFeatures.length);
                this.cells[y][x][randFeature] = cell2[randFeature];
            }

            this.interactions++;
        }

        this.drawGrid();
        interactionsDisplay.innerHTML = this.interactions.toString();
        requestAnimationFrame(() => this.tick());
    }
}

function start() {
    new Axelrod(
        width,
        +gridSizeSelect.value,
        +featuresInput.value,
        +traitsInput.value,
    ).tick();
}

const onChange = debounce(start);
onChange();

gridSizeSelect.addEventListener("change", onChange);
featuresInput.addEventListener("change", onChange);
traitsInput.addEventListener("change", onChange);
