// const canvas = document.getElementById("scene");
// const ctx = canvas.getContext("2d");
// const trailCanvas = document.createElement("canvas");
// const trailCtx = trailCanvas.getContext("2d");
// const speedReadout = document.getElementById("speedReadout");
// const resetBtn = document.getElementById("resetBtn");

// const state = {
//     dpr: 1,
//     width: 1,
//     height: 1,
//     halfW: 0,
//     halfH: 0,
//     focal: 700,
//     time: 0,
//     speed: 150,
//     targetSpeed: 150,
//     minSpeed: 40,
//     maxSpeed: 560,
//     yaw: 0,
//     pitch: 0,
//     roll: 0,
//     targetYaw: 0,
//     targetPitch: 0,
//     targetRoll: 0,
//     wanderPhaseA: Math.random() * Math.PI * 2,
//     wanderPhaseB: Math.random() * Math.PI * 2,
//     wanderPhaseC: Math.random() * Math.PI * 2,
//     backdropStars: [],
//     // nebulae: [],
//     stars: []
// };

// const STAR_COUNT = 1700;
// const STAR_SPAWN_Z = 2600;
// const STAR_KILL_Z = -80;
// const STAR_RADIUS = 1500;

// function rand(min, max) {
//     return min + Math.random() * (max - min);
// }

// function lerp(a, b, t) {
//     return a + (b - a) * t;
// }

// function clamp(value, min, max) {
//     return Math.max(min, Math.min(max, value));
// }

// function spawnStar(star, z) {
//     const angle = Math.random() * Math.PI * 2;
//     const radius = Math.sqrt(Math.random()) * STAR_RADIUS;

//     star.x = Math.cos(angle) * radius;
//     star.y = Math.sin(angle) * radius;
//     star.z = z;

//     star.size = rand(0.1, 0.6);
//     star.temp = rand(0.5, 1);

//     star.alpha = 1;

//     // replace prevX prevY
//     star.trail = [];
// }

// function buildStars() {
//     state.stars.length = 0;
//     for (let i = 0; i < STAR_COUNT; i += 1) {
//         const star = { x: 0, y: 0, z: 0, size: 1, temp: 1, prevX: null, prevY: null, alpha: 1 };
//         spawnStar(star, rand(20, STAR_SPAWN_Z));
//         state.stars.push(star);
//     }
// }

// function buildBackdrop() {
//     // state.backdropStars.length = 0;
//     // state.nebulae.length = 0;
// }

// function resize() {
//     const w = window.innerWidth;
//     const h = window.innerHeight;
//     state.dpr = window.devicePixelRatio || 1;

//     canvas.width = w * state.dpr;
//     canvas.height = h * state.dpr;
//     canvas.style.width = w + "px";
//     canvas.style.height = h + "px";
//     ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);

//     trailCanvas.width = w * state.dpr;
//     trailCanvas.height = h * state.dpr;
//     trailCtx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
//     trailCtx.clearRect(0, 0, w, h);

//     state.width = w;
//     state.height = h;
//     state.halfW = w * 0.5;
//     state.halfH = h * 0.5;
//     state.focal = Math.max(520, Math.min(1000, w * 0.78));
//     buildBackdrop();
// }

// function rotatePoint(x, y, z) {
//     const cy = Math.cos(state.yaw);
//     const sy = Math.sin(state.yaw);
//     const cp = Math.cos(state.pitch);
//     const sp = Math.sin(state.pitch);
//     const cr = Math.cos(state.roll);
//     const sr = Math.sin(state.roll);

//     let rx = x * cy - z * sy;
//     let rz = x * sy + z * cy;
//     let ry = y;

//     const py = ry * cp - rz * sp;
//     const pz = ry * sp + rz * cp;
//     ry = py;
//     rz = pz;

//     const qx = rx * cr - ry * sr;
//     const qy = rx * sr + ry * cr;

//     return { x: qx, y: qy, z: rz };
// }

