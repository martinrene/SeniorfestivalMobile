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

/** Half the catchable width of the basket mouth, in play-area pixels. */
export const RIM_HALF_WIDTH = 52;

/** Basket sweep, as a fraction of the play area width. */
export const BASKET_AMPLITUDE_RATIO = 0.3;

/** Basket sweep speed in radians/second, before and during the final sprint. */
export const BASKET_BASE_SPEED = 1.05;
export const BASKET_SPRINT_SPEED = 1.9;

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
 * True on the frame an item drops through the basket line. Descending only, so
 * an item still on its way up cannot score on the way past.
 */
export function crossedRimDescending(projectile, rimY) {
  return projectile.vy > 0 && projectile.prevY < rimY && projectile.y >= rimY;
}

export function isInsideRim(x, basketX, halfWidth = RIM_HALF_WIDTH) {
  return Math.abs(x - basketX) <= halfWidth;
}

/** Basket speeds up for the closing seconds, so the round builds. */
export function basketSpeed(remainingMs) {
  return remainingMs <= SPRINT_MS ? BASKET_SPRINT_SPEED : BASKET_BASE_SPEED;
}

/** Horizontal centre of the basket at a given point in the round. */
export function basketCentre(width, phase) {
  const amplitude = width * BASKET_AMPLITUDE_RATIO;
  return width / 2 + Math.sin(phase) * amplitude;
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
