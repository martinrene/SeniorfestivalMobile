// Pure game maths for the food-throwing game. No Vue, no DOM, no timers, so the
// feel can be tuned from one place and the awkward parts can be unit tested.
//
// Coordinates are CSS pixels inside the play area, with y growing downwards, so
// an upward throw has a negative vy.

/** Length of one round. */
export const ROUND_MS = 60000;

/** Downward acceleration, px/s². Higher means a snappier, shorter arc. */
export const GRAVITY = 1880;

/**
 * Food flies a little slower than your finger did, so the arc stays readable.
 * GRAVITY is the old 2600 scaled by the square of this factor, which slows the
 * whole flight without changing the shape of the arc or how far a given flick
 * reaches -- only the pace changes, not the difficulty.
 */
export const THROW_SPEED_SCALE = 0.85;

/**
 * Only the tail end of a swipe decides the throw. Averaging the whole gesture
 * makes a flick feel mushy, because the slow aiming at the start drags it down.
 */
export const FLICK_WINDOW_MS = 100;

/** A swipe slower than this upward is treated as aiming, not throwing. */
export const MIN_THROW_SPEED = 420;

/** Nothing benefits from a throw that leaves the screen in two frames. */
export const MAX_THROW_SPEED = 3200;

/** How small an item gets by the time it reaches the basket line. */
export const FAR_SCALE = 0.42;

/**
 * How close the food has to get to the face to count, in play-area pixels. The
 * face glyph is about 52px across, so this is roughly its own size plus a small
 * forgiveness margin -- turn it down further to demand tighter aim.
 */
export const TARGET_RADIUS = 38;

/**
 * Face sweep either side of centre, as a fraction of the play area width. At
 * 0.42 the face reaches 8% and 92% of the width, so it tucks right up to both
 * edges. Much beyond this and it leaves the screen at the turns.
 */
export const TARGET_AMPLITUDE_RATIO = 0.42;

/**
 * Face sweep speed in radians/second, before and during the final sprint. One
 * full there-and-back is 2*PI radians, so 2.5 is a round trip every 2.5s and 3.8
 * every 1.7s. Below about 1.5 the face is slow enough to hit without leading it.
 */
export const TARGET_BASE_SPEED = 2.5;
export const TARGET_SPRINT_SPEED = 3.8;

/** How long the closing sprint lasts. */
export const SPRINT_MS = 20000;

export const FOODS = ["🍟", "🍔", "🌭", "🌮", "🍕", "🧇"];

/** You are feeding a face, and it swaps for a new one every time you land a throw. */
export const TARGETS = [
  "😀", "😃", "😄", "😁", "😋",
  "🤩", "🥳", "😎", "🤗", "😸",
  "🥰", "😍", "😜", "🤪", "🤯",
  "🤠"
];

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Velocity of a flick, from the pointer samples recorded during the drag.
 * Returns null when there is not enough movement to read a direction.
 */
export function throwVelocity(samples) {
  if (!samples || samples.length < 2) {
    return null;
  }

  const last = samples[samples.length - 1];

  // Walk backwards to the oldest sample still inside the flick window, so a long
  // slow drag followed by a fast flick reads as the flick.
  let first = samples[0];
  for (let i = samples.length - 1; i >= 0; i--) {
    first = samples[i];
    if (last.t - samples[i].t >= FLICK_WINDOW_MS) {
      break;
    }
  }

  const seconds = (last.t - first.t) / 1000;
  if (seconds <= 0) {
    return null;
  }

  const vx = (last.x - first.x) / seconds;
  const vy = (last.y - first.y) / seconds;
  const speed = Math.hypot(vx, vy);

  if (speed > MAX_THROW_SPEED) {
    const factor = MAX_THROW_SPEED / speed;
    return { vx: vx * factor, vy: vy * factor };
  }

  return { vx, vy };
}

/** A throw only counts if it was flicked upwards hard enough to be deliberate. */
export function isValidThrow(velocity) {
  return velocity !== null && velocity.vy <= -MIN_THROW_SPEED;
}