// function updateAutopilot(dt) {
//     const t = state.time;
//     const yawWave = Math.sin(t * 0.14 + state.wanderPhaseA) * 0.55 + Math.sin(t * 0.037 + state.wanderPhaseB) * 0.25;
//     const pitchWave = Math.sin(t * 0.11 + state.wanderPhaseB) * 0.26 + Math.cos(t * 0.053 + state.wanderPhaseC) * 0.12;
//     const rollWave = Math.sin(t * 0.09 + state.wanderPhaseC) * 0.42 + Math.cos(t * 0.04 + state.wanderPhaseA) * 0.18;
//     const speedWave = 180 + Math.sin(t * 0.17 + state.wanderPhaseA) * 70 + Math.cos(t * 0.06 + state.wanderPhaseB) * 40;

//     state.targetYaw = clamp(yawWave, -0.95, 0.95);
//     state.targetPitch = clamp(pitchWave, -0.55, 0.55);
//     state.targetRoll = clamp(rollWave, -0.9, 0.9);
//     state.targetSpeed = clamp(speedWave, state.minSpeed, state.maxSpeed);

//     state.speed = lerp(state.speed, state.targetSpeed, 0.03 + dt * 0.4);
//     state.yaw = lerp(state.yaw, state.targetYaw, 0.03 + dt * 0.75);
//     state.pitch = lerp(state.pitch, state.targetPitch, 0.03 + dt * 0.75);
//     state.roll = lerp(state.roll, state.targetRoll, 0.03 + dt * 0.7);
// }

// function drawBackground() {
//     ctx.fillStyle = "#000000";
//     ctx.fillRect(0, 0, state.width, state.height);
// }

// function drawStars(dt) {
//     const persistence = clamp((state.speed - 70) / 520, 0, 1);
//     trailCtx.globalCompositeOperation = "source-over";
//     const fadeAlpha = 0.02 + (0.08 - persistence * 0.05); // tweak values
//     trailCtx.fillStyle = `rgba(2, 4, 10, ${fadeAlpha})`;
//     trailCtx.fillRect(0, 0, state.width, state.height);

//     ctx.globalCompositeOperation = "screen";

//     for (let i = 0; i < state.stars.length; i += 1) {
//         const star = state.stars[i];
//         star.z -= state.speed * dt;

//         if (star.z < STAR_KILL_Z) {
//             spawnStar(star, STAR_SPAWN_Z + rand(0, 200));
//             continue;
//         }

//         const p = rotatePoint(star.x, star.y, star.z);
//         if (p.z <= 2) {
//             spawnStar(star, STAR_SPAWN_Z + rand(0, 200));
//             continue;
//         }

//         const perspective = state.focal / p.z;
//         const sx = state.halfW + p.x * perspective;
//         const sy = state.halfH + p.y * perspective;

//         if (sx < -100 || sx > state.width + 100 || sy < -100 || sy > state.height + 100) {
//             spawnStar(star, STAR_SPAWN_Z + rand(0, 200));
//             continue;
//         }

//         const brightness = clamp((STAR_SPAWN_Z - star.z) / STAR_SPAWN_Z, 0.1, 1);
//         const radius = star.size * (0.2 + perspective * 0.8);

//         const starLight = 72 + brightness * 24;
//         ctx.globalAlpha = (0.12 + brightness * 0.75) * star.alpha;
//         ctx.fillStyle = `hsla(${205 + star.temp * 28}, 85%, ${starLight}%, 0.95)`;

//         ctx.beginPath();
//         ctx.arc(sx, sy, Math.max(0.5, radius), 0, Math.PI * 2);
//         ctx.fill();

//         trailCtx.globalCompositeOperation = "screen";
//         trailCtx.globalAlpha = (0.14 + brightness * 0.45) * star.alpha;
//         trailCtx.fillStyle = `hsla(${205 + star.temp * 28}, 85%, ${starLight}%, 0.95)`;

//         // if (star.prevX !== null && star.prevY !== null) {
//         //     const vx = sx - star.prevX;
//         //     const vy = sy - star.prevY;
//         //     const speed2d = Math.hypot(vx, vy);
//         //     const trailScale = Math.min(100, 10 + state.speed * 0.15) * (0.58 + persistence * 0.98);

