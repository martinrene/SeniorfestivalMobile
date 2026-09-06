import { describe, expect, test } from "vitest";

import {
  BASKET_AMPLITUDE_RATIO,
  BASKET_BASE_SPEED,
  BASKET_SPRINT_SPEED,
  FAR_SCALE,
  GRAVITY,
  MAX_THROW_SPEED,
  MIN_THROW_SPEED,
  SPRINT_MS,
  THROW_SPEED_SCALE,
  FOODS,
  TARGETS,
  basketCentre,
  basketSpeed,
  createProjectile,
  crossedRimDescending,
  isInsideRim,
  isValidThrow,
  projectileScale,
  randomFood,
  randomTarget,
  stepProjectile,
  throwVelocity,
  toProjectileVelocity
} from "@/game/throwPhysics";

describe("throwVelocity", () => {
  test("needs at least two samples to read a direction", () => {
    expect(throwVelocity([])).toBeNull();
    expect(throwVelocity([{ x: 0, y: 0, t: 0 }])).toBeNull();
  });

  test("reads the flick, not the slow aiming that preceded it", () => {
    const velocity = throwVelocity([
      { x: 100, y: 500, t: 0 },
      { x: 100, y: 480, t: 300 },
      { x: 120, y: 380, t: 350 },
      { x: 140, y: 280, t: 400 }
    ]);

    // Only the last 100 ms counts: 40 px right and 200 px up in 0.1 s.
    expect(velocity.vx).toBeCloseTo(400);
    expect(velocity.vy).toBeCloseTo(-2000);

    // Averaging the whole gesture would have read a far weaker throw.
    const wholeGesture = (280 - 500) / 0.4;
    expect(velocity.vy).toBeLessThan(wholeGesture);
  });

  test("clamps absurdly fast flicks", () => {
    const velocity = throwVelocity([
      { x: 0, y: 1000, t: 0 },
      { x: 0, y: 900, t: 10 }
    ]);

    expect(Math.hypot(velocity.vx, velocity.vy)).toBeCloseTo(MAX_THROW_SPEED);
  });

  test("returns null when no time passed between samples", () => {
    expect(
      throwVelocity([
        { x: 0, y: 0, t: 5 },
        { x: 10, y: 10, t: 5 }
      ])
    ).toBeNull();
  });
});

describe("isValidThrow", () => {
  test("accepts a firm upward flick", () => {
    expect(isValidThrow({ vx: 0, vy: -(MIN_THROW_SPEED + 1) })).toBe(true);
  });

  test("rejects a gentle drag, a downward swipe and nothing at all", () => {
    expect(isValidThrow({ vx: 0, vy: -(MIN_THROW_SPEED - 1) })).toBe(false);
    expect(isValidThrow({ vx: 0, vy: 900 })).toBe(false);
    expect(isValidThrow(null)).toBe(false);
  });
});

describe("stepProjectile", () => {
  test("rises, slows, then falls back", () => {
    const item = createProjectile({
      id: 1, x: 100, y: 500, vx: 0, vy: -1000, emoji: "🍕"
    });

    stepProjectile(item, 0.1);
    expect(item.prevY).toBe(500);
    expect(item.vy).toBeCloseTo(-1000 + GRAVITY * 0.1);
    expect(item.y).toBeLessThan(500);

    const apexY = item.y;
    for (let i = 0; i < 40; i++) {
      stepProjectile(item, 0.1);
    }

    expect(item.vy).toBeGreaterThan(0);
    expect(item.y).toBeGreaterThan(apexY);
  });

  test("carries horizontal speed unchanged", () => {
    const item = createProjectile({
      id: 1, x: 0, y: 500, vx: 200, vy: -800, emoji: "🍔"
    });

    stepProjectile(item, 0.5);

    expect(item.vx).toBe(200);
    expect(item.x).toBeCloseTo(100);
  });
});

describe("projectileScale", () => {
  const handY = 600;
  const basketY = 200;

  test("is full size in the hand and smallest at the basket", () => {
    expect(projectileScale(handY, handY, basketY)).toBeCloseTo(1);
    expect(projectileScale(basketY, handY, basketY)).toBeCloseTo(FAR_SCALE);
  });

  test("clamps beyond either end", () => {
    expect(projectileScale(handY + 200, handY, basketY)).toBeCloseTo(1);
    expect(projectileScale(basketY - 200, handY, basketY)).toBeCloseTo(FAR_SCALE);
  });

  test("degrades safely before the arena has been measured", () => {
    expect(projectileScale(0, 0, 0)).toBe(1);
  });
});

