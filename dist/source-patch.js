"use strict"

const defineProperty = require("./define-property")

/**
 * Adds `memory` property to `Source` objects.
 */
Object.defineProperty(
  Source.prototype,
  "memory",
  defineProperty({
    get: function() {
      if (!Memory.sources) {
        Memory.sources = {}
      }

      if (!_.isObject(Memory.sources)) {
        return undefined
      }

      return (Memory.sources[this.id] = Memory.sources[this.id] || {})
    },

    set: function(value) {
      if (!Memory.sources) {
        Memory.sources = {}
      }

      if (!_.isObject(Memory.sources)) {
        throw new Error("Could not set source memory")
      }

      Memory.sources[this.id] = value
    }
  })
)

Object.defineProperty(
  Source.prototype,
  "harvesters",
  defineProperty({
    get: function() {
      if (!this._harvesters) {
        if (!this.memory.harvesters) {
          this.memory.harvesters = {}
        }

        this._harvesters = this.memory.harvesters
      }

      return this._harvesters
    }
  })
)

Object.defineProperty(
  Source.prototype,
  "harvestablePositionCount",
  defineProperty({
    get: function() {
      if (!this._harvestablePositionCount) {
        if (!this.memory.harvestablePositionCount) {
          const count = this.getHarvestablePositions().length

          this.memory.harvestablePositionCount = count
        }

        this._harvestablePositionCount = this.memory.harvestablePositionCount
      }

      return this._harvestablePositionCount
    }
  })
)

Source.prototype.assignHarvester = function(harvesterOrName, pos) {
  const harvester =
    harvesterOrName instanceof HarvesterCreep ? harvesterOrName : Game.creeps[harvesterOrName]

  this.harvesters[harvester.name] = { x: pos.x, y: pos.y }
}

/**
 * Gets the room positions adjacent to the source that are walkable.
 */
Source.prototype.getHarvestablePositions = function() {
  return this.pos.getAdjacent().filter(pos => pos.isWalkable())
}

/**
 * Gets the room positions adjacent to the source that are walkable and do not have a creep in them.
 */
Source.prototype.getOpenPositions = function() {
  return this.pos.getAdjacent().filter(pos => pos.isWalkable() && !pos.isOccupied())
}

Source.prototype.unassignHarvester = function(harvesterOrName) {
  const harvester =
    harvesterOrName instanceof HarvesterCreep ? harvesterOrName : Game.creeps[harvesterOrName]

  delete this.harvesters[harvester.name]
}