//         //     let endX = sx;
//         //     let endY = sy;
//         //     if (speed2d > 0.0001) {
//         //         const nx = vx / speed2d;
//         //         const ny = vy / speed2d;
//         //         const trailLength = Math.max(0.1, speed2d * trailScale);
//         //         endX = sx - nx * trailLength;
//         //         endY = sy - ny * trailLength;
//         //     } else {
//         //         endX = star.prevX;
//         //         endY = star.prevY;
//         //     }
//         star.trail.push({ x: sx, y: sy });

//         const maxTrail = 18;

//         if (star.trail.length > maxTrail) {
//             star.trail.shift();
//         }

//         //     // Draw trail as a line without fading
//         //     const grad = trailCtx.createLinearGradient(sx, sy, endX, endY);
//         //     grad.addColorStop(0, `hsla(${205 + star.temp * 28}, 100%, ${starLight}%, 1)`);
//         //     grad.addColorStop(1, `hsla(${205 + star.temp * 28}, 100%, ${starLight}%, 1)`);

//         //     trailCtx.strokeStyle = grad;
//         //     trailCtx.lineWidth = radius * 2;
//         //     trailCtx.lineCap = "round";
//         //     trailCtx.lineJoin = "round";
//         //     trailCtx.beginPath();
//         //     trailCtx.moveTo(sx, sy);
//         //     trailCtx.lineTo(endX, endY);
//         //     trailCtx.stroke();

//         //     // Draw circle at tail start to fill gap
//         //     trailCtx.fillStyle = `hsla(${205 + star.temp * 28}, 100%, ${starLight}%, ${1 * star.alpha})`;
//         //     trailCtx.beginPath();
//         //     trailCtx.arc(sx, sy, radius, 0, Math.PI * 2);
//         //     trailCtx.fill();
//         // }
//         // // trailCtx.beginPath();
//         // // trailCtx.arc(sx, sy, Math.max(0.35, radius * (0.5 + persistence * 0.8)), 0, Math.PI * 2);
//         // // trailCtx.fill();

//         // star.prevX = sx;
//         // star.prevY = sy;
//         if (star.trail.length > 1) {
//             trailCtx.lineCap = "round";
//             trailCtx.lineJoin = "round";

//             for (let j = 1; j < star.trail.length; j++) {
//                 const p1 = star.trail[j - 1];
//                 const p2 = star.trail[j];

//                 const t = j / star.trail.length;

//                 trailCtx.strokeStyle =
//                     `hsla(${205 + star.temp * 28}, 100%, ${starLight}%, 1)`;

//                 trailCtx.lineWidth =
//                     radius * (0.2 + t * 2.2);

//                 trailCtx.beginPath();
//                 trailCtx.moveTo(p1.x, p1.y);
//                 trailCtx.lineTo(p2.x, p2.y);
//                 trailCtx.stroke();
//             }
//         }
//     }

//     ctx.globalCompositeOperation = "source-over";
//     ctx.globalAlpha = 1;
// }

// // function drawCenterGlow() {
// //     const pulse = 0.4 + 0.6 * Math.sin(state.time * 0.7);
// //     const r = Math.min(state.width, state.height) * 0.16;
// //     const glow = ctx.createRadialGradient(
// //         state.halfW,
// //         state.halfH,
// //         2,
// //         state.halfW,
// //         state.halfH,
// //         r
// //     );
// //     glow.addColorStop(0, `rgba(166, 206, 255, 1)`);
// //     glow.addColorStop(1, "rgba(0, 0, 0, 0)");

// //     ctx.globalCompositeOperation = "source-over";
// //     ctx.fillStyle = glow;
// //     ctx.beginPath();
// //     ctx.arc(state.halfW, state.halfH, r, 0, Math.PI * 2);
// //     ctx.fill();
// // }

// function updateUI() {
//     speedReadout.textContent = `Speed ${(state.speed / 150).toFixed(2)}x`;
// }

// function render(dt) {
//     drawBackground();
//     ctx.globalCompositeOperation = "screen";
//     ctx.globalAlpha = 1;
//     ctx.drawImage(trailCanvas, 0, 0, state.width, state.height);
//     drawStars(dt);
//     // drawCenterGlow();
//     ctx.globalCompositeOperation = "source-over";
// }

// let last = performance.now();
// function frame(now) {
//     const dt = Math.min(0.04, (now - last) / 1000);
//     last = now;

//     state.time += dt;
//     updateAutopilot(dt);
//     render(dt);
//     updateUI();

