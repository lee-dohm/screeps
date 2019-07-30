/**
 * Gets the room positions that are adjacent to the given room position.
 */
function getAdjacent(pos) {
  const room = Game.rooms[pos.roomName]

  return [
    room.getPositionAt(pos.x - 1, pos.y - 1),
    room.getPositionAt(pos.x, pos.y - 1),
    room.getPositionAt(pos.x + 1, pos.y - 1),
    room.getPositionAt(pos.x - 1, pos.y),
    // room.getPositionAt(pos.x, pos.y),
    room.getPositionAt(pos.x + 1, pos.y),
    room.getPositionAt(pos.x - 1, pos.y + 1),
    room.getPositionAt(pos.x, pos.y + 1),
    room.getPositionAt(pos.x + 1, pos.y + 1)
  ]
}

/**
 * Indicates whether a creep can occupy the given room position.
 */
function isWalkable(pos) {
  return pos.lookFor(LOOK_TERRAIN)[0] !== "wall"
}

/**
 * Indicates whether a creep is occupying the given room position.
 */
function isOccupied(pos) {
  return pos.lookFor(LOOK_CREEPS).length != 0
}

module.exports = {
  getAdjacent,
  isWalkable,
  isOccupied
}
