/**
 * Formats `current` and `max` as a percentage.
 */
function percentage(current, max) {
  return `${Math.floor((current / max) * 100)}%`
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

module.exports = { percentage, toPos }
