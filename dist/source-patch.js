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
