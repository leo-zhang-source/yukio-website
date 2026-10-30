// Small 2-D rigid-body solver. Translation and rotation share the SAME force
// at the hand's attachment point: F = k(target - grip) + c(targetV - gripV),
// m*a = F + m*g and I*alpha = cross(grip - centerOfMass, F).
export const STEP = 1 / 240;
export const GRIP = { x: 0.5016, y: 0.0408 };
export const SETTINGS = Object.freeze({
  heldStiffness: 1400, heldDamping: 45, heldAngularDrag: 3.8,
  gravityPerHeight: 12, dropLinearDrag: 15, dropAngularSpring: 110,
  dropAngularDamping: 19, maxDropSeconds: 0.9,
  softAngle: 0.24, hardAngle: 0.38,
});
const clamp = (x, low, high) => Math.min(high, Math.max(low, x));

export function rotate(x, y, angle) {
  const c = Math.cos(angle), s = Math.sin(angle);
  return { x: c * x - s * y, y: s * x + c * y };
}

export function grip(body) {
  const r = rotate(body.width * (GRIP.x - 0.5), body.height * (GRIP.y - 0.5), body.angle);
  return { x: body.x + r.x, y: body.y + r.y,
    vx: body.vx - body.omega * r.y, vy: body.vy + body.omega * r.x,
    rx: r.x, ry: r.y };
}

export function createBody({ width, height, x, y, angle = 0, vx = 0, vy = 0, omega = 0 }) {
  const offset = rotate(width * (GRIP.x - 0.5), height * (GRIP.y - 0.5), angle);
  return { width, height, x: x - offset.x, y: y - offset.y, angle, vx, vy, omega,
    mass: 1, inertia: (width * width + height * height) / 12,
    gravity: height * SETTINGS.gravityPerHeight };
}

export function resizeBody(body, width, height) {
  const previous = grip(body);
  body.width = width; body.height = height;
  body.inertia = (width * width + height * height) / 12;
  body.gravity = height * SETTINGS.gravityPerHeight;
  const r = rotate(width * (GRIP.x - 0.5), height * (GRIP.y - 0.5), body.angle);
  body.x = previous.x - r.x; body.y = previous.y - r.y;
  body.vx = previous.vx + body.omega * r.y;
  body.vy = previous.vy - body.omega * r.x;
}

export function vertices(body) {
  return [[-0.5,-0.5],[0.5,-0.5],[0.5,0.5],[-0.5,0.5]].map(([x,y]) => {
    const r = rotate(body.width * x, body.height * y, body.angle);
    return { x: body.x + r.x, y: body.y + r.y, rx: r.x, ry: r.y };
  });
}

export function bounds(body) {
  const points = vertices(body);
  return { left: Math.min(...points.map(p => p.x)), right: Math.max(...points.map(p => p.x)),
    top: Math.min(...points.map(p => p.y)), bottom: Math.max(...points.map(p => p.y)) };
}

function wallImpulse(body, point, nx, ny, penetration) {
  // Correct position, then exchange momentum at the contacting CORNER.
  body.x += nx * penetration; body.y += ny * penetration;
  const pointVX = body.vx - body.omega * point.ry;
  const pointVY = body.vy + body.omega * point.rx;
  const normalV = pointVX * nx + pointVY * ny;
  if (normalV >= 0) return;
  const cross = point.rx * ny - point.ry * nx;
  const impulse = -(1 + 0.12) * normalV / (1 + cross * cross / body.inertia);
  body.vx += impulse * nx; body.vy += impulse * ny;
  body.omega += cross * impulse / body.inertia;
  const tx = -ny, ty = nx;
  const tangentCross = point.rx * ty - point.ry * tx;
  const tangentV = (body.vx - body.omega * point.ry) * tx + (body.vy + body.omega * point.rx) * ty;
  const friction = clamp(-tangentV / (1 + tangentCross * tangentCross / body.inertia), -impulse * 0.20, impulse * 0.20);
  body.vx += friction * tx; body.vy += friction * ty;
  body.omega += tangentCross * friction / body.inertia;
}

