export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export const randomBetween = (min, max) => min + Math.random() * (max - min);

export const randomInt = (min, max) =>
  Math.floor(randomBetween(min, max + 1));

export const pickOne = (values) => values[randomInt(0, values.length - 1)];

export const driftTowards = (current, target, strength = 0.35) =>
  current + (target - current) * strength;

export const createTimestamp = () => new Date().toISOString();
