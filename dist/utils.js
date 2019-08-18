"use strict"

/**
 * Returns the midpoint between the two `RoomPosition` objects.
 */
function midPoint(a, b) {
  if (a.roomName !== b.roomName) {
    return null
  }

  return new RoomPosition(Math.floor((a.x + b.x) / 2), Math.floor((a.y + b.y) / 2), a.roomName)
}

/**
 * Returns the opposite of the given `direction`.
 */
function oppositeDirection(direction) {
  return rotateClockwise(direction, 4)
}

/**
 * Formats `current` and `max` as a percentage.
 */
function percentage(current, max) {
  return `${Math.round((current / max) * 1000) / 10}%`
}

/**
 * Picks a random item from the array and returns it.
 */
function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)]
}

/**
 * Rotates the given `direction` clockwise by `steps`.
 *
 * Each step rotates the direction 45 degrees and the default number of steps rotates the direction
 * by 90 degrees.
 */
function rotateClockwise(direction, steps = 2) {
  return ((direction - 1 + steps) % 8) + 1
}

/**
 * Rotates the given `direction` counterclockwise by `steps`.
 *
 * Each step rotates the direction 45 degrees and the default number of steps rotates the direction
 * by 90 degrees.
 */
function rotateCounterClockwise(direction, steps = 2) {
  return ((direction - 1 + 8 - steps) % 8) + 1
}

/**
 * Returns a `RoomPosition` if the given object is a `RoomPosition`, has a `RoomPosition`, or is
 * convertible to one.
 */
function toPos(obj) {
  if (obj instanceof RoomPosition) {
    return obj
  } else if (obj.pos) {
    return obj.pos
  } else if (obj.x && obj.y && obj.roomName) {
    return new RoomPosition(obj.x, obj.y, obj.roomName)
  } else {
    throw new Error(`Unrecognized position type: ${JSON.stringify(obj)}`)
  }
}

module.exports = {
  midPoint,
  oppositeDirection,
  percentage,
  randomItem,
  rotateClockwise,
  rotateCounterClockwise,
  toPos
}