export function containBody(body, viewport) {
  if (!viewport) return;
  const margin = 8;
  for (let iteration = 0; iteration < 2; iteration++) {
    for (const [axis, direction, limit, nx, ny] of [
      ['x',-1,margin,1,0], ['x',1,viewport.width-margin,-1,0],
      ['y',-1,margin,0,1], ['y',1,viewport.height-margin,0,-1],
    ]) {
      const points = vertices(body);
      const point = points.reduce((a,b) => direction * a[axis] > direction * b[axis] ? a : b);
      const penetration = direction * (point[axis] - limit);
      if (penetration > 0) wallImpulse(body, point, nx, ny, penetration);
    }
  }
}

export function stepBody(body, dt, target = null, options = {}) {
  const k = SETTINGS.heldStiffness;
  const c = SETTINGS.heldDamping;
  const g = options.gravity ?? body.gravity;
  const angularDrag = options.angularDrag ?? SETTINGS.heldAngularDrag;
  const linearDrag = options.linearDrag ?? 0.12;
  let fx = 0, fy = 0, torque = 0;
  if (target) {
    const at = grip(body);
    const scale = options.forceScale ?? 1;
    fx = scale * (k * (target.x - at.x) + c * ((target.vx ?? 0) - at.vx));
    fy = scale * (k * (target.y - at.y) + c * ((target.vy ?? 0) - at.vy));
    const maximumForce = body.gravity * 4;
    const force = Math.hypot(fx,fy);
    if (force > maximumForce) { fx *= maximumForce / force; fy *= maximumForce / force; }
    torque = at.rx * fy - at.ry * fx;
  }
  body.vx += fx * dt; body.vy += (fy + g) * dt;
  body.omega += torque / body.inertia * dt;
  if (Math.abs(body.angle) > SETTINGS.softAngle) {
    const excess = body.angle - Math.sign(body.angle) * SETTINGS.softAngle;
    const outward = body.omega * Math.sign(body.angle) > 0 ? body.omega : 0;
    body.omega += (-700 * excess - 18 * outward) * dt;
  }
  body.vx *= Math.exp(-linearDrag * dt); body.vy *= Math.exp(-linearDrag * dt);
  body.omega *= Math.exp(-angularDrag * dt);
  body.x += body.vx * dt; body.y += body.vy * dt;
  body.angle += body.omega * dt;
  if (Math.abs(body.angle) > SETTINGS.hardAngle) {
    body.angle = Math.sign(body.angle) * SETTINGS.hardAngle;
    if (body.omega * body.angle > 0) body.omega *= -0.08;
  }
  containBody(body, options.viewport);
}

// Placing the pet supplies local support and friction, with no tether to the
// hero. Release velocities are retained, then dissipate near the drop point.
export function stepDrop(body, dt, viewport) {
  body.vx *= Math.exp(-SETTINGS.dropLinearDrag * dt);
  body.vy *= Math.exp(-SETTINGS.dropLinearDrag * dt);
  body.omega += (-SETTINGS.dropAngularSpring * body.angle - SETTINGS.dropAngularDamping * body.omega) * dt;
  body.x += body.vx * dt; body.y += body.vy * dt;
  body.angle += body.omega * dt;
  containBody(body, viewport);
}

export function seatedPose(body, viewport) {
  const width = body.width, height = width * 416 / 384;
  return { width, height,
    x: clamp(body.x - width / 2, 8, Math.max(8, viewport.width - width - 8)),
    y: clamp(body.y + body.height / 2 - height, 8, Math.max(8, viewport.height - height - 42)) };
}

// Time-stamped input interpolation: the velocity below belongs to the same
// path as the target position. Never invent an angular kick in pointermove.
export function sampleMotion(samples, time) {
  if (time <= samples[0].t) return { ...samples[0], vx: 0, vy: 0 };
  const last = samples[samples.length-1];
  if (time >= last.t) return { ...last, vx: 0, vy: 0 };
  let i = 0;
  while (i < samples.length-2 && samples[i+1].t < time) i++;
  const a = samples[i], b = samples[i+1], duration = Math.max(b.t-a.t, 0.1);
  const alpha = clamp((time-a.t) / duration, 0, 1);
  const vx = (b.x-a.x) * 1000/duration, vy = (b.y-a.y) * 1000/duration;
  return { x: a.x+(b.x-a.x)*alpha, y: a.y+(b.y-a.y)*alpha, vx, vy };
}