//     requestAnimationFrame(frame);
// }

// resetBtn.addEventListener("click", () => {
//     state.wanderPhaseA = Math.random() * Math.PI * 2;
//     state.wanderPhaseB = Math.random() * Math.PI * 2;
//     state.wanderPhaseC = Math.random() * Math.PI * 2;
//     state.targetSpeed = 150;
//     state.speed = 150;
// });

// window.addEventListener("resize", resize);

// resize();
// buildStars();
// requestAnimationFrame(frame);



// const canvas = document.getElementById("scene");
// const ctx = canvas.getContext("2d");
// const trailCanvas = document.createElement("canvas");
// const trailCtx = trailCanvas.getContext("2d");
// const speedReadout = document.getElementById("speedReadout");
// const resetBtn = document.getElementById("resetBtn");

// const state = {
//     dpr: 1,
//     width: 1,
//     height: 1,
//     halfW: 0,
//     halfH: 0,
//     focal: 700,
//     time: 0,
//     speed: 150,
//     targetSpeed: 150,
//     minSpeed: 40,
//     maxSpeed: 560,
//     yaw: 0,
//     pitch: 0,
//     roll: 0,
//     targetYaw: 0,
//     targetPitch: 0,
//     targetRoll: 0,
//     wanderPhaseA: Math.random() * Math.PI * 2,
//     wanderPhaseB: Math.random() * Math.PI * 2,
//     wanderPhaseC: Math.random() * Math.PI * 2,
//     stars: []
// };

// const STAR_COUNT = 1700;
// const STAR_SPAWN_Z = 2600;
// const STAR_KILL_Z = -80;
// const STAR_RADIUS = 1500;

// function rand(min, max) {
//     return min + Math.random() * (max - min);
// }

// function lerp(a, b, t) {
//     return a + (b - a) * t;
// }

// function clamp(v, a, b) {
//     return Math.max(a, Math.min(b, v));
// }

// function spawnStar(star, z) {
//     const angle = Math.random() * Math.PI * 2;
//     const radius = Math.sqrt(Math.random()) * STAR_RADIUS;

//     star.x = Math.cos(angle) * radius;
//     star.y = Math.sin(angle) * radius;
//     star.z = z;

//     star.size = rand(0.1, 0.6);
//     star.temp = rand(0.5, 1);
//     star.trail = [];
// }

// function buildStars() {
//     state.stars.length = 0;
//     for (let i = 0; i < STAR_COUNT; i++) {
//         const star = { x: 0, y: 0, z: 0, size: 1, temp: 1 };
//         spawnStar(star, rand(20, STAR_SPAWN_Z));
//         state.stars.push(star);
//     }
// }

// function resize() {
//     const w = window.innerWidth;
//     const h = window.innerHeight;

//     state.dpr = window.devicePixelRatio || 1;

//     canvas.width = w * state.dpr;
//     canvas.height = h * state.dpr;
//     canvas.style.width = w + "px";
//     canvas.style.height = h + "px";

//     ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);

//     trailCanvas.width = w * state.dpr;
//     trailCanvas.height = h * state.dpr;
//     trailCtx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);

//     state.width = w;
//     state.height = h;
//     state.halfW = w / 2;
//     state.halfH = h / 2;
//     state.focal = Math.max(520, Math.min(1000, w * 0.78));
// }

// function rotatePoint(x, y, z) {
//     const cy = Math.cos(state.yaw);
//     const sy = Math.sin(state.yaw);
//     const cp = Math.cos(state.pitch);
//     const sp = Math.sin(state.pitch);
//     const cr = Math.cos(state.roll);
//     const sr = Math.sin(state.roll);

//     let rx = x * cy - z * sy;
//     let rz = x * sy + z * cy;
//     let ry = y;

//     const py = ry * cp - rz * sp;
//     const pz = ry * sp + rz * cp;

//     ry = py;
//     rz = pz;

//     const qx = rx * cr - ry * sr;
//     const qy = rx * sr + ry * cr;

//     return { x: qx, y: qy, z: rz };
// }

// function updateAutopilot(dt) {
//     const t = state.time;

