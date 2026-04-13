const GAME_CONFIG = {
    CANVAS_WIDTH: 800,
    CANVAS_HEIGHT: 720,
    GRID_SIZE: 40,
    COLS: 20,
    ROWS: 18,
    INITIAL_GOLD: 200,
    INITIAL_LIVES: 20,
    WAVE_DELAY: 5000,
    ENEMY_SPAWN_INTERVAL: 800,
    TOWER_RANGE_MULTIPLIER: 1.0,
    FPS_CAP: 60
};

const TILE_TYPES = {
    PATH: 0,
    BUILDABLE: 1,
    BLOCKED: 2,
    START: 3,
    END: 4
};

const PATH_MAP = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [3,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1],
    [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
    [1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,4,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,4,4,4,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,4,4,4,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,4,4,4,1,1,1,1,1,1,1,1,1,1,1]
];

const TOWER_DEFS = {
    laser: {
        name: '激光塔',
        cost: 50,
        damage: 15,
        range: 120,
        fireRate: 500,
        color: '#ff4444',
        projectileColor: '#ff6666',
        projectileSpeed: 12,
        description: '高射速，单体伤害',
        upgrades: [
            { cost: 40, damage: 22, range: 135, fireRate: 450 },
            { cost: 80, damage: 35, range: 150, fireRate: 350 }
        ]
    },
    missile: {
        name: '导弹塔',
        cost: 80,
        damage: 40,
        range: 150,
        fireRate: 1200,
        color: '#ff8800',
        projectileColor: '#ffaa33',
        projectileSpeed: 6,
        splashRadius: 50,
        description: '范围爆炸伤害',
        upgrades: [
            { cost: 60, damage: 60, range: 165, splashRadius: 60 },
            { cost: 120, damage: 90, range: 180, splashRadius: 75 }
        ]
    },
    frost: {
        name: '冰霜塔',
        cost: 60,
        damage: 8,
        range: 110,
        fireRate: 800,
        color: '#44aaff',
        projectileColor: '#88ccff',
        projectileSpeed: 8,
        slowFactor: 0.5,
        slowDuration: 2000,
        description: '减速敌人移动',
        upgrades: [
            { cost: 50, damage: 12, slowFactor: 0.4, slowDuration: 2500 },
            { cost: 100, damage: 18, slowFactor: 0.25, slowDuration: 3500 }
        ]
    },
    lightning: {
        name: '闪电塔',
        cost: 100,
        damage: 25,
        range: 130,
        fireRate: 900,
        color: '#aa44ff',
        projectileColor: '#cc88ff',
        chainCount: 3,
        chainDamageFactor: 0.6,
        description: '链式闪电攻击',
        upgrades: [
            { cost: 75, damage: 38, chainCount: 4, chainDamageFactor: 0.65 },
            { cost: 150, damage: 55, chainCount: 5, chainDamageFactor: 0.7 }
        ]
    },
    cannon: {
        name: '加农塔',
        cost: 120,
        damage: 70,
        range: 170,
        fireRate: 1800,
        color: '#44cc44',
        projectileColor: '#66ee66',
        projectileSpeed: 5,
        stunDuration: 500,
        description: '高伤害，击晕敌人',
        upgrades: [
            { cost: 90, damage: 110, range: 185, stunDuration: 750 },
            { cost: 180, damage: 160, range: 200, stunDuration: 1000 }
        ]
    }
};

const ENEMY_DEFS = {
    scout: {
        name: '侦察兵',
        health: 60,
        speed: 2.5,
        reward: 6,
        color: '#88cc88',
        size: 8,
        shape: 'circle'
    },
    soldier: {
        name: '步兵',
        health: 120,
        speed: 1.8,
        reward: 9,
        color: '#cc8844',
        size: 10,
        shape: 'circle'
    },
    tank: {
        name: '重甲兵',
        health: 300,
        speed: 1.0,
        reward: 18,
        color: '#888888',
        size: 14,
        shape: 'square'
    },
    speeder: {
        name: '疾速者',
        health: 75,
        speed: 3.5,
        reward: 12,
        color: '#ffcc00',
        size: 7,
        shape: 'diamond'
    },
    healer: {
        name: '治疗者',
        health: 150,
        speed: 1.5,
        reward: 15,
        color: '#ff88cc',
        size: 10,
        shape: 'circle',
        healRadius: 60,
        healAmount: 2,
        healInterval: 1000
    },
    boss: {
        name: 'BOSS',
        health: 1200,
        speed: 0.8,
        reward: 60,
        color: '#ff2222',
        size: 20,
        shape: 'hexagon'
    }
};

const WAVE_DEFS = [
    { enemies: [{ type: 'scout', count: 6 }] },
    { enemies: [{ type: 'scout', count: 8 }, { type: 'soldier', count: 3 }] },
    { enemies: [{ type: 'soldier', count: 8 }, { type: 'scout', count: 4 }] },
    { enemies: [{ type: 'soldier', count: 6 }, { type: 'tank', count: 2 }] },
    { enemies: [{ type: 'speeder', count: 10 }, { type: 'scout', count: 5 }] },
    { enemies: [{ type: 'tank', count: 4 }, { type: 'soldier', count: 6 }] },
    { enemies: [{ type: 'healer', count: 3 }, { type: 'soldier', count: 8 }] },
    { enemies: [{ type: 'speeder', count: 12 }, { type: 'tank', count: 3 }] },
    { enemies: [{ type: 'healer', count: 4 }, { type: 'tank', count: 4 }, { type: 'speeder', count: 6 }] },
    { enemies: [{ type: 'boss', count: 1 }, { type: 'soldier', count: 10 }] },
    { enemies: [{ type: 'scout', count: 15 }, { type: 'speeder', count: 10 }] },
    { enemies: [{ type: 'tank', count: 6 }, { type: 'healer', count: 4 }] },
    { enemies: [{ type: 'speeder', count: 15 }, { type: 'healer', count: 3 }, { type: 'tank', count: 3 }] },
    { enemies: [{ type: 'soldier', count: 15 }, { type: 'tank', count: 5 }, { type: 'healer', count: 3 }] },
    { enemies: [{ type: 'boss', count: 1 }, { type: 'tank', count: 4 }, { type: 'healer', count: 3 }] },
    { enemies: [{ type: 'speeder', count: 20 }, { type: 'tank', count: 6 }] },
    { enemies: [{ type: 'healer', count: 6 }, { type: 'tank', count: 6 }, { type: 'speeder', count: 8 }] },
    { enemies: [{ type: 'boss', count: 2 }, { type: 'soldier', count: 12 }] },
    { enemies: [{ type: 'tank', count: 8 }, { type: 'healer', count: 5 }, { type: 'speeder', count: 12 }] },
    { enemies: [{ type: 'boss', count: 3 }, { type: 'tank', count: 6 }, { type: 'healer', count: 5 }, { type: 'speeder', count: 10 }] }
];

class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    add(other) {
        return new Vector2(this.x + other.x, this.y + other.y);
    }

    subtract(other) {
        return new Vector2(this.x - other.x, this.y - other.y);
    }

    multiply(scalar) {
        return new Vector2(this.x * scalar, this.y * scalar);
    }

    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize() {
        const mag = this.magnitude();
        if (mag === 0) return new Vector2(0, 0);
        return new Vector2(this.x / mag, this.y / mag);
    }

    distanceTo(other) {
        return this.subtract(other).magnitude();
    }

    clone() {
        return new Vector2(this.x, this.y);
    }
}

class Particle {
    constructor(x, y, vx, vy, color, life, size) {
        this.position = new Vector2(x, y);
        this.velocity = new Vector2(vx, vy);
        this.color = color;
        this.life = life;
        this.maxLife = life;
        this.size = size;
        this.alive = true;
    }

    update(deltaTime) {
        this.position.x += this.velocity.x * deltaTime;
        this.position.y += this.velocity.y * deltaTime;
        this.velocity.x *= 0.98;
        this.velocity.y *= 0.98;
        this.life -= deltaTime;
        if (this.life <= 0) {
            this.alive = false;
        }
    }

    render(ctx) {
        const alpha = Math.max(0, this.life / this.maxLife);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.size * alpha, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

class ParticleSystem {
    constructor() {
        this.particles = [];
    }

    emit(x, y, color, count, spread, life, size) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * spread;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            const particleLife = life * (0.5 + Math.random() * 0.5);
            const particleSize = size * (0.5 + Math.random() * 0.5);
            this.particles.push(new Particle(x, y, vx, vy, color, particleLife, particleSize));
        }
    }

    emitExplosion(x, y, color, intensity) {
        this.emit(x, y, color, intensity * 3, intensity * 40, 0.8, 4);
        this.emit(x, y, '#ffffff', intensity, intensity * 20, 0.4, 2);
    }

    emitFrost(x, y) {
        this.emit(x, y, '#88ccff', 8, 30, 0.6, 3);
        this.emit(x, y, '#ffffff', 4, 20, 0.4, 2);
    }

    emitLightning(x, y) {
        this.emit(x, y, '#cc88ff', 6, 35, 0.5, 3);
        this.emit(x, y, '#ffffff', 3, 20, 0.3, 2);
    }

    emitStun(x, y) {
        this.emit(x, y, '#ffff00', 5, 25, 0.4, 2);
    }

    update(deltaTime) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].update(deltaTime);
            if (!this.particles[i].alive) {
                this.particles.splice(i, 1);
            }
        }
    }

    render(ctx) {
        this.particles.forEach(p => p.render(ctx));
    }

    clear() {
        this.particles = [];
    }
}

class AudioManager {
    constructor() {
        this.audioContext = null;
        this.sounds = new Map();
        this.laughterAudio = null;
        this.init();
        this.loadSounds();
    }

    init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Audio not supported:', e);
        }
    }

    loadSounds() {
        this.laughterAudio = new Audio('laughter.MP3');
        this.laughterAudio.preload = 'auto';
    }

    playLaughter() {
        if (this.laughterAudio) {
            this.laughterAudio.currentTime = 0;
            this.laughterAudio.play().catch(e => {
                console.log('Failed to play laughter:', e);
            });
        }
    }

    createTone(frequency, duration, type = 'sine', volume = 0.3) {
        if (!this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    playTowerPlace() {
        this.createTone(440, 0.1, 'sine', 0.4);
        setTimeout(() => this.createTone(523, 0.1, 'sine', 0.3), 50);
    }

    playTowerShoot(type) {
        switch (type) {
            case 'laser':
                this.createTone(880, 0.05, 'square', 0.2);
                break;
            case 'missile':
                this.createTone(220, 0.1, 'sawtooth', 0.3);
                break;
            case 'frost':
                this.createTone(660, 0.15, 'sine', 0.2);
                break;
            case 'lightning':
                this.createTone(1320, 0.1, 'square', 0.3);
                setTimeout(() => this.createTone(1760, 0.05, 'square', 0.2), 50);
                break;
            case 'cannon':
                this.createTone(110, 0.2, 'sawtooth', 0.4);
                break;
        }
    }

    playEnemyHit() {
        this.createTone(220, 0.05, 'square', 0.2);
    }

    playEnemyDie() {
        this.createTone(330, 0.1, 'triangle', 0.3);
        setTimeout(() => this.createTone(220, 0.1, 'triangle', 0.2), 50);
    }

    playTowerUpgrade() {
        this.createTone(523, 0.1, 'sine', 0.4);
        setTimeout(() => this.createTone(659, 0.1, 'sine', 0.3), 50);
        setTimeout(() => this.createTone(784, 0.1, 'sine', 0.2), 100);
    }

    playWaveStart() {
        this.createTone(262, 0.2, 'sine', 0.3);
        setTimeout(() => this.createTone(330, 0.2, 'sine', 0.3), 100);
        setTimeout(() => this.createTone(392, 0.2, 'sine', 0.3), 200);
    }

    playGameOver() {
        this.createTone(220, 0.5, 'triangle', 0.4);
        setTimeout(() => this.createTone(165, 0.5, 'triangle', 0.3), 250);
    }

    playGameWin() {
        this.createTone(392, 0.2, 'sine', 0.4);
        setTimeout(() => this.createTone(523, 0.2, 'sine', 0.4), 100);
        setTimeout(() => this.createTone(659, 0.2, 'sine', 0.4), 200);
        setTimeout(() => this.createTone(784, 0.3, 'sine', 0.5), 300);
    }
}

class PathFinder {
    constructor(map) {
        this.map = map;
        this.waypoints = [];
        this.pathCells = [];
        this.buildableCells = [];
        this.startPos = null;
        this.endPos = null;
        this.analyzeMap();
    }

    analyzeMap() {
        const endCells = [];
        
        for (let row = 0; row < this.map.length; row++) {
            for (let col = 0; col < this.map[row].length; col++) {
                const cellType = this.map[row][col];
                const worldX = col * GAME_CONFIG.GRID_SIZE + GAME_CONFIG.GRID_SIZE / 2;
                const worldY = row * GAME_CONFIG.GRID_SIZE + GAME_CONFIG.GRID_SIZE / 2;

                if (cellType === TILE_TYPES.START) {
                    this.startPos = new Vector2(worldX, worldY);
                    this.pathCells.push({ row, col, worldX, worldY });
                } else if (cellType === TILE_TYPES.END) {
                    endCells.push({ row, col, worldX, worldY });
                    this.pathCells.push({ row, col, worldX, worldY });
                } else if (cellType === TILE_TYPES.PATH) {
                    this.pathCells.push({ row, col, worldX, worldY });
                } else if (cellType === TILE_TYPES.BUILDABLE) {
                    this.buildableCells.push({ row, col, worldX, worldY });
                }
            }
        }
        
        if (endCells.length > 0) {
            const centerRow = endCells.reduce((sum, cell) => sum + cell.row, 0) / endCells.length;
            const centerCol = endCells.reduce((sum, cell) => sum + cell.col, 0) / endCells.length;
            this.endPos = new Vector2(
                centerCol * GAME_CONFIG.GRID_SIZE + GAME_CONFIG.GRID_SIZE / 2,
                centerRow * GAME_CONFIG.GRID_SIZE + GAME_CONFIG.GRID_SIZE / 2
            );
        }
        
        this.computeWaypoints();
    }

    computeWaypoints() {
        const visited = new Set();
        let current = this.startPos.clone();
        this.waypoints.push(current.clone());

        const startCell = this.getCellAt(current.x, current.y);
        if (!startCell) return;

        let currentRow = startCell.row;
        let currentCol = startCell.col;
        visited.add(`${currentRow},${currentCol}`);

        let maxIterations = this.pathCells.length + 10;
        let iterations = 0;

        while (iterations < maxIterations) {
            iterations++;
            const neighbors = this.getPathNeighbors(currentRow, currentCol);
            let foundNext = false;

            for (const neighbor of neighbors) {
                const key = `${neighbor.row},${neighbor.col}`;
                if (!visited.has(key)) {
                    visited.add(key);
                    currentRow = neighbor.row;
                    currentCol = neighbor.col;

                    const worldX = neighbor.col * GAME_CONFIG.GRID_SIZE + GAME_CONFIG.GRID_SIZE / 2;
                    const worldY = neighbor.row * GAME_CONFIG.GRID_SIZE + GAME_CONFIG.GRID_SIZE / 2;
                    this.waypoints.push(new Vector2(worldX, worldY));

                    if (this.map[neighbor.row][neighbor.col] === TILE_TYPES.END) {
                        return;
                    }
                    foundNext = true;
                    break;
                }
            }

            if (!foundNext) break;
        }
    }

    getPathNeighbors(row, col) {
        const directions = [
            { dr: -1, dc: 0 },
            { dr: 1, dc: 0 },
            { dr: 0, dc: -1 },
            { dr: 0, dc: 1 }
        ];
        const neighbors = [];
        for (const dir of directions) {
            const nr = row + dir.dr;
            const nc = col + dir.dc;
            if (nr >= 0 && nr < GAME_CONFIG.ROWS && nc >= 0 && nc < GAME_CONFIG.COLS) {
                const cellType = this.map[nr][nc];
                if (cellType === TILE_TYPES.PATH || cellType === TILE_TYPES.START || cellType === TILE_TYPES.END) {
                    neighbors.push({ row: nr, col: nc });
                }
            }
        }
        return neighbors;
    }

    getCellAt(worldX, worldY) {
        const col = Math.floor(worldX / GAME_CONFIG.GRID_SIZE);
        const row = Math.floor(worldY / GAME_CONFIG.GRID_SIZE);
        if (row >= 0 && row < GAME_CONFIG.ROWS && col >= 0 && col < GAME_CONFIG.COLS) {
            return { row, col, type: this.map[row][col] };
        }
        return null;
    }

    isBuildable(worldX, worldY) {
        const cell = this.getCellAt(worldX, worldY);
        if (!cell) return false;
        return cell.type === TILE_TYPES.BUILDABLE;
    }

    getGridPosition(worldX, worldY) {
        const col = Math.floor(worldX / GAME_CONFIG.GRID_SIZE);
        const row = Math.floor(worldY / GAME_CONFIG.GRID_SIZE);
        return { row, col };
    }

    getWorldCenter(row, col) {
        return new Vector2(
            col * GAME_CONFIG.GRID_SIZE + GAME_CONFIG.GRID_SIZE / 2,
            row * GAME_CONFIG.GRID_SIZE + GAME_CONFIG.GRID_SIZE / 2
        );
    }
}

class Enemy {
    constructor(type, waypoints, waveMultiplier) {
        const def = ENEMY_DEFS[type];
        this.type = type;
        this.name = def.name;
        this.maxHealth = Math.floor(def.health * waveMultiplier);
        this.health = this.maxHealth;
        this.baseSpeed = def.speed;
        this.speed = def.speed;
        this.reward = Math.floor(def.reward * waveMultiplier);
        this.color = def.color;
        this.size = def.size;
        this.shape = def.shape;
        this.waypoints = waypoints;
        this.currentWaypointIndex = 0;
        this.position = waypoints[0].clone();
        this.alive = true;
        this.reachedEnd = false;
        this.slowFactor = 1;
        this.slowTimer = 0;
        this.stunTimer = 0;
        this.healRadius = def.healRadius || 0;
        this.healAmount = def.healAmount || 0;
        this.healInterval = def.healInterval || 0;
        this.healTimer = 0;
        this.animationPhase = Math.random() * Math.PI * 2;
    }

    update(deltaTime, allEnemies) {
        if (!this.alive) return;

        if (this.stunTimer > 0) {
            this.stunTimer -= deltaTime * 1000;
            return;
        }

        if (this.slowTimer > 0) {
            this.slowTimer -= deltaTime * 1000;
            if (this.slowTimer <= 0) {
                this.slowFactor = 1;
            }
        }

        this.animationPhase += deltaTime * 3;

        if (this.healRadius > 0) {
            this.healTimer += deltaTime * 1000;
            if (this.healTimer >= this.healInterval) {
                this.healTimer = 0;
                this.healNearby(allEnemies);
            }
        }

        if (this.currentWaypointIndex >= this.waypoints.length) {
            this.alive = false;
            this.reachedEnd = true;
            return;
        }

        const target = this.waypoints[this.currentWaypointIndex];
        const direction = target.subtract(this.position).normalize();
        const moveSpeed = this.baseSpeed * this.slowFactor * 60;
        this.position.x += direction.x * moveSpeed * deltaTime;
        this.position.y += direction.y * moveSpeed * deltaTime;

        if (this.position.distanceTo(target) < 5) {
            this.currentWaypointIndex++;
        }
    }

    healNearby(allEnemies) {
        for (const enemy of allEnemies) {
            if (enemy === this || !enemy.alive) continue;
            const dist = this.position.distanceTo(enemy.position);
            if (dist <= this.healRadius) {
                enemy.health = Math.min(enemy.maxHealth, enemy.health + this.healAmount);
            }
        }
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.health = 0;
            this.alive = false;
        }
    }

    applySlow(factor, duration) {
        this.slowFactor = Math.min(this.slowFactor, factor);
        this.slowTimer = Math.max(this.slowTimer, duration);
    }

    applyStun(duration) {
        this.stunTimer = Math.max(this.stunTimer, duration);
    }

    render(ctx) {
        if (!this.alive) return;

        const x = this.position.x;
        const y = this.position.y;
        const s = this.size;

        ctx.fillStyle = this.color;
        if (this.stunTimer > 0) {
            ctx.fillStyle = '#ffff00';
        }

        if (this.shape === 'circle') {
            ctx.beginPath();
            ctx.arc(x, y, s, 0, Math.PI * 2);
            ctx.fill();
        } else if (this.shape === 'square') {
            ctx.fillRect(x - s, y - s, s * 2, s * 2);
        } else if (this.shape === 'diamond') {
            ctx.beginPath();
            ctx.moveTo(x, y - s);
            ctx.lineTo(x + s, y);
            ctx.lineTo(x, y + s);
            ctx.lineTo(x - s, y);
            ctx.closePath();
            ctx.fill();
        } else if (this.shape === 'hexagon') {
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                const angle = (Math.PI / 3) * i - Math.PI / 6;
                const hx = x + s * Math.cos(angle);
                const hy = y + s * Math.sin(angle);
                if (i === 0) ctx.moveTo(hx, hy);
                else ctx.lineTo(hx, hy);
            }
            ctx.closePath();
            ctx.fill();
        }

        if (this.slowFactor < 1) {
            ctx.strokeStyle = '#44aaff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(x, y, s + 3, 0, Math.PI * 2);
            ctx.stroke();
        }

        const healthBarWidth = s * 2.5;
        const healthBarHeight = 3;
        const healthBarX = x - healthBarWidth / 2;
        const healthBarY = y - s - 8;
        const healthPercent = this.health / this.maxHealth;

        ctx.fillStyle = '#333333';
        ctx.fillRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);

        let healthColor = '#44cc44';
        if (healthPercent < 0.3) healthColor = '#ff4444';
        else if (healthPercent < 0.6) healthColor = '#ffaa00';

        ctx.fillStyle = healthColor;
        ctx.fillRect(healthBarX, healthBarY, healthBarWidth * healthPercent, healthBarHeight);

        if (this.healRadius > 0) {
            ctx.strokeStyle = 'rgba(255, 136, 204, 0.2)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(x, y, this.healRadius, 0, Math.PI * 2);
            ctx.stroke();
        }
    }
}

class Projectile {
    constructor(x, y, target, damage, speed, color, type, specialData) {
        this.position = new Vector2(x, y);
        this.target = target;
        this.damage = damage;
        this.speed = speed;
        this.color = color;
        this.type = type;
        this.specialData = specialData || {};
        this.alive = true;
        this.trail = [];
        this.audioManager = new AudioManager();
    }

    update(deltaTime) {
        if (!this.alive) return;

        if (!this.target || !this.target.alive) {
            this.alive = false;
            return;
        }

        this.trail.push(this.position.clone());
        if (this.trail.length > 5) {
            this.trail.shift();
        }

        const direction = this.target.position.subtract(this.position).normalize();
        const moveSpeed = this.speed * 60;
        this.position.x += direction.x * moveSpeed * deltaTime;
        this.position.y += direction.y * moveSpeed * deltaTime;

        if (this.position.distanceTo(this.target.position) < 10) {
            this.hit();
        }
    }

    hit() {
        this.alive = false;
        this.target.takeDamage(this.damage);

        if (this.type === 'frost' && this.specialData.slowFactor) {
            this.target.applySlow(this.specialData.slowFactor, this.specialData.slowDuration);
        }
        if (this.type === 'cannon' && this.specialData.stunDuration) {
            this.target.applyStun(this.specialData.stunDuration);
        }
        this.audioManager.playEnemyHit();
    }

    render(ctx) {
        if (!this.alive) return;

        if (this.trail.length > 1) {
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 2;
            ctx.globalAlpha = 0.3;
            ctx.beginPath();
            ctx.moveTo(this.trail[0].x, this.trail[0].y);
            for (let i = 1; i < this.trail.length; i++) {
                ctx.lineTo(this.trail[i].x, this.trail[i].y);
            }
            ctx.lineTo(this.position.x, this.position.y);
            ctx.stroke();
            ctx.globalAlpha = 1;
        }

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, 2, 0, Math.PI * 2);
        ctx.fill();
    }
}

class Tower {
    constructor(type, gridRow, gridCol, worldX, worldY) {
        const def = TOWER_DEFS[type];
        this.type = type;
        this.name = def.name;
        this.gridRow = gridRow;
        this.gridCol = gridCol;
        this.position = new Vector2(worldX, worldY);
        this.damage = def.damage;
        this.range = def.range;
        this.fireRate = def.fireRate;
        this.color = def.color;
        this.projectileColor = def.projectileColor;
        this.projectileSpeed = def.projectileSpeed;
        this.level = 1;
        this.totalCost = def.cost;
        this.fireTimer = 0;
        this.target = null;
        this.angle = 0;
        this.splashRadius = def.splashRadius || 0;
        this.slowFactor = def.slowFactor || 0;
        this.slowDuration = def.slowDuration || 0;
        this.chainCount = def.chainCount || 0;
        this.chainDamageFactor = def.chainDamageFactor || 0;
        this.stunDuration = def.stunDuration || 0;
        this.kills = 0;
        this.totalDamage = 0;
        this.animationPhase = 0;
        this.audioManager = new AudioManager();
    }

    upgrade() {
        const def = TOWER_DEFS[this.type];
        if (this.level >= 3) return false;
        const upgradeData = def.upgrades[this.level - 1];
        if (!upgradeData) return false;
        this.level++;
        this.totalCost += upgradeData.cost;
        this.damage = upgradeData.damage || this.damage;
        this.range = upgradeData.range || this.range;
        this.fireRate = upgradeData.fireRate || this.fireRate;
        this.splashRadius = upgradeData.splashRadius || this.splashRadius;
        this.slowFactor = upgradeData.slowFactor || this.slowFactor;
        this.slowDuration = upgradeData.slowDuration || this.slowDuration;
        this.chainCount = upgradeData.chainCount || this.chainCount;
        this.chainDamageFactor = upgradeData.chainDamageFactor || this.chainDamageFactor;
        this.stunDuration = upgradeData.stunDuration || this.stunDuration;
        return true;
    }

    getUpgradeCost() {
        const def = TOWER_DEFS[this.type];
        if (this.level >= 3) return 0;
        return def.upgrades[this.level - 1].cost;
    }

    findTarget(enemies) {
        let closestEnemy = null;
        let closestDistance = Infinity;

        for (const enemy of enemies) {
            if (!enemy.alive) continue;
            const dist = this.position.distanceTo(enemy.position);
            if (dist <= this.range * GAME_CONFIG.TOWER_RANGE_MULTIPLIER) {
                if (dist < closestDistance) {
                    closestDistance = dist;
                    closestEnemy = enemy;
                }
            }
        }

        this.target = closestEnemy;
    }

    update(deltaTime, enemies, projectiles, particleSystem) {
        this.animationPhase += deltaTime * 2;
        this.fireTimer += deltaTime * 1000;

        this.findTarget(enemies);

        if (this.target) {
            this.angle = Math.atan2(
                this.target.position.y - this.position.y,
                this.target.position.x - this.position.x
            );
        }

        if (this.target && this.fireTimer >= this.fireRate) {
            this.fireTimer = 0;
            this.fire(projectiles, enemies, particleSystem);
        }
    }

    fire(projectiles, enemies, particleSystem) {
        if (!this.target || !this.target.alive) return;

        if (this.type === 'missile') {
            const proj = new Projectile(
                this.position.x, this.position.y,
                this.target, this.damage, this.projectileSpeed,
                this.projectileColor, 'missile',
                { splashRadius: this.splashRadius }
            );
            projectiles.push(proj);
        } else if (this.type === 'frost') {
            const proj = new Projectile(
                this.position.x, this.position.y,
                this.target, this.damage, this.projectileSpeed,
                this.projectileColor, 'frost',
                { slowFactor: this.slowFactor, slowDuration: this.slowDuration }
            );
            projectiles.push(proj);
        } else if (this.type === 'lightning') {
            this.fireLightning(enemies, particleSystem);
        } else if (this.type === 'cannon') {
            const proj = new Projectile(
                this.position.x, this.position.y,
                this.target, this.damage, this.projectileSpeed,
                this.projectileColor, 'cannon',
                { stunDuration: this.stunDuration }
            );
            projectiles.push(proj);
        } else {
            const proj = new Projectile(
                this.position.x, this.position.y,
                this.target, this.damage, this.projectileSpeed,
                this.projectileColor, 'laser', {}
            );
            projectiles.push(proj);
        }
        this.audioManager.playTowerShoot(this.type);
    }

    fireLightning(enemies, particleSystem) {
        let currentTarget = this.target;
        let currentDamage = this.damage;
        const hitEnemies = new Set();
        hitEnemies.add(currentTarget);

        currentTarget.takeDamage(currentDamage);
        this.totalDamage += currentDamage;
        particleSystem.emitLightning(currentTarget.position.x, currentTarget.position.y);

        for (let i = 0; i < this.chainCount; i++) {
            let nextTarget = null;
            let minDist = Infinity;

            for (const enemy of enemies) {
                if (!enemy.alive || hitEnemies.has(enemy)) continue;
                const dist = currentTarget.position.distanceTo(enemy.position);
                if (dist <= this.range * 0.8 && dist < minDist) {
                    minDist = dist;
                    nextTarget = enemy;
                }
            }

            if (!nextTarget) break;

            currentDamage *= this.chainDamageFactor;
            nextTarget.takeDamage(currentDamage);
            this.totalDamage += currentDamage;
            hitEnemies.add(nextTarget);
            particleSystem.emitLightning(nextTarget.position.x, nextTarget.position.y);
            currentTarget = nextTarget;
        }
    }

    render(ctx) {
        const x = this.position.x;
        const y = this.position.y;
        const size = GAME_CONFIG.GRID_SIZE * 0.35;

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(x, y, size + 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(x, y, size - 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(x, y, size - 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(this.angle);

        ctx.fillStyle = this.color;
        ctx.fillRect(0, -2, size + 8, 4);

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(size + 4, -3, 6, 6);

        ctx.restore();

        if (this.level >= 2) {
            ctx.strokeStyle = '#ffcc00';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(x, y, size + 5, 0, Math.PI * 2);
            ctx.stroke();
        }

        if (this.level >= 3) {
            ctx.strokeStyle = '#ff8800';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(x, y, size + 8, 0, Math.PI * 2);
            ctx.stroke();

            const starAngle = this.animationPhase;
            ctx.fillStyle = '#ffcc00';
            ctx.beginPath();
            ctx.arc(
                x + Math.cos(starAngle) * (size + 5),
                y + Math.sin(starAngle) * (size + 5),
                2, 0, Math.PI * 2
            );
            ctx.fill();
        }
    }

    renderRange(ctx) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.range * GAME_CONFIG.TOWER_RANGE_MULTIPLIER, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
    }
}

class WaveManager {
    constructor() {
        this.currentWave = 0;
        this.enemiesToSpawn = [];
        this.spawnTimer = 0;
        this.waveActive = false;
        this.allWavesComplete = false;
        this.spawnInterval = GAME_CONFIG.ENEMY_SPAWN_INTERVAL;
    }

    startWave(waveIndex) {
        if (waveIndex >= WAVE_DEFS.length) {
            this.allWavesComplete = true;
            return;
        }

        this.currentWave = waveIndex;
        this.waveActive = true;
        this.enemiesToSpawn = [];

        const waveDef = WAVE_DEFS[waveIndex];
        const waveMultiplier = 1 + waveIndex * 0.15;

        for (const group of waveDef.enemies) {
            for (let i = 0; i < group.count; i++) {
                this.enemiesToSpawn.push({ type: group.type, multiplier: waveMultiplier });
            }
        }

        this.shuffleSpawnOrder();
        this.spawnTimer = 0;
    }

    shuffleSpawnOrder() {
        for (let i = this.enemiesToSpawn.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.enemiesToSpawn[i], this.enemiesToSpawn[j]] = [this.enemiesToSpawn[j], this.enemiesToSpawn[i]];
        }
    }

    update(deltaTime, waypoints) {
        if (!this.waveActive || this.enemiesToSpawn.length === 0) return null;

        this.spawnTimer += deltaTime * 1000;
        if (this.spawnTimer >= this.spawnInterval) {
            this.spawnTimer = 0;
            const enemyData = this.enemiesToSpawn.shift();
            const enemy = new Enemy(enemyData.type, waypoints, enemyData.multiplier);
            if (this.enemiesToSpawn.length === 0) {
                this.waveActive = false;
            }
            return enemy;
        }
        return null;
    }

    isWaveComplete() {
        return !this.waveActive && this.enemiesToSpawn.length === 0;
    }

    getTotalWaves() {
        return WAVE_DEFS.length;
    }

    getRemainingCount() {
        return this.enemiesToSpawn.length;
    }
}

class GameRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.canvas.width = GAME_CONFIG.CANVAS_WIDTH;
        this.canvas.height = GAME_CONFIG.CANVAS_HEIGHT;
        this.gridHighlight = null;
        this.selectedTowerRange = null;
        this.protectedCharacterImage = null;
        this.loadImages();
    }

    loadImages() {
        this.protectedCharacterImage = new Image();
        this.protectedCharacterImage.src = 'images/protected_character.jpg';
        
        this.protectedCharacterImage.onerror = () => {
            console.error('Failed to load protected character image from images/protected_character.jpg');
        };
        
        this.protectedCharacterImage.onload = () => {
            console.log('Protected character image loaded successfully');
        };
    }

    clear() {
        this.ctx.fillStyle = '#1a1a2e';
        this.ctx.fillRect(0, 0, GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT);
    }

    renderMap(pathFinder) {
        const ctx = this.ctx;

        for (let row = 0; row < GAME_CONFIG.ROWS; row++) {
            for (let col = 0; col < GAME_CONFIG.COLS; col++) {
                const x = col * GAME_CONFIG.GRID_SIZE;
                const y = row * GAME_CONFIG.GRID_SIZE;
                const cellType = PATH_MAP[row][col];

                if (cellType === TILE_TYPES.PATH || cellType === TILE_TYPES.START || cellType === TILE_TYPES.END) {
                    ctx.fillStyle = '#16213e';
                    ctx.fillRect(x, y, GAME_CONFIG.GRID_SIZE, GAME_CONFIG.GRID_SIZE);

                    ctx.strokeStyle = '#0f3460';
                    ctx.lineWidth = 0.5;
                    ctx.strokeRect(x, y, GAME_CONFIG.GRID_SIZE, GAME_CONFIG.GRID_SIZE);
                } else if (cellType === TILE_TYPES.BUILDABLE) {
                    ctx.fillStyle = '#1a1a2e';
                    ctx.fillRect(x, y, GAME_CONFIG.GRID_SIZE, GAME_CONFIG.GRID_SIZE);

                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
                    ctx.lineWidth = 0.5;
                    ctx.strokeRect(x, y, GAME_CONFIG.GRID_SIZE, GAME_CONFIG.GRID_SIZE);
                } else {
                    ctx.fillStyle = '#0f0f23';
                    ctx.fillRect(x, y, GAME_CONFIG.GRID_SIZE, GAME_CONFIG.GRID_SIZE);
                }
            }
        }

        if (pathFinder.startPos) {
            ctx.fillStyle = '#44cc44';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('S', pathFinder.startPos.x, pathFinder.startPos.y);
        }

        if (pathFinder.endPos) {
            if (this.protectedCharacterImage && this.protectedCharacterImage.complete) {
                const size = GAME_CONFIG.GRID_SIZE * 3;
                const x = pathFinder.endPos.x - size / 2;
                const y = pathFinder.endPos.y - size / 2;
                ctx.drawImage(this.protectedCharacterImage, x, y, size, size);
            } else {
                ctx.fillStyle = '#ff4444';
                ctx.font = '16px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('E', pathFinder.endPos.x, pathFinder.endPos.y);
            }
        }
    }

    renderGridHighlight(pathFinder, mouseGridPos, canBuild, selectedTowerType) {
        if (!mouseGridPos) return;

        const ctx = this.ctx;
        const x = mouseGridPos.col * GAME_CONFIG.GRID_SIZE;
        const y = mouseGridPos.row * GAME_CONFIG.GRID_SIZE;

        if (canBuild && selectedTowerType) {
            ctx.fillStyle = 'rgba(68, 204, 68, 0.2)';
            ctx.fillRect(x, y, GAME_CONFIG.GRID_SIZE, GAME_CONFIG.GRID_SIZE);
            ctx.strokeStyle = 'rgba(68, 204, 68, 0.6)';
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, GAME_CONFIG.GRID_SIZE, GAME_CONFIG.GRID_SIZE);

            const towerDef = TOWER_DEFS[selectedTowerType];
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.lineWidth = 1;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            const centerX = x + GAME_CONFIG.GRID_SIZE / 2;
            const centerY = y + GAME_CONFIG.GRID_SIZE / 2;
            ctx.arc(centerX, centerY, towerDef.range * GAME_CONFIG.TOWER_RANGE_MULTIPLIER, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);
        } else if (canBuild) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.fillRect(x, y, GAME_CONFIG.GRID_SIZE, GAME_CONFIG.GRID_SIZE);
        } else {
            ctx.fillStyle = 'rgba(255, 68, 68, 0.2)';
            ctx.fillRect(x, y, GAME_CONFIG.GRID_SIZE, GAME_CONFIG.GRID_SIZE);
        }
    }

    renderEnemies(enemies) {
        for (const enemy of enemies) {
            enemy.render(this.ctx);
        }
    }

    renderTowers(towers) {
        for (const tower of towers) {
            tower.render(this.ctx);
        }
    }

    renderProjectiles(projectiles) {
        for (const proj of projectiles) {
            proj.render(this.ctx);
        }
    }

    renderParticles(particleSystem) {
        particleSystem.render(this.ctx);
    }

    renderSelectedTowerRange(tower) {
        if (tower) {
            tower.renderRange(this.ctx);
        }
    }

    renderHUD(gameState) {
        const ctx = this.ctx;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, GAME_CONFIG.CANVAS_WIDTH, 36);

        ctx.fillStyle = '#ffcc00';
        ctx.font = 'bold 14px "Outfit", sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(`💰 ${gameState.gold}`, 15, 18);

        ctx.fillStyle = '#ff4444';
        ctx.fillText(`❤️ ${gameState.lives}`, 120, 18);

        ctx.fillStyle = '#44aaff';
        ctx.fillText(`🌊 波次 ${gameState.wave + 1}/${WAVE_DEFS.length}`, 220, 18);

        ctx.fillStyle = '#cccccc';
        ctx.fillText(`⏱ ${gameState.speed}x`, 400, 18);

        if (gameState.waveActive) {
            ctx.fillStyle = '#ff8800';
            ctx.fillText(`剩余敌人: ${gameState.remainingEnemies}`, 480, 18);
        }

        if (gameState.paused) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(0, 36, GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT - 36);
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 36px "Outfit", sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('⏸ 暂停中', GAME_CONFIG.CANVAS_WIDTH / 2, GAME_CONFIG.CANVAS_HEIGHT / 2);
        }
    }

    renderGameOver(won) {
        const ctx = this.ctx;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT);

        ctx.fillStyle = won ? '#44cc44' : '#ff4444';
        ctx.font = 'bold 48px "Outfit", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(won ? '🎉 胜利!' : '💀 失败!', GAME_CONFIG.CANVAS_WIDTH / 2, GAME_CONFIG.CANVAS_HEIGHT / 2 - 30);

        ctx.fillStyle = '#ffffff';
        ctx.font = '20px "Outfit", sans-serif';
        ctx.fillText('点击重新开始', GAME_CONFIG.CANVAS_WIDTH / 2, GAME_CONFIG.CANVAS_HEIGHT / 2 + 30);
    }
}

class UIController {
    constructor() {
        this.towerButtons = {};
        this.selectedTowerType = null;
        this.selectedTower = null;
        this.onTowerSelect = null;
        this.onTowerPlace = null;
        this.onTowerUpgrade = null;
        this.onTowerSell = null;
        this.onStartWave = null;
        this.onPause = null;
        this.onSpeedChange = null;
        this.onRestart = null;
        this.buildUI();
    }

    buildUI() {
        const panel = document.getElementById('towerPanel');
        if (!panel) return;
        panel.innerHTML = '';

        const title = document.createElement('div');
        title.className = 'panel-title';
        title.textContent = '🛡️ 防御塔';
        panel.appendChild(title);

        const towerTypes = Object.keys(TOWER_DEFS);
        for (const type of towerTypes) {
            const def = TOWER_DEFS[type];
            const btn = document.createElement('div');
            btn.className = 'tower-btn';
            btn.dataset.type = type;
            btn.innerHTML = `
                <div class="tower-btn-icon" style="background:${def.color}"></div>
                <div class="tower-btn-info">
                    <div class="tower-btn-name">${def.name}</div>
                    <div class="tower-btn-cost">💰 ${def.cost}</div>
                </div>
                <div class="tower-btn-desc">${def.description}</div>
            `;
            btn.addEventListener('click', () => {
                this.selectTowerType(type);
            });
            panel.appendChild(btn);
            this.towerButtons[type] = btn;
        }

        const nextWaveBtn = document.getElementById('nextWaveBtn');
        if (nextWaveBtn) {
            nextWaveBtn.addEventListener('click', () => {
                if (this.onStartWave) this.onStartWave();
            });
        }

        const pauseBtn = document.getElementById('pauseBtn');
        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => {
                if (this.onPause) this.onPause();
            });
        }

        const speedBtn = document.getElementById('speedBtn');
        if (speedBtn) {
            speedBtn.addEventListener('click', () => {
                if (this.onSpeedChange) this.onSpeedChange();
            });
        }

        const restartBtn = document.getElementById('restartBtn');
        if (restartBtn) {
            restartBtn.addEventListener('click', () => {
                if (this.onRestart) this.onRestart();
            });
        }
    }

    selectTowerType(type) {
        if (this.selectedTowerType === type) {
            this.selectedTowerType = null;
            this.deselectAllTowerButtons();
            return;
        }

        this.selectedTowerType = type;
        this.selectedTower = null;
        this.deselectAllTowerButtons();

        if (this.towerButtons[type]) {
            this.towerButtons[type].classList.add('selected');
        }

        this.hideTowerInfo();
        if (this.onTowerSelect) this.onTowerSelect(type);
    }

    deselectAllTowerButtons() {
        Object.values(this.towerButtons).forEach(btn => btn.classList.remove('selected'));
    }

    clearSelection() {
        this.selectedTowerType = null;
        this.selectedTower = null;
        this.deselectAllTowerButtons();
        this.hideTowerInfo();
    }

    showTowerInfo(tower, gold) {
        const infoPanel = document.getElementById('towerInfo');
        if (!infoPanel) return;

        const upgradeCost = tower.getUpgradeCost();
        const sellValue = Math.floor(tower.totalCost * 0.5);
        const canUpgrade = tower.level < 3 && gold >= upgradeCost;

        infoPanel.innerHTML = `
            <div class="info-header">
                <div class="info-icon" style="background:${tower.color}"></div>
                <div class="info-name">${tower.name} Lv.${tower.level}</div>
            </div>
            <div class="info-stats">
                <div class="info-stat">伤害: ${tower.damage}</div>
                <div class="info-stat">范围: ${tower.range}</div>
                <div class="info-stat">射速: ${(1000 / tower.fireRate).toFixed(1)}/s</div>
                <div class="info-stat">击杀: ${tower.kills}</div>
            </div>
            <div class="info-actions">
                ${tower.level < 3 ? `<button class="upgrade-btn ${canUpgrade ? '' : 'disabled'}" id="upgradeBtn">⬆ 升级 💰${upgradeCost}</button>` : '<div class="max-level">✨ 已满级</div>'}
                <button class="sell-btn" id="sellBtn">� 铲除 💰${sellValue}</button>
            </div>
        `;
        infoPanel.style.display = 'block';

        const upgradeBtn = document.getElementById('upgradeBtn');
        if (upgradeBtn && canUpgrade) {
            upgradeBtn.addEventListener('click', () => {
                if (this.onTowerUpgrade) this.onTowerUpgrade(tower);
            });
        }

        const sellBtn = document.getElementById('sellBtn');
        if (sellBtn) {
            sellBtn.addEventListener('click', () => {
                if (this.onTowerSell) this.onTowerSell(tower);
            });
        }
    }

    hideTowerInfo() {
        const infoPanel = document.getElementById('towerInfo');
        if (infoPanel) {
            infoPanel.style.display = 'none';
        }
    }

    updateGoldDisplay(gold) {
        const goldDisplay = document.getElementById('goldDisplay');
        if (goldDisplay) {
            goldDisplay.textContent = `💰 ${gold}`;
        }

        Object.keys(TOWER_DEFS).forEach(type => {
            const btn = this.towerButtons[type];
            if (btn) {
                if (gold < TOWER_DEFS[type].cost) {
                    btn.classList.add('disabled');
                } else {
                    btn.classList.remove('disabled');
                }
            }
        });
    }

    updateWaveButton(canStart) {
        const waveBtn = document.getElementById('waveBtn');
        if (waveBtn) {
            waveBtn.disabled = !canStart;
            waveBtn.classList.toggle('disabled', !canStart);
        }
    }

    updateLivesDisplay(lives) {
        const livesDisplay = document.getElementById('livesDisplay');
        if (livesDisplay) {
            livesDisplay.textContent = `❤️ ${lives}`;
        }
    }

    updateWaveDisplay(wave, total) {
        const waveDisplay = document.getElementById('waveDisplay');
        if (waveDisplay) {
            waveDisplay.textContent = `🌊 ${wave + 1}/${total}`;
        }
    }
}

class Game {
    constructor() {
        this.canvas = null;
        this.renderer = null;
        this.pathFinder = null;
        this.waveManager = null;
        this.particleSystem = null;
        this.audioManager = null;
        this.uiController = null;
        this.enemies = [];
        this.towers = [];
        this.projectiles = [];
        this.gold = GAME_CONFIG.INITIAL_GOLD;
        this.lives = GAME_CONFIG.INITIAL_LIVES;
        this.wave = 0;
        this.score = 0;
        this.paused = false;
        this.gameOver = false;
        this.gameWon = false;
        this.speed = 1;
        this.lastTime = 0;
        this.running = false;
        this.mousePos = new Vector2(0, 0);
        this.mouseGridPos = null;
        this.canBuildAtMouse = false;
        this.occupiedCells = new Set();
        this.animationFrameId = null;
    }

    init() {
        this.canvas = document.getElementById('gameCanvas');
        if (!this.canvas) return;

        this.renderer = new GameRenderer(this.canvas);
        this.pathFinder = new PathFinder(PATH_MAP);
        this.waveManager = new WaveManager();
        this.particleSystem = new ParticleSystem();
        this.audioManager = new AudioManager();
        this.uiController = new UIController();

        this.setupCallbacks();
        this.setupCanvasEvents();
        this.setupKeyboardEvents();

        this.uiController.updateGoldDisplay(this.gold);
        this.uiController.updateLivesDisplay(this.lives);
        this.uiController.updateWaveDisplay(this.wave, WAVE_DEFS.length);
        this.uiController.updateWaveButton(true);
    }

    setupCallbacks() {
        this.uiController.onTowerSelect = (type) => {
            this.uiController.hideTowerInfo();
        };

        this.uiController.onTowerPlace = (type, row, col) => {
            this.placeTower(type, row, col);
        };

        this.uiController.onTowerUpgrade = (tower) => {
            this.upgradeTower(tower);
        };

        this.uiController.onTowerSell = (tower) => {
            this.sellTower(tower);
        };

        this.uiController.onStartWave = () => {
            this.startWave();
        };

        this.uiController.onPause = () => {
            this.togglePause();
        };

        this.uiController.onSpeedChange = () => {
            this.toggleSpeed();
        };

        this.uiController.onRestart = () => {
            this.restart();
        };
    }

    setupCanvasEvents() {
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const scaleX = GAME_CONFIG.CANVAS_WIDTH / rect.width;
            const scaleY = GAME_CONFIG.CANVAS_HEIGHT / rect.height;
            this.mousePos.x = (e.clientX - rect.left) * scaleX;
            this.mousePos.y = (e.clientY - rect.top) * scaleY;

            const gridPos = this.pathFinder.getGridPosition(this.mousePos.x, this.mousePos.y);
            this.mouseGridPos = gridPos;

            const cellKey = `${gridPos.row},${gridPos.col}`;
            this.canBuildAtMouse = this.pathFinder.isBuildable(this.mousePos.x, this.mousePos.y)
                && !this.occupiedCells.has(cellKey);
        });

        this.canvas.addEventListener('click', (e) => {
            if (this.gameOver) {
                this.restart();
                return;
            }

            const rect = this.canvas.getBoundingClientRect();
            const scaleX = GAME_CONFIG.CANVAS_WIDTH / rect.width;
            const scaleY = GAME_CONFIG.CANVAS_HEIGHT / rect.height;
            const clickX = (e.clientX - rect.left) * scaleX;
            const clickY = (e.clientY - rect.top) * scaleY;

            if (this.uiController.selectedTowerType) {
                const gridPos = this.pathFinder.getGridPosition(clickX, clickY);
                const cellKey = `${gridPos.row},${gridPos.col}`;
                const canBuild = this.pathFinder.isBuildable(clickX, clickY)
                    && !this.occupiedCells.has(cellKey);

                if (canBuild) {
                    this.placeTower(this.uiController.selectedTowerType, gridPos.row, gridPos.col);
                }
            } else {
                this.handleTowerClick(clickX, clickY);
            }
        });

        this.canvas.addEventListener('mouseleave', () => {
            this.mouseGridPos = null;
        });

        this.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.uiController.clearSelection();
        });
    }

    setupKeyboardEvents() {
        document.addEventListener('keydown', (e) => {
            if (!this.running) return;

            switch (e.key) {
                case '1': this.uiController.selectTowerType('laser'); break;
                case '2': this.uiController.selectTowerType('missile'); break;
                case '3': this.uiController.selectTowerType('frost'); break;
                case '4': this.uiController.selectTowerType('lightning'); break;
                case '5': this.uiController.selectTowerType('cannon'); break;
                case ' ':
                    e.preventDefault();
                    this.togglePause();
                    break;
                case 'Escape':
                    this.uiController.clearSelection();
                    break;
                case 'n':
                case 'N':
                    if (!this.waveManager.waveActive && !this.gameOver) {
                        this.startWave();
                    }
                    break;
                case 's':
                case 'S':
                    this.toggleSpeed();
                    break;
            }
        });
    }

    handleTowerClick(x, y) {
        for (const tower of this.towers) {
            const dist = tower.position.distanceTo(new Vector2(x, y));
            if (dist < GAME_CONFIG.GRID_SIZE * 0.6) {
                this.uiController.selectedTower = tower;
                this.uiController.showTowerInfo(tower, this.gold);
                return;
            }
        }
        this.uiController.hideTowerInfo();
        this.uiController.selectedTower = null;
    }

    placeTower(type, row, col) {
        const def = TOWER_DEFS[type];
        if (this.gold < def.cost) return;

        const cellKey = `${row},${col}`;
        if (this.occupiedCells.has(cellKey)) return;

        const worldPos = this.pathFinder.getWorldCenter(row, col);
        const tower = new Tower(type, row, col, worldPos.x, worldPos.y);
        this.towers.push(tower);
        this.occupiedCells.add(cellKey);
        this.gold -= def.cost;

        this.uiController.updateGoldDisplay(this.gold);
        this.particleSystem.emit(worldPos.x, worldPos.y, def.color, 10, 30, 0.5, 3);
        this.audioManager.playTowerPlace();
    }

    upgradeTower(tower) {
        const cost = tower.getUpgradeCost();
        if (this.gold < cost || tower.level >= 3) return;

        this.gold -= cost;
        tower.upgrade();

        this.uiController.updateGoldDisplay(this.gold);
        this.uiController.showTowerInfo(tower, this.gold);
        this.particleSystem.emit(tower.position.x, tower.position.y, '#ffcc00', 15, 40, 0.6, 3);
        this.audioManager.playTowerUpgrade();
    }

    sellTower(tower) {
        const sellValue = Math.floor(tower.totalCost * 0.5);
        this.gold += sellValue;

        const cellKey = `${tower.gridRow},${tower.gridCol}`;
        this.occupiedCells.delete(cellKey);

        const index = this.towers.indexOf(tower);
        if (index > -1) {
            this.towers.splice(index, 1);
        }

        this.uiController.updateGoldDisplay(this.gold);
        this.uiController.hideTowerInfo();
        this.particleSystem.emit(tower.position.x, tower.position.y, '#ffcc00', 10, 30, 0.5, 2);
    }

    startWave() {
        if (this.waveManager.waveActive || this.gameOver) return;
        if (this.wave >= WAVE_DEFS.length) return;

        this.waveManager.startWave(this.wave);
        this.wave++;
        this.uiController.updateWaveDisplay(this.wave - 1, WAVE_DEFS.length);
        this.uiController.updateWaveButton(false);
        this.audioManager.playWaveStart();
        this.audioManager.playLaughter();
    }

    togglePause() {
        if (this.gameOver) return;
        this.paused = !this.paused;
        const pauseBtn = document.getElementById('pauseBtn');
        if (pauseBtn) {
            pauseBtn.textContent = this.paused ? '▶ 继续' : '⏸ 暂停';
        }
    }

    toggleSpeed() {
        if (this.speed === 1) {
            this.speed = 2;
        } else if (this.speed === 2) {
            this.speed = 3;
        } else {
            this.speed = 1;
        }
        const speedBtn = document.getElementById('speedBtn');
        if (speedBtn) {
            speedBtn.textContent = `⏱ ${this.speed}x`;
        }
    }

    restart() {
        this.enemies = [];
        this.towers = [];
        this.projectiles = [];
        this.gold = GAME_CONFIG.INITIAL_GOLD;
        this.lives = GAME_CONFIG.INITIAL_LIVES;
        this.wave = 0;
        this.score = 0;
        this.paused = false;
        this.gameOver = false;
        this.gameWon = false;
        this.speed = 1;
        this.occupiedCells.clear();
        this.waveManager = new WaveManager();
        this.particleSystem.clear();
        this.uiController.clearSelection();
        this.uiController.updateGoldDisplay(this.gold);
        this.uiController.updateLivesDisplay(this.lives);
        this.uiController.updateWaveDisplay(this.wave, WAVE_DEFS.length);
        this.uiController.updateWaveButton(true);

        const pauseBtn = document.getElementById('pauseBtn');
        if (pauseBtn) pauseBtn.textContent = '⏸ 暂停';
        const speedBtn = document.getElementById('speedBtn');
        if (speedBtn) speedBtn.textContent = '⏱ 1x';
    }

    start() {
        this.running = true;
        this.lastTime = performance.now();
        this.gameLoop(this.lastTime);
    }

    stop() {
        this.running = false;
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    gameLoop(currentTime) {
        if (!this.running) return;

        const rawDelta = (currentTime - this.lastTime) / 1000;
        const deltaTime = Math.min(rawDelta, 0.1) * this.speed;
        this.lastTime = currentTime;

        if (!this.paused && !this.gameOver) {
            this.update(deltaTime);
        }

        this.render();
        this.animationFrameId = requestAnimationFrame((t) => this.gameLoop(t));
    }

    update(deltaTime) {
        const newEnemy = this.waveManager.update(deltaTime, this.pathFinder.waypoints);
        if (newEnemy) {
            this.enemies.push(newEnemy);
        }

        for (const enemy of this.enemies) {
            enemy.update(deltaTime, this.enemies);
        }

        for (const tower of this.towers) {
            tower.update(deltaTime, this.enemies, this.projectiles, this.particleSystem);
        }

        for (const proj of this.projectiles) {
            proj.update(deltaTime);
        }

        this.handleProjectileHits();
        this.checkEnemyStatus();
        this.particleSystem.update(deltaTime);
        this.checkWaveCompletion();
        this.checkGameOver();
    }

    handleProjectileHits() {
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const proj = this.projectiles[i];
            if (!proj.alive) {
                if (proj.type === 'missile' && proj.target) {
                    this.handleSplashDamage(proj);
                }
                this.projectiles.splice(i, 1);
            }
        }
    }

    handleSplashDamage(proj) {
        const splashPos = proj.target.alive ? proj.target.position : proj.position;
        const splashRadius = proj.specialData.splashRadius || 0;

        if (splashRadius > 0) {
            this.particleSystem.emitExplosion(splashPos.x, splashPos.y, '#ff8800', 2);

            for (const enemy of this.enemies) {
                if (!enemy.alive) continue;
                const dist = splashPos.distanceTo(enemy.position);
                if (dist <= splashRadius && enemy !== proj.target) {
                    const damageFactor = 1 - (dist / splashRadius) * 0.5;
                    enemy.takeDamage(Math.floor(proj.damage * damageFactor));
                }
            }
        }
    }

    checkEnemyStatus() {
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];

            if (!enemy.alive) {
                if (enemy.reachedEnd) {
                    this.lives--;
                    this.uiController.updateLivesDisplay(this.lives);
                    this.particleSystem.emit(enemy.position.x, enemy.position.y, '#ff4444', 8, 25, 0.5, 2);
                } else {
                    this.gold += enemy.reward;
                    this.score += enemy.reward;
                    this.uiController.updateGoldDisplay(this.gold);
                    this.particleSystem.emitExplosion(enemy.position.x, enemy.position.y, enemy.color, 1.5);
                    this.addKillToTower(enemy);
                    this.audioManager.playEnemyDie();
                }
                this.enemies.splice(i, 1);
            }
        }
    }

    addKillToTower(deadEnemy) {
        for (const tower of this.towers) {
            if (tower.target === deadEnemy) {
                tower.kills++;
                tower.target = null;
                break;
            }
        }
    }

    checkWaveCompletion() {
        if (this.waveManager.isWaveComplete() && this.enemies.length === 0) {
            this.uiController.updateWaveDisplay(this.wave - 1, WAVE_DEFS.length);
            this.uiController.updateWaveButton(true);

            if (this.wave >= WAVE_DEFS.length) {
                this.gameWon = true;
                this.gameOver = true;
                this.audioManager.playGameWin();
            }
        }
    }

    checkGameOver() {
        if (this.lives <= 0) {
            this.lives = 0;
            this.gameOver = true;
            this.gameWon = false;
            this.uiController.updateLivesDisplay(0);
            this.audioManager.playGameOver();
        }
    }

    render() {
        this.renderer.clear();
        this.renderer.renderMap(this.pathFinder);

        if (this.mouseGridPos && this.uiController.selectedTowerType) {
            this.renderer.renderGridHighlight(
                this.pathFinder,
                this.mouseGridPos,
                this.canBuildAtMouse,
                this.uiController.selectedTowerType
            );
        }

        if (this.uiController.selectedTower) {
            this.renderer.renderSelectedTowerRange(this.uiController.selectedTower);
        }

        this.renderer.renderEnemies(this.enemies);
        this.renderer.renderTowers(this.towers);
        this.renderer.renderProjectiles(this.projectiles);
        this.renderer.renderParticles(this.particleSystem);
        this.renderer.renderHUD({
            gold: this.gold,
            lives: this.lives,
            wave: this.wave,
            speed: this.speed,
            paused: this.paused,
            waveActive: this.waveManager.waveActive,
            remainingEnemies: this.enemies.length + this.waveManager.getRemainingCount()
        });

        if (this.gameOver) {
            this.renderer.renderGameOver(this.gameWon);
        }
    }
}

let gameInstance = null;

function scrollToGame() {
    const gameSection = document.getElementById('gameSection');
    if (gameSection) {
        gameSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        if (!gameInstance) {
            gameInstance = new Game();
            gameInstance.init();
        }
        
        if (!gameInstance.gameRunning) {
            gameInstance.start();
        }
    }
}

function openGame() {
    scrollToGame();
}

function closeGame() {
    if (gameInstance) {
        gameInstance.stop();
    }
}
