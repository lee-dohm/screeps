"use strict"

const defineProperty = require("./define-property")

/**
 * Represents a position within a room.
 *
 * @typedef {Object} RoomPosition
 */

Object.defineProperty(
  RoomPosition.prototype,
  "constructionSites",
  defineProperty({
    get: function() {
      if (!this._constructionSites) {
        this._constructionSites = this.lookFor(LOOK_CONSTRUCTION_SITES)
      }

      return this._constructionSites
    }
  })
)

Object.defineProperty(
  RoomPosition.prototype,
  "structures",
  defineProperty({
    get: function() {
      if (!this._structures) {
        this._structures = this.lookFor(LOOK_STRUCTURES)
      }

      return this._structures
    }
  })
)

Object.defineProperty(
  RoomPosition.prototype,
  "terrain",
  defineProperty({
    get: function() {
      if (!this._terrain) {
        this._terrain = this.lookFor(LOOK_TERRAIN)[0]
      }

      return this._terrain
    }
  })
)

RoomPosition.equals = function(posA, posB) {
  return posA.x === posB.x && posA.y === posB.y && posA.roomName === posB.roomName
}

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
 * A position is walkable if it does not contain one of the many obstruction types.
 */
RoomPosition.prototype.isWalkable = function() {
  const contents = this.look()
  const found = contents.find(obj => {
    return (
      (obj.type == LOOK_STRUCTURES &&
        (obj.structure.structureType == STRUCTURE_SPAWN ||
          obj.structure.structureType == STRUCTURE_CONTROLLER ||
          obj.structure.structureType == STRUCTURE_WALL ||
          obj.structure.structureType == STRUCTURE_EXTENSION ||
          obj.structure.structureType == STRUCTURE_LINK ||
          obj.structure.structureType == STRUCTURE_STORAGE ||
          obj.structure.structureType == STRUCTURE_TOWER ||
          obj.structure.structureType == STRUCTURE_OBSERVER ||
          obj.structure.structureType == STRUCTURE_POWER_SPAWN ||
          obj.structure.structureType == STRUCTURE_POWER_BANK ||
          obj.structure.structureType == STRUCTURE_LAB ||
          obj.structure.structureType == STRUCTURE_TERMINAL ||
          obj.structure.structureType == STRUCTURE_NUKER)) ||
      obj.type == LOOK_SOURCES ||
      obj.type == LOOK_MINERALS ||
      (obj.type == LOOK_TERRAIN && obj.terrain == "wall")
    )
  })

  return !found
}

/**
 * Determines whether the position is occupied.
 *
 * A position is occupied if it contains a creep.
 */
RoomPosition.prototype.isOccupied = function() {
  return this.lookFor(LOOK_CREEPS).length != 0
}

/**
 * Gets the `RoomPosition` at the relative position to this one.
 */
RoomPosition.prototype.getRelative = function(dx, dy) {
  return this.room.getPositionAt(this.x + dx, this.y + dy)
}