//     state.targetYaw = Math.sin(t * 0.14) * 0.6;
//     state.targetPitch = Math.sin(t * 0.11) * 0.3;
//     state.targetRoll = Math.sin(t * 0.09) * 0.5;

//     state.speed = lerp(state.speed, 150 + Math.sin(t * 0.17) * 80, 0.03);
//     state.yaw = lerp(state.yaw, state.targetYaw, 0.05);
//     state.pitch = lerp(state.pitch, state.targetPitch, 0.05);
//     state.roll = lerp(state.roll, state.targetRoll, 0.05);
// }

// function drawBackground() {
//     ctx.fillStyle = "black";
//     ctx.fillRect(0, 0, state.width, state.height);
// }

// function drawStars(dt) {

//     // smoother fade (important for continuous trails)
//     const fade = 0.03;
//     trailCtx.fillStyle = `rgba(0,0,0,${fade})`;
//     trailCtx.fillRect(0, 0, state.width, state.height);

//     ctx.globalCompositeOperation = "screen";

//     for (const star of state.stars) {

//         star.z -= state.speed * dt;

//         if (star.z < STAR_KILL_Z) {
//             spawnStar(star, STAR_SPAWN_Z);
//             continue;
//         }

//         const p = rotatePoint(star.x, star.y, star.z);

//         if (p.z <= 2) {
//             spawnStar(star, STAR_SPAWN_Z);
//             continue;
//         }

//         const perspective = state.focal / p.z;
//         const sx = state.halfW + p.x * perspective;
//         const sy = state.halfH + p.y * perspective;

//         const radius = star.size * (0.2 + perspective * 0.8);

//         // ---- STAR BODY ----
//         ctx.globalAlpha = 0.8;
//         ctx.fillStyle = `white`;

//         // ctx.beginPath();
//         // ctx.arc(sx, sy, radius, 0, Math.PI * 2);
//         // ctx.fill();
//         ctx.beginPath();
//         ctx.arc(sx, sy, radius, 0, Math.PI * 2);
//         ctx.fill();

//         // ---- TRAIL BUFFER ----
//         // star.trail.push({ x: sx, y: sy });
//         const last = star.trail[star.trail.length - 1];

//         if (!last || Math.hypot(sx - last.x, sy - last.y) > 0.5) {
//             star.trail.push({ x: sx, y: sy });
//         }

//         const maxTrail = 24;

//         if (star.trail.length > maxTrail) {
//             star.trail.shift();
//         }
//         if (star.trail.length > 260) star.trail.shift();

//         // ---- SMOOTH TRAIL ----
//         // if (star.trail.length > 2) {

//         //     trailCtx.beginPath();
//         //     trailCtx.moveTo(star.trail[0].x, star.trail[0].y);

//         //     for (let i = 1; i < star.trail.length - 1; i++) {
//         //         const c = star.trail[i];
//         //         const n = star.trail[i + 1];

//         //         const mx = (c.x + n.x) / 2;
//         //         const my = (c.y + n.y) / 2;

//         //         trailCtx.quadraticCurveTo(c.x, c.y, mx, my);
//         //     }

//         //     const head = star.trail[star.trail.length - 1];

//         //     const grad = trailCtx.createLinearGradient(
//         //         star.trail[0].x,
//         //         star.trail[0].y,
//         //         head.x,
//         //         head.y
//         //     );

//         //     grad.addColorStop(0, "rgba(255,255,255,0)");
//         //     grad.addColorStop(1, `white`);

//         //     trailCtx.strokeStyle = grad;
//         //     trailCtx.lineWidth = radius * 2;
//         //     trailCtx.lineCap = "round";
//         //     trailCtx.lineJoin = "round";

//         //     trailCtx.stroke();
//         // }
//         if (star.trail.length > 1) {

//             trailCtx.beginPath();
//             trailCtx.moveTo(star.trail[0].x, star.trail[0].y);

//             for (let i = 1; i < star.trail.length; i++) {
//                 trailCtx.lineTo(star.trail[i].x, star.trail[i].y);
//             }

//             trailCtx.strokeStyle = "white";
//             trailCtx.lineWidth = radius * 2;
//             trailCtx.lineCap = "round";
//             trailCtx.stroke();
//         }


//         // if (star.trail.length > 1) {

