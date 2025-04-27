// NOTE: nezavur6eno
// TODO: calcScore
const canvas = document.getElementById('canvas-id');
const context = canvas.getContext('2d');

const EMPTY = 0;
const BROCOL = 1;
const GRID_SIZE = 30;

let started = true;

let grid = [];
let kufteta = [];
let kufteSet = new Set([]);

for (let x = 0; x < GRID_SIZE; x++) {
    grid[x] = [];
    for (let y = 0; y < GRID_SIZE; y++) {
        grid[x][y] =
            Math.random() < 0.3 || x == 0 || y == 0 || x == GRID_SIZE - 1 || y == GRID_SIZE - 1
                ? BROCOL
                : EMPTY;
    }
}

for (let i = 0; i < GRID_SIZE; i++) {
    let x, y;
    do {
        x = Math.floor(Math.random() * GRID_SIZE);
        y = Math.floor(Math.random() * GRID_SIZE);
    } while (grid[x][y] == BROCOL);

    kufteta.push({
        x: x,
        y: y
    });
    kufteSet.add(i);
}

let start;
do {
    start = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
    };
} while (grid[start.x][start.y] == BROCOL);

const players = [
    new Tapak()
];

let states = [];
for (let _ of players) {
    states.push({
        x: start.x,
        y: start.y,
        steps: 0,
        collected: new Set([]),
        dead: false,
        finished: false
    });
}

function updateState() {
    if (!started) return;
    for (let i in players) {
        if (states[i].dead || states[i].finished) continue;
        const coords = {
            x: states[i].x,
            y: states[i].y
        };
        let remaining = [];
        for (let j of kufteSet.difference(states[i].collected)) {
            remaining.push(structuredClone(kufteta[j]));
        }

        let pov = [];
        for (let x = -3; x <= 3; x++) {
            pov[x + 3] = [];
            for (let y = -3; y <= 3; y++) {
                pov[x + 3][y + 3] =
                    states[i].x + x < 0 || states[i].y + y < 0 || states[i].x + x >= GRID_SIZE || states[i].y + y >= GRID_SIZE
                        ? BROCOL
                        : grid[states[i].x + x][states[i].y + y];
            }
        }
        const res = players[i].mrudaj(coords, remaining, pov);
        switch (res) {
            case 0:
                states[i].x--;
                break;

            case 1:
                states[i].y--;
                break;

            case 2:
                states[i].x++;
                break;

            case 3:
                states[i].y++;
                break;

            case 4:
                states[i].finished = true;
                break;

            default:
                states[i].dead = true;
                break;
        }

        for (let j in kufteta) {
            if (states[i].x == kufteta[j].x && states[i].y == kufteta[j].y) {
                states[i].collected.add(Number(j));
            }
        }

        if (grid[states[i].x][states[i].y] == BROCOL) {
            states[i].dead = true;
        }
    }
}

function update() {
    updateState();
    draw();
}

function draw() {
    const CELL_SIZE = Math.floor(Math.min(window.innerWidth, window.innerHeight) / GRID_SIZE);
    canvas.width = CELL_SIZE * GRID_SIZE;
    canvas.height = CELL_SIZE * GRID_SIZE;

    context.fillStyle = '#000000';
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = "#ff00ff"
    for (const k of kufteta) {
        context.fillRect(k.x * CELL_SIZE, k.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }

    for (const i in players) {
        context.fillStyle = players[i].color;
        context.fillRect(states[i].x * CELL_SIZE, states[i].y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }

    context.strokeStyle = '#ffffff';
    for (let x = 0; x < GRID_SIZE; x++) {
        for (let y = 0; y < GRID_SIZE; y++) {
            if (grid[x][y] == 1) {
                context.fillStyle = '#00ff00';
                context.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            }
            context.strokeRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
    }
}

setInterval(update, 1000);