const canvas = document.getElementById("scene");
const ctx = canvas.getContext("2d");
const trailCanvas = document.createElement("canvas");
const trailCtx = trailCanvas.getContext("2d");
const speedReadout = document.getElementById("speedReadout");
const resetBtn = document.getElementById("resetBtn");

const state = {
    dpr: 1,
    width: 1,
    height: 1,
    halfW: 0,
    halfH: 0,
    focal: 700,
    time: 0,
    speed: 150,
    targetSpeed: 150,
    minSpeed: 40,
    maxSpeed: 560,
    yaw: 0,
    pitch: 0,
    roll: 0,
    targetYaw: 0,
    targetPitch: 0,
    targetRoll: 0,
    wanderPhaseA: Math.random() * Math.PI * 2,
    wanderPhaseB: Math.random() * Math.PI * 2,
    wanderPhaseC: Math.random() * Math.PI * 2,
    backdropStars: [],
    nebulae: [],
    stars: []
};

const STAR_COUNT = 1700;
const STAR_SPAWN_Z = 2600;
const STAR_KILL_Z = -80;
const STAR_RADIUS = 1300;

function rand(min, max) {
    return min + Math.random() * (max - min);
}

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function spawnStar(star, z) {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.sqrt(Math.random()) * STAR_RADIUS;
    star.x = Math.cos(angle) * radius;
    star.y = Math.sin(angle) * radius;
    star.z = z;
    star.size = rand(0.6, 2.6);
    star.temp = rand(0.5, 1);
    star.prevX = null;
    star.prevY = null;
    star.alpha = rand(0.3, 1);
}

function buildStars() {
    state.stars.length = 0;
    for (let i = 0; i < STAR_COUNT; i += 1) {
        const star = { x: 0, y: 0, z: 0, size: 1, temp: 1, prevX: null, prevY: null, alpha: 1 };
        spawnStar(star, rand(20, STAR_SPAWN_Z));
        state.stars.push(star);
    }
}

function buildBackdrop() {
    state.backdropStars.length = 0;
    state.nebulae.length = 0;

    const bgCount = Math.floor((state.width * state.height) / 1500);
    for (let i = 0; i < bgCount; i += 1) {
        state.backdropStars.push({
            x: Math.random(),
            y: Math.random(),
            size: rand(0.35, 1.6),
            alpha: rand(0.12, 0.85),
            hue: rand(190, 235),
            twinkle: rand(0, Math.PI * 2)
        });
    }

    for (let i = 0; i < 7; i += 1) {
        state.nebulae.push({
            x: rand(0.08, 0.92),
            y: rand(0.08, 0.92),
            radius: rand(Math.min(state.width, state.height) * 0.2, Math.min(state.width, state.height) * 0.5),
            hue: rand(198, 244),
            alpha: rand(0.03, 0.08),
            drift: rand(0, Math.PI * 2)
        });
    }
}

function resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    state.dpr = window.devicePixelRatio || 1;

    canvas.width = w * state.dpr;
    canvas.height = h * state.dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);

    trailCanvas.width = w * state.dpr;
    trailCanvas.height = h * state.dpr;
    trailCtx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
    trailCtx.clearRect(0, 0, w, h);

    state.width = w;
    state.height = h;
    state.halfW = w * 0.5;
    state.halfH = h * 0.5;
    state.focal = Math.max(520, Math.min(1000, w * 0.78));
    buildBackdrop();
}

function rotatePoint(x, y, z) {
    const cy = Math.cos(state.yaw);
    const sy = Math.sin(state.yaw);
    const cp = Math.cos(state.pitch);
    const sp = Math.sin(state.pitch);
    const cr = Math.cos(state.roll);
    const sr = Math.sin(state.roll);

    let rx = x * cy - z * sy;
    let rz = x * sy + z * cy;
    let ry = y;

    const py = ry * cp - rz * sp;
    const pz = ry * sp + rz * cp;
    ry = py;
    rz = pz;

    const qx = rx * cr - ry * sr;
    const qy = rx * sr + ry * cr;

    return { x: qx, y: qy, z: rz };
}

function updateAutopilot(dt) {
    const t = state.time;
    const yawWave = Math.sin(t * 0.14 + state.wanderPhaseA) * 0.55 + Math.sin(t * 0.037 + state.wanderPhaseB) * 0.25;
    const pitchWave = Math.sin(t * 0.11 + state.wanderPhaseB) * 0.26 + Math.cos(t * 0.053 + state.wanderPhaseC) * 0.12;
    const rollWave = Math.sin(t * 0.09 + state.wanderPhaseC) * 0.42 + Math.cos(t * 0.04 + state.wanderPhaseA) * 0.18;
    const speedWave = 180 + Math.sin(t * 0.17 + state.wanderPhaseA) * 70 + Math.cos(t * 0.06 + state.wanderPhaseB) * 40;

    state.targetYaw = clamp(yawWave, -0.95, 0.95);
    state.targetPitch = clamp(pitchWave, -0.55, 0.55);
    state.targetRoll = clamp(rollWave, -0.9, 0.9);
    state.targetSpeed = clamp(speedWave, state.minSpeed, state.maxSpeed);

    state.speed = lerp(state.speed, state.targetSpeed, 0.03 + dt * 0.4);
    state.yaw = lerp(state.yaw, state.targetYaw, 0.03 + dt * 0.75);
    state.pitch = lerp(state.pitch, state.targetPitch, 0.03 + dt * 0.75);
    state.roll = lerp(state.roll, state.targetRoll, 0.03 + dt * 0.7);
}

function drawBackground() {
    const grad = ctx.createLinearGradient(0, 0, 0, state.height);
    grad.addColorStop(0, "#0b1123");
    grad.addColorStop(0.4, "#080d1a");
    grad.addColorStop(0.78, "#04070f");
    grad.addColorStop(1, "#020309");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, state.width, state.height);

    ctx.save();
    ctx.translate(state.halfW + state.yaw * 70, state.halfH + state.pitch * 50);
    ctx.rotate(-0.35 + state.roll * 0.08);
    const band = ctx.createLinearGradient(0, -state.height * 0.34, 0, state.height * 0.34);
    band.addColorStop(0, "rgba(0, 0, 0, 0)");
    band.addColorStop(0.42, "rgba(120, 160, 235, 0.06)");
    band.addColorStop(0.5, "rgba(170, 206, 255, 0.12)");
    band.addColorStop(0.58, "rgba(120, 160, 235, 0.06)");
    band.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = band;
    ctx.fillRect(-state.width * 0.85, -state.height * 0.45, state.width * 1.7, state.height * 0.9);
    ctx.restore();

    for (let i = 0; i < state.backdropStars.length; i += 1) {
        const s = state.backdropStars[i];
        const tw = 0.6 + Math.sin(state.time * 0.35 + s.twinkle) * 0.4;
        const sx = s.x * state.width + state.yaw * 26;
        const sy = s.y * state.height + state.pitch * 20;
        const light = 68 + tw * 20;
        ctx.globalAlpha = s.alpha * (0.35 + tw * 0.65);
        ctx.fillStyle = `hsla(${s.hue}, 75%, ${light}%, 0.95)`;
        ctx.beginPath();
        ctx.arc(sx, sy, Math.max(0.3, s.size * 0.7), 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.globalAlpha = 1;

    const vignette = ctx.createRadialGradient(
        state.halfW,
        state.halfH,
        Math.min(state.width, state.height) * 0.18,
        state.halfW,
        state.halfH,
        Math.max(state.width, state.height) * 0.8
    );
    vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
    vignette.addColorStop(1, "rgba(0, 0, 0, 0.58)");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, state.width, state.height);
}