describe("crossedRimDescending", () => {
  const rim = 200;

  test("scores only on the way down", () => {
    expect(crossedRimDescending({ vy: 500, prevY: 199, y: 201 }, rim)).toBe(true);
    expect(crossedRimDescending({ vy: -500, prevY: 201, y: 199 }, rim)).toBe(false);
  });

  test("ignores frames that do not cross the line", () => {
    expect(crossedRimDescending({ vy: 500, prevY: 150, y: 180 }, rim)).toBe(false);
    expect(crossedRimDescending({ vy: 500, prevY: 260, y: 300 }, rim)).toBe(false);
  });
});

describe("isInsideRim", () => {
  test("catches within half a rim either side of the basket", () => {
    expect(isInsideRim(200, 200, 50)).toBe(true);
    expect(isInsideRim(249, 200, 50)).toBe(true);
    expect(isInsideRim(251, 200, 50)).toBe(false);
    expect(isInsideRim(149, 200, 50)).toBe(false);
  });
});

describe("basket movement", () => {
  test("speeds up for the closing sprint", () => {
    expect(basketSpeed(SPRINT_MS + 1)).toBe(BASKET_BASE_SPEED);
    expect(basketSpeed(SPRINT_MS)).toBe(BASKET_SPRINT_SPEED);
    expect(basketSpeed(0)).toBe(BASKET_SPRINT_SPEED);
  });

  test("never sweeps outside the arena", () => {
    const width = 380;
    const limit = width * BASKET_AMPLITUDE_RATIO;

    for (let phase = 0; phase < 20; phase += 0.1) {
      const x = basketCentre(width, phase);
      expect(x).toBeGreaterThanOrEqual(width / 2 - limit - 0.001);
      expect(x).toBeLessThanOrEqual(width / 2 + limit + 0.001);
    }
  });
});

describe("emoji pickers", () => {
  test("pick from their own list", () => {
    for (let i = 0; i < 50; i++) {
      expect(FOODS).toContain(randomFood());
      expect(TARGETS).toContain(randomTarget());
    }
  });

  test("never hand back the emoji already on screen", () => {
    // A repeat would read as nothing having changed, which is the whole point
    // of swapping the face on a hit.
    for (const current of TARGETS) {
      for (let i = 0; i < 40; i++) {
        expect(randomTarget(current)).not.toBe(current);
      }
    }

    for (const current of FOODS) {
      for (let i = 0; i < 40; i++) {
        expect(randomFood(current)).not.toBe(current);
      }
    }
  });

  test("offers a decent spread of distinct faces", () => {
    expect(TARGETS.length).toBeGreaterThan(1);
    expect(new Set(TARGETS).size).toBe(TARGETS.length);
  });
});

describe("toProjectileVelocity", () => {
  test("throws slower than the finger moved", () => {
    const projectile = toProjectileVelocity({ vx: 400, vy: -2000 });

    expect(projectile.vx).toBeCloseTo(400 * THROW_SPEED_SCALE);
    expect(projectile.vy).toBeCloseTo(-2000 * THROW_SPEED_SCALE);
    expect(Math.abs(projectile.vy)).toBeLessThan(2000);
  });

  test("keeps the arc's shape and reach, changing only the pace", () => {
    // Slowing velocity by k and gravity by k squared is an exact time rescale:
    // the path traced is identical, it just takes longer to trace. This guards
    // the pairing of THROW_SPEED_SCALE and GRAVITY against being tuned apart.
    const gesture = { vx: 300, vy: -1800 };
    const scaled = toProjectileVelocity(gesture);

    // Apex height is v^2 / 2g in both cases; the old gravity was 2600.
    const originalApex = (gesture.vy * gesture.vy) / (2 * 2600);
    const scaledApex = (scaled.vy * scaled.vy) / (2 * GRAVITY);

    expect(scaledApex).toBeCloseTo(originalApex, 0);

    // Horizontal reach at apex likewise: vx * (v / g).
    const originalRange = gesture.vx * (-gesture.vy / 2600);
    const scaledRange = scaled.vx * (-scaled.vy / GRAVITY);

    expect(scaledRange).toBeCloseTo(originalRange, 0);
  });
});