/** Converts the speed of a swipe into the speed of the thing it threw. */
export function toProjectileVelocity(velocity) {
  return {
    vx: velocity.vx * THROW_SPEED_SCALE,
    vy: velocity.vy * THROW_SPEED_SCALE
  };
}

export function createProjectile({ id, x, y, vx, vy, emoji }) {
  return {
    id,
    emoji,
    x,
    y,
    prevX: x,
    prevY: y,
    vx,
    vy,
    scale: 1,
    rotation: 0,
    spin: (vx / 40) + (Math.random() * 60 - 30),
    settled: false,
    hit: false
  };
}

/** Advances one projectile by dt seconds. Mutates and returns it. */
export function stepProjectile(projectile, dt) {
  projectile.prevX = projectile.x;
  projectile.prevY = projectile.y;
  projectile.vy += GRAVITY * dt;
  projectile.x += projectile.vx * dt;
  projectile.y += projectile.vy * dt;
  projectile.rotation += projectile.spin * dt;
  return projectile;
}

/**
 * Fakes distance: items shrink as they climb from the hand towards the basket
 * line, and never grow beyond full size if a throw falls short.
 */
export function projectileScale(y, handY, basketY) {
  const travel = handY - basketY;
  if (travel <= 0) {
    return 1;
  }

  const progress = clamp((handY - y) / travel, 0, 1);
  return 1 - (1 - FAR_SCALE) * progress;
}

/**
 * True when the food touched the face on this frame, from any direction. Tested
 * against the whole path travelled since the last frame rather than just where
 * the item ended up, so a fast throw cannot skip clean through between frames.
 */
export function hitsTarget(projectile, targetX, targetY, radius = TARGET_RADIUS) {
  const distance = segmentDistance(
    projectile.prevX, projectile.prevY,
    projectile.x, projectile.y,
    targetX, targetY
  );

  return distance <= radius;
}

/** Shortest distance from a point to the line segment a -> b. */
function segmentDistance(ax, ay, bx, by, px, py) {
  const dx = bx - ax;
  const dy = by - ay;
  const lengthSquared = dx * dx + dy * dy;

  if (lengthSquared === 0) {
    return Math.hypot(px - ax, py - ay);
  }

  const along = ((px - ax) * dx + (py - ay) * dy) / lengthSquared;
  const clamped = Math.min(1, Math.max(0, along));

  return Math.hypot(px - (ax + clamped * dx), py - (ay + clamped * dy));
}

/** The face speeds up for the closing seconds, so the round builds. */
export function targetSpeed(remainingMs) {
  return remainingMs <= SPRINT_MS ? TARGET_SPRINT_SPEED : TARGET_BASE_SPEED;
}

/** Horizontal centre of the face at a given point in the round. */
export function targetCentre(width, phase) {
  const amplitude = width * TARGET_AMPLITUDE_RATIO;

  // A triangle wave, not a sine. A sine decelerates to a standstill at each end
  // of its sweep and lingers there, which parks the face and makes it trivial to
  // hit; a triangle crosses at a constant speed and turns sharply instead.
  const sweep = (2 / Math.PI) * Math.asin(Math.sin(phase));

  // A second wave on top so the path is not a metronome you can fire on without
  // looking. Its peak speed (0.2 * 1.7 = 0.34) stays below the triangle's
  // constant 0.8 * 2/PI = 0.51, so the two can never cancel into a stall.
  const wobble = Math.sin(phase * 1.7);

  // The weights sum to 1, which keeps the sweep inside the arena.
  return width / 2 + (sweep * 0.8 + wobble * 0.2) * amplitude;
}

/** Never picks the value already on screen, so a swap always looks like a swap. */
function pickRandom(list, exclude) {
  const options = exclude ? list.filter((item) => item !== exclude) : list;
  const pool = options.length > 0 ? options : list;

  return pool[Math.floor(Math.random() * pool.length)];
}

export function randomFood(exclude) {
  return pickRandom(FOODS, exclude);
}

export function randomTarget(exclude) {
  return pickRandom(TARGETS, exclude);
}
