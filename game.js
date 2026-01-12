const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameWrapper = document.getElementById('game-wrapper');

const TILE_SIZE = 16;
const ROW_COUNT = 31;
const COL_COUNT = 28;

// Map encoding: 0 = Wall, 1 = Pellet, 2 = Empty, 3 = Power Pellet (treat as 1 for now), 4 = Pacman Spawn
// Simplified classic map
const mapLayout = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
    [0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
    [0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0],
    [0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    [2, 2, 2, 2, 2, 0, 1, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 1, 0, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 0, 1, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 1, 0, 2, 2, 2, 2, 2],
    [0, 0, 0, 0, 0, 0, 1, 0, 0, 2, 0, 2, 2, 2, 2, 2, 2, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    [2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 0, 2, 2, 2, 2, 2, 2, 0, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2],
    [0, 0, 0, 0, 0, 0, 1, 0, 0, 2, 0, 2, 2, 2, 2, 2, 2, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    [2, 2, 2, 2, 2, 0, 1, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 1, 0, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 0, 1, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 1, 0, 2, 2, 2, 2, 2],
    [0, 0, 0, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
    [0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0],
    [0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

let score = 0;
let pelletsEaten = 0; // Separate tracker for shake logic if needed, but score works fine
let pacman = {
    x: 13, // Grid coordinates
    y: 23,
    dir: 0, // 0: Right, 1: Down, 2: Left, 3: Up
    nextDir: 0,
    speed: 0.15, // Movement speed in tiles per frame (simplified)
    pixelX: 0,
    pixelY: 0,
    moving: false,
    mouthOpen: 0.2,
    mouthSpeed: 0.02
};

// Initialize pixel positions
function initGame() {
    // Find spawn
    for (let r = 0; r < mapLayout.length; r++) {
        for (let c = 0; c < mapLayout[0].length; c++) {
            if (mapLayout[r][c] === 4) {
                pacman.x = c;
                pacman.y = r;
                mapLayout[r][c] = 2; // Clear spawn point
            }
        }
    }
    pacman.pixelX = pacman.x * TILE_SIZE;
    pacman.pixelY = pacman.y * TILE_SIZE;

    requestAnimationFrame(gameLoop);
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

const DIRECTIONS = [
    { x: 1, y: 0 }, // Right
    { x: 0, y: 1 }, // Down
    { x: -1, y: 0 }, // Left
    { x: 0, y: -1 } // Up
];

function tryMove(dir) {
    let nextRow = Math.floor(pacman.y + DIRECTIONS[dir].y);
    let nextCol = Math.floor(pacman.x + DIRECTIONS[dir].x);

    // Bounds check
    if (nextRow < 0 || nextRow >= ROW_COUNT || nextCol < 0 || nextCol >= COL_COUNT) {
        return false;
    }

    // Wall check
    if (mapLayout[nextRow][nextCol] === 0) {
        return false;
    }

    return true;
}

function update() {
    // 1. Handle Direction Changes at Tile Centers
    // We only allow turning when roughly centered on a tile to avoid getting stuck
    // Determine center of current tile
    let centerX = pacman.x * TILE_SIZE;
    let centerY = pacman.y * TILE_SIZE;
    let dist = Math.sqrt((pacman.pixelX - centerX) ** 2 + (pacman.pixelY - centerY) ** 2);

    let canTurn = dist < 2.0; // Tolerance

    if (canTurn && pacman.nextDir !== pacman.dir) {
        // Check if we can move in the next direction
        let nextRow = Math.round(pacman.y) + DIRECTIONS[pacman.nextDir].y;
        let nextCol = Math.round(pacman.x) + DIRECTIONS[pacman.nextDir].x;

        // Simple wall check for grid based turn
        if (mapLayout[nextRow] && mapLayout[nextRow][nextCol] !== 0) {
            pacman.dir = pacman.nextDir;
            // Snap to grid to aligned turning
            pacman.pixelX = centerX;
            pacman.pixelY = centerY;
            pacman.x = Math.round(pacman.x);
            pacman.y = Math.round(pacman.y);
        }
    }

    // 2. Move
    let dx = DIRECTIONS[pacman.dir].x * pacman.speed * TILE_SIZE;
    let dy = DIRECTIONS[pacman.dir].y * pacman.speed * TILE_SIZE;

    // Look ahead for collision
    let aheadRow = Math.floor((pacman.pixelY + dy + TILE_SIZE / 2) / TILE_SIZE);
    let aheadCol = Math.floor((pacman.pixelX + dx + TILE_SIZE / 2) / TILE_SIZE);

    if (mapLayout[aheadRow] && mapLayout[aheadRow][aheadCol] === 0) {
        // Hit a wall, stop
        // Snap to center of previous valid tile
        // This is a simple collision; for a smoother feel we might need more complex checks
        // but for this task, this suffices.
    } else {
        pacman.pixelX += dx;
        pacman.pixelY += dy;
    }

    // Update logical grid position
    pacman.x = pacman.pixelX / TILE_SIZE;
    pacman.y = pacman.pixelY / TILE_SIZE;

    // Wrap around (Classic Pacman tunnel)
    if (pacman.x < -0.5) { pacman.pixelX = (COL_COUNT - 0.5) * TILE_SIZE; }
    if (pacman.x >= COL_COUNT) { pacman.pixelX = -0.5 * TILE_SIZE; }

    // 3. Eat Pellets
    let centerCol = Math.round(pacman.x);
    let centerRow = Math.round(pacman.y);
    let distToCenter = Math.sqrt((pacman.pixelX - centerCol * TILE_SIZE) ** 2 + (pacman.pixelY - centerRow * TILE_SIZE) ** 2);

    if (distToCenter < 4) { // Only eat when close to center
        if (mapLayout[centerRow][centerCol] === 1 || mapLayout[centerRow][centerCol] === 3) {
            mapLayout[centerRow][centerCol] = 2; // Empty
            score++;
            scoreElement.innerText = score;

            // SHAKE CHECK
            if (score % 10 === 0) {
                triggerShake();
            }
        }
    }
}

function triggerShake() {
    document.body.classList.add('shake-active');
    // Remove class after animation finishes to reset for next time (or keep it if it loops?)
    // The CSS loop is infinite, but we want it to stop eventually or just keep going?
    // User said "a cada 10 pontos... a tela deve tremer". Implies a temporary event.
    setTimeout(() => {
        document.body.classList.remove('shake-active');
    }, 500); // 0.5s match CSS
}

function draw() {
    // Clear
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Map
    for (let r = 0; r < mapLayout.length; r++) {
        for (let c = 0; c < mapLayout[0].length; c++) {
            let tile = mapLayout[r][c];
            if (tile === 0) {
                ctx.fillStyle = "#1919a6";
                ctx.fillRect(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                // Inner black square for outline effect
                ctx.fillStyle = "black";
                ctx.fillRect(c * TILE_SIZE + 4, r * TILE_SIZE + 4, TILE_SIZE - 8, TILE_SIZE - 8);
            } else if (tile === 1) {
                ctx.fillStyle = "#ffb8ae";
                ctx.fillRect(c * TILE_SIZE + 6, r * TILE_SIZE + 6, 4, 4);
            }
        }
    }

    // Animation State
    if (pacman.moving) {
        pacman.mouthOpen += pacman.mouthSpeed;
        if (pacman.mouthOpen > 0.25 || pacman.mouthOpen < 0) {
            pacman.mouthSpeed = -pacman.mouthSpeed;
        }
    }

    // Draw Pacman
    ctx.save();

    // Translate to center of Pacman
    ctx.translate(pacman.pixelX + TILE_SIZE / 2, pacman.pixelY + TILE_SIZE / 2);

    // Rotate based on direction
    // 0: Right (0), 1: Down (PI/2), 2: Left (PI), 3: Up (-PI/2)
    let rotation = 0;
    switch (pacman.dir) {
        case 0: rotation = 0; break;
        case 1: rotation = Math.PI / 2; break;
        case 2: rotation = Math.PI; break;
        case 3: rotation = -Math.PI / 2; break;
    }
    ctx.rotate(rotation);

    // Draw Body (Arc)
    // Dynamic mouth angle
    let mouth = pacman.mouthOpen * Math.PI;

    ctx.fillStyle = "yellow";
    ctx.beginPath();
    // Arc from mouth angle to 2PI - mouth angle
    // In local space, facing Right is always 0
    ctx.arc(0, 0, TILE_SIZE / 2 - 2, mouth, 2 * Math.PI - mouth);
    ctx.lineTo(0, 0); // Center to close the wedge
    ctx.fill();

    ctx.restore();
}

let keys = {};

window.addEventListener('keydown', (e) => {
    // Prevent default scrolling for arrow keys
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.key) > -1) {
        e.preventDefault();
    }
    keys[e.key] = true;
    updateDirectionFromKeys();
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
    updateDirectionFromKeys();
});

// Directions mapping for reverse lookup
const KEY_TO_DIR = {
    'ArrowRight': 0,
    'ArrowDown': 1,
    'ArrowLeft': 2,
    'ArrowUp': 3
};

function updateDirectionFromKeys() {
    let activeKeys = [];
    // Check all keys we care about
    ['ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'].forEach(key => {
        if (keys[key]) activeKeys.push(key);
    });

    if (activeKeys.length > 0) {
        pacman.moving = true;

        // If we are currently moving in a direction that is NO LONGER pressed, 
        // we must switch to one that IS pressed.
        // Also, if we just pressed a new key, KeyDown handled the immediate switch.
        // But if we RELEASE a key, we need to fallback.

        // Check if the current nextDir corresponds to a held key
        let currentNextDirKey = Object.keys(KEY_TO_DIR).find(k => KEY_TO_DIR[k] === pacman.nextDir);

        if (!keys[currentNextDirKey]) {
            // The key for our desired direction is not held anymore.
            // Switch to the last one in our active list (arbitrary priority, but works)
            let newKey = activeKeys[activeKeys.length - 1]; // Pick one
            pacman.nextDir = KEY_TO_DIR[newKey];
        }
    } else {
        pacman.moving = false;
    }
}

// Enhance KeyDown to set direction immediately and update strict priority
window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowRight': pacman.nextDir = 0; break;
        case 'ArrowDown': pacman.nextDir = 1; break;
        case 'ArrowLeft': pacman.nextDir = 2; break;
        case 'ArrowUp': pacman.nextDir = 3; break;
    }
});


function update() {
    // 1. Check Input State
    if (!pacman.moving) {
        // If not pressing keys, we stop immediately?
        // Or do we finish the tile?
        // "Pacman ande somente se eu estiver pressionando".
        // Immediate stop is most faithful to this requests literal meaning.
        return;
    }

    // 2. Handle Turning
    let centerX = pacman.x * TILE_SIZE;
    let centerY = pacman.y * TILE_SIZE;
    let dist = Math.sqrt((pacman.pixelX - centerX) ** 2 + (pacman.pixelY - centerY) ** 2);
    let canTurn = dist < 3.0; // Slightly increased tolerance

    // If opposite direction, turn immediately
    // 0: Right, 1: Down, 2: Left, 3: Up
    // Opposite if abs(diff) == 2
    if (Math.abs(pacman.dir - pacman.nextDir) === 2) {
        pacman.dir = pacman.nextDir;
    }
    // Else if turn, check alignment
    // Else if turn, check alignment
    else if (canTurn && pacman.nextDir !== pacman.dir) {
        let nextRow = Math.round(pacman.y) + DIRECTIONS[pacman.nextDir].y;
        let nextCol = Math.round(pacman.x) + DIRECTIONS[pacman.nextDir].x;

        // We allow turning even if it's a wall (to face it and stop)
        // But we MUST snap to center to align with the new axis

        // If it is a wall, we turn, snap, AND moving logic below will stop us.
        // If it is NOT a wall, we turn, snap, and continue.

        // Update: User said "mudar apenas a direção ... sem se mexer".
        // If we change 'dir', step 3 will calculate dx/dy for that new dir.
        // Step 4 will see the wall and stop us.

        pacman.dir = pacman.nextDir;
        pacman.pixelX = centerX;
        pacman.pixelY = centerY;
        pacman.x = Math.round(pacman.x);
        pacman.y = Math.round(pacman.y);
    }

    // 3. Move
    let dx = DIRECTIONS[pacman.dir].x * pacman.speed * TILE_SIZE;
    let dy = DIRECTIONS[pacman.dir].y * pacman.speed * TILE_SIZE;

    // Check Wall Ahead
    let aheadRow = Math.floor((pacman.pixelY + dy + TILE_SIZE / 2) / TILE_SIZE);
    let aheadCol = Math.floor((pacman.pixelX + dx + TILE_SIZE / 2) / TILE_SIZE);

    if (mapLayout[aheadRow] && mapLayout[aheadRow][aheadCol] === 0) {
        // Stop at wall
        // Snap to center
        let centerPixelX = pacman.x * TILE_SIZE;
        let centerPixelY = pacman.y * TILE_SIZE;
        // Slowly drift to center if simple stop
        if (Math.abs(pacman.pixelX - centerPixelX) > 1) pacman.pixelX += (centerPixelX - pacman.pixelX) * 0.5;
        if (Math.abs(pacman.pixelY - centerPixelY) > 1) pacman.pixelY += (centerPixelY - pacman.pixelY) * 0.5;
    } else {
        pacman.pixelX += dx;
        pacman.pixelY += dy;
    }

    // Update Grid Coords
    pacman.x = pacman.pixelX / TILE_SIZE;
    pacman.y = pacman.pixelY / TILE_SIZE;

    // Tunnel
    if (pacman.x < -0.5) { pacman.pixelX = (COL_COUNT - 0.5) * TILE_SIZE; }
    if (pacman.x >= COL_COUNT) { pacman.pixelX = -0.5 * TILE_SIZE; }

    // 4. Eat using Bounding Box Center
    // Center of Pacman (8x8 offset)
    let pmCenterX = pacman.pixelX + TILE_SIZE / 2;
    let pmCenterY = pacman.pixelY + TILE_SIZE / 2;

    // Which tile is this center point in?
    let tileCol = Math.floor(pmCenterX / TILE_SIZE);
    let tileRow = Math.floor(pmCenterY / TILE_SIZE);

    if (mapLayout[tileRow] && mapLayout[tileRow][tileCol] !== undefined) {
        if (mapLayout[tileRow][tileCol] === 1 || mapLayout[tileRow][tileCol] === 3) {
            mapLayout[tileRow][tileCol] = 2; // Eat
            score++;
            scoreElement.innerText = score;
            if (score % 10 === 0) triggerShake();
        }
    }
}

// -------------------------------------------------------------------------
// GHOST SYSTEM
// -------------------------------------------------------------------------

class Ghost {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.pixelX = x * TILE_SIZE;
        this.pixelY = y * TILE_SIZE;
        this.color = color;
        this.dir = 3; // Start moving Up to exit house
        this.speed = pacman.speed * 0.5; // Start slower
        this.moving = true;
    }

    update() {
        if (!gameActive) return;

        // Speed Progression
        // Speed up every 60 points until max speed (same as pacman)
        let speedIncrease = Math.floor(score / 60) * 0.02;
        let pSpeed = pacman.speed;
        this.speed = Math.min(pSpeed, (pSpeed * 0.5) + speedIncrease);

        // Movement Logic
        // 1. Check if centered to make decision
        let tileX = Math.round(this.x);
        let tileY = Math.round(this.y);
        let centerX = tileX * TILE_SIZE;
        let centerY = tileY * TILE_SIZE;
        let dist = Math.sqrt((this.pixelX - centerX) ** 2 + (this.pixelY - centerY) ** 2);

        if (dist < 1.5) { // At center of tile
            // Snap to center
            this.pixelX = centerX;
            this.pixelY = centerY;
            this.x = tileX;
            this.y = tileY;

            // Decide new direction
            this.chooseDirection();
        }

        // 2. Move
        let dx = DIRECTIONS[this.dir].x * this.speed * TILE_SIZE;
        let dy = DIRECTIONS[this.dir].y * this.speed * TILE_SIZE;

        this.pixelX += dx;
        this.pixelY += dy;

        // Update Grid
        this.x = this.pixelX / TILE_SIZE;
        this.y = this.pixelY / TILE_SIZE;

        // Wrap
        if (this.x < -0.5) { this.pixelX = (COL_COUNT - 0.5) * TILE_SIZE; }
        if (this.x >= COL_COUNT) { this.pixelX = -0.5 * TILE_SIZE; }
    }

    chooseDirection() {
        // Simple Random AI
        // Find all valid moves
        let validDirs = [];
        // Prevent immediate reverse unless stuck (which shouldn't happen often)
        let oppositeDir = (this.dir + 2) % 4;

        for (let i = 0; i < 4; i++) {
            if (i === oppositeDir) continue; // Try not to reverse

            let nextRow = Math.round(this.y) + DIRECTIONS[i].y;
            let nextCol = Math.round(this.x) + DIRECTIONS[i].x;

            if (mapLayout[nextRow] && mapLayout[nextRow][nextCol] !== 0) {
                validDirs.push(i);
            }
        }

        // If dead end or no valid non-reverse options, include reverse
        if (validDirs.length === 0) {
            validDirs.push(oppositeDir);
        }

        // Pick random
        let pick = Math.floor(Math.random() * validDirs.length);
        this.dir = validDirs[pick];
    }

    draw() {
        ctx.fillStyle = this.color;

        // Simple Ghost Shape (Circle top, rect bottom)
        let px = this.pixelX;
        let py = this.pixelY;

        ctx.beginPath();
        ctx.arc(px + TILE_SIZE / 2, py + TILE_SIZE / 2 - 2, TILE_SIZE / 2 - 2, Math.PI, 0);
        ctx.lineTo(px + TILE_SIZE - 2, py + TILE_SIZE - 1);
        ctx.lineTo(px + 2, py + TILE_SIZE - 1);
        ctx.fill();

        // Eyes
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(px + 5, py + 6, 2, 0, Math.PI * 2);
        ctx.arc(px + 11, py + 6, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "blue";
        ctx.beginPath();
        ctx.arc(px + 5, py + 6, 1, 0, Math.PI * 2);
        ctx.arc(px + 11, py + 6, 1, 0, Math.PI * 2);
        ctx.fill();
    }
}

let ghosts = [];
let gameActive = true;

function spawnGhost() {
    // Center box is roughly 13.5, 14
    // We spawn them at 13, 14 (inside the box)
    // Colors: Red, Pink, Cyan, Orange
    const colors = ["#FF0000", "#FFB8FF", "#00FFFF", "#FFB852"];
    let color = colors[ghosts.length % colors.length];

    // Spawn at center
    // Use integer coordinate to align with grid logic
    let g = new Ghost(14, 14, color);
    ghosts.push(g);
}

function checkCollisions() {
    // Box collision
    let hitDist = TILE_SIZE * 0.8;
    for (let g of ghosts) {
        let dist = Math.sqrt((pacman.pixelX - g.pixelX) ** 2 + (pacman.pixelY - g.pixelY) ** 2);
        if (dist < hitDist) {
            gameOver();
        }
    }
}

function gameOver() {
    gameActive = false;
    document.getElementById('game-over-overlay').classList.remove('hidden');
    document.getElementById('final-score').innerText = score;
}

// -------------------------------------------------------------------------
// GAME LOOP UPDATES
// -------------------------------------------------------------------------
// Update map openings for ghost house
// Row 11 is the roof wall. 
mapLayout[11][13] = 2; // Open roof
mapLayout[11][14] = 2; // Open roof

// Override update to include ghosts
const originalUpdate = update;
// We need to redefine update to be cleaner or just hook into it?
// Let's just append logic at end of update() by renaming standard update or just placing it inside loop.
// Actually, I'll just append this logic to the main Update function via replacement OR
// Since I can't easily replace the whole function again without context diffing large blocks,
// I will wrap the loop call.

// But wait, I'm replacing the end of the file. `initGame` calls `requestAnimationFrame(gameLoop)`.
// `gameLoop` calls `update` then `draw`.
// I can Redefine gameLoop here since javascript allows overwriting functions if not const.
// Or just let `initGame` run.

// Let's modify gameLoop to handle the new logic
function gameLoop() {
    if (!gameActive) return;

    update(); // Pacman update

    // Ghost Updates
    for (let g of ghosts) {
        g.update();
    }

    // Spawning Logic
    // Every 30 points.
    // We need to track if we already spawned for this chunk of 30.
    // score / 30 rounded down.
    let expectedGhosts = Math.floor(score / 30);
    if (ghosts.length < expectedGhosts) {
        spawnGhost();
    }

    checkCollisions();

    draw();

    // Draw Ghosts
    for (let g of ghosts) {
        g.draw();
    }

    requestAnimationFrame(gameLoop);
}

// Re-init to apply changes
// We need to reset ghosts if this script reruns?
ghosts = [];
// initGame called at bottom originally.
// We should probably rely on the existing initGame call at the very end of file.
// But the replace_content block ends at line 278, which cuts off the original initGame() call?
// Let's check the view...
// The file ended at line 278 with `initGame();` and empty lines.
// So I will just include initGame() at the end.

initGame();