//         //     trailCtx.beginPath();

//         //     for (let i = 0; i < star.trail.length; i++) {

//         //         const p3 = star.trail[i];
//         //         const p = rotatePoint(p3.x, p3.y, p3.z);

//         //         if (p.z <= 2) continue;

//         //         const perspective = state.focal / p.z;
//         //         const x = state.halfW + p.x * perspective;
//         //         const y = state.halfH + p.y * perspective;

//         //         if (i === 0) trailCtx.moveTo(x, y);
//         //         else trailCtx.lineTo(x, y);
//         //     }

//         //     trailCtx.strokeStyle = "white";
//         //     trailCtx.lineWidth = radius * 2.5;
//         //     trailCtx.lineCap = "round";
//         //     trailCtx.stroke();
//         // }
//     }

//     ctx.globalCompositeOperation = "source-over";
// }

// function render(dt) {
//     drawBackground();
//     ctx.drawImage(trailCanvas, 0, 0, state.width, state.height);
//     drawStars(dt);
// }

// let last = performance.now();

// function frame(t) {
//     const dt = Math.min(0.04, (t - last) / 1000);
//     last = t;

//     state.time += dt;

//     updateAutopilot(dt);
//     render(dt);

//     requestAnimationFrame(frame);
// }

// window.addEventListener("resize", resize);

// resetBtn?.addEventListener("click", () => {
//     state.speed = 150;
// });

// resize();
// buildStars();
// requestAnimationFrame(frame);




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
    star.size = rand(0.01, 0.2);
    star.temp = rand(0.1, 0.3);
    star.prevX = null;
    star.prevY = null;
    star.alpha = 1;
}

function buildStars() {
    state.stars.length = 0;
    for (let i = 0; i < STAR_COUNT; i += 1) {
        const star = { x: 0, y: 0, z: 0, size: 1, temp: 1, prevX: null, prevY: null, alpha: 1 };
        spawnStar(star, rand(20, STAR_SPAWN_Z));
        state.stars.push(star);
    }
}

// function buildBackdrop() {
//     state.backdropStars.length = 0;

// const bgCount = Math.floor((state.width * state.height) / 1500);
// for (let i = 0; i < bgCount; i += 1) {
//     state.backdropStars.push({
//         x: Math.random(),
//         y: Math.random(),
//         size: rand(0.35, 1.6),
//         alpha: rand(0.12, 0.85),
//         hue: rand(190, 235),
//         twinkle: rand(0, Math.PI * 2)
//     });
// }


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
    // buildBackdrop();
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
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, state.width, state.height);

    const vignette = ctx.createRadialGradient(
        state.halfW,
        state.halfH,
        Math.min(state.width, state.height) * 0.18,
        state.halfW,
        state.halfH,
        Math.max(state.width, state.height) * 0.8
    );
    vignette.addColorStop(0, "rgba(25, 25, 25, 0.14)");
    vignette.addColorStop(1, "rgba(27, 27, 27, 0.58)");
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
        ctx.fillStyle = `hsla(${205 + star.temp * 28}, 85%, ${starLight}%, 1)`;

        ctx.beginPath();
        ctx.arc(sx, sy, Math.max(0.5, radius), 0, Math.PI * 2);
        ctx.fill();
 

        trailCtx.globalCompositeOperation = "screen";
        trailCtx.globalAlpha = (0.14 + brightness * 0.45) * star.alpha;
        trailCtx.fillStyle = `hsla(${205 + star.temp * 28}, 85%, ${starLight}%, 1)`;

        if (star.prevX !== null && star.prevY !== null && p.z > 15) {
            trailCtx.strokeStyle = `hsla(${205 + star.temp * 28}, 100%, ${starLight}%, ${(0.12 + brightness * 0.45) * star.alpha})`;
            trailCtx.lineWidth = radius * 2;
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

function updateUI() {
    speedReadout.textContent = `Speed ${(state.speed / 150).toFixed(2)}x`;
}

function render(dt) {
    drawBackground();
    ctx.globalCompositeOperation = "screen";
    ctx.globalAlpha = 1;
    ctx.drawImage(trailCanvas, 0, 0, state.width, state.height);
    drawStars(dt);
    // drawCenterGlow();
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
