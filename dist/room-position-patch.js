"use strict"

/**
 * Represents a position within a room.
 *
 * @typedef {Object} RoomPosition
 */

/**
 * Gets the list of adjacent `RoomPosition` objects.
 */
RoomPosition.prototype.getAdjacent = function() {
  const room = Game.rooms[this.roomName]

  return [
    room.getPositionAt(this.x - 1, this.y - 1),
    room.getPositionAt(this.x, this.y - 1),
    room.getPositionAt(this.x + 1, this.y - 1),
    room.getPositionAt(this.x - 1, this.y),
    // room.getPositionAt(this.x, this.y),
    room.getPositionAt(this.x + 1, this.y),
    room.getPositionAt(this.x - 1, this.y + 1),
    room.getPositionAt(this.x, this.y + 1),
    room.getPositionAt(this.x + 1, this.y + 1)
  ]
}

/**
 * Determines whether the position is walkable.
 *
 * A position is walkable if it does not contain a wall.
 */
RoomPosition.prototype.isWalkable = function() {
  return this.lookFor(LOOK_TERRAIN)[0] !== "wall"
}

/**
 * Determines whether the position is occupied.
 *
 * A position is occupied if it contains a creep.
 */
RoomPosition.prototype.isOccupied = function() {
  return this.lookFor(LOOK_CREEPS).length != 0
}