function drawStars(dt) {
    const persistence = clamp((state.speed - 70) / 520, 0, 1);
    trailCtx.globalCompositeOperation = "source-over";
    const fadeAlpha = 0.05 + (0.15 - persistence * 0.08); // tweak values
    trailCtx.fillStyle = `rgba(2, 4, 10, ${fadeAlpha})`;
    trailCtx.fillRect(0, 0, state.width, state.height);

    ctx.globalCompositeOperation = "screen";

    for (let i = 0; i < state.stars.length; i += 1) {
        const star = state.stars[i];
        star.z -= state.speed * dt;

        if (star.z < STAR_KILL_Z) {
            spawnStar(star, STAR_SPAWN_Z + rand(0, 200));
            continue;
        }

        const p = rotatePoint(star.x, star.y, star.z);
        if (p.z <= 2) {
            spawnStar(star, STAR_SPAWN_Z + rand(0, 200));
            continue;
        }

        const perspective = state.focal / p.z;
        const sx = state.halfW + p.x * perspective;
        const sy = state.halfH + p.y * perspective;

        if (sx < -100 || sx > state.width + 100 || sy < -100 || sy > state.height + 100) {
            spawnStar(star, STAR_SPAWN_Z + rand(0, 200));
            continue;
        }

        const brightness = clamp((STAR_SPAWN_Z - star.z) / STAR_SPAWN_Z, 0.1, 1);
        const radius = star.size * (0.3 + perspective * 1.25);

        const starLight = 72 + brightness * 24;
        ctx.globalAlpha = (0.12 + brightness * 0.75) * star.alpha;
        ctx.fillStyle = `hsla(${205 + star.temp * 28}, 85%, ${starLight}%, 0.95)`;

        ctx.beginPath();
        ctx.arc(sx, sy, Math.max(0.5, radius), 0, Math.PI * 2);
        ctx.fill();

        trailCtx.globalCompositeOperation = "screen";
        trailCtx.globalAlpha = (0.14 + brightness * 0.45) * star.alpha;
        trailCtx.fillStyle = `hsla(${205 + star.temp * 28}, 85%, ${starLight}%, 0.95)`;

        if (star.prevX !== null && star.prevY !== null) {
            trailCtx.strokeStyle = `hsla(${205 + star.temp * 28}, 100%, ${starLight}%, ${(0.12 + brightness * 0.45) * star.alpha})`;
            trailCtx.lineWidth = Math.max(0.5, radius * (0.4 + persistence * 0.6));
            const vx = sx - star.prevX;
            const vy = sy - star.prevY;
            const speed2d = Math.hypot(vx, vy);
            const trailScale = Math.min(36, 3.6 + state.speed * 0.048) * (0.58 + persistence * 0.98);
            trailCtx.beginPath();
            trailCtx.moveTo(sx, sy);
            if (speed2d > 0.0001) {
                const nx = vx / speed2d;
                const ny = vy / speed2d;
                const trailLength = Math.max(0.6, speed2d * trailScale);
                trailCtx.lineTo(sx - nx * trailLength, sy - ny * trailLength);
            } else {
                trailCtx.lineTo(star.prevX, star.prevY);
            }
            trailCtx.stroke();
        }
        // trailCtx.beginPath();
        // trailCtx.arc(sx, sy, Math.max(0.35, radius * (0.5 + persistence * 0.8)), 0, Math.PI * 2);
        // trailCtx.fill();

        star.prevX = sx;
        star.prevY = sy;
    }

    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
}

function drawCenterGlow() {
    const pulse = 0.4 + 0.6 * Math.sin(state.time * 0.7);
    const r = Math.min(state.width, state.height) * 0.16;
    const glow = ctx.createRadialGradient(
        state.halfW,
        state.halfH,
        2,
        state.halfW,
        state.halfH,
        r
    );
    glow.addColorStop(0, `rgba(166, 206, 255, ${0.34 * pulse})`);
    glow.addColorStop(1, "rgba(0, 0, 0, 0)");
    const bloom = ctx.createRadialGradient(
        state.halfW,
        state.halfH,
        r * 0.15,
        state.halfW,
        state.halfH,
        r * 2.4
    );
    bloom.addColorStop(0, `rgba(196, 224, 255, ${0.24 * pulse})`);
    bloom.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.globalCompositeOperation = "screen";
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(state.halfW, state.halfH, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = bloom;
    ctx.beginPath();
    ctx.arc(state.halfW, state.halfH, r * 2.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";
}

function updateUI() {
    speedReadout.textContent = `Speed ${(state.speed / 150).toFixed(2)}x`;
}

function render(dt) {
    drawBackground();
    ctx.globalCompositeOperation = "screen";
    ctx.globalAlpha = 1;
    ctx.drawImage(trailCanvas, 0, 0, state.width, state.height);
    drawStars(dt);
    drawCenterGlow();
    ctx.globalCompositeOperation = "source-over";
}

let last = performance.now();
function frame(now) {
    const dt = Math.min(0.04, (now - last) / 1000);
    last = now;

    state.time += dt;
    updateAutopilot(dt);
    render(dt);
    updateUI();

    requestAnimationFrame(frame);
}

resetBtn.addEventListener("click", () => {
    state.wanderPhaseA = Math.random() * Math.PI * 2;
    state.wanderPhaseB = Math.random() * Math.PI * 2;
    state.wanderPhaseC = Math.random() * Math.PI * 2;
    state.targetSpeed = 150;
    state.speed = 150;
});

window.addEventListener("resize", resize);

resize();
buildStars();
requestAnimationFrame(frame);
