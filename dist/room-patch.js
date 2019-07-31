const defineProperty = require("./define-property")

/**
 * Adds `memory` property to `Room` objects.
 */
Object.defineProperty(
  Room.prototype,
  "memory",
  defineProperty({
    get: function() {
      if (!Memory.rooms) {
        Memory.rooms = {}
      }

      if (!_.isObject(Memory.rooms)) {
        return undefined
      }

      return (Memory.rooms[this.name] = Memory.rooms[this.name] || {})
    },

    set: function(value) {
      if (!Memory.rooms) {
        Memory.rooms = {}
      }

      if (!_.isObject(Memory.rooms)) {
        throw new Error("Could not set room memory")
      }

      Memory.rooms[this.name] = value
    }
  })
)

/**
 * Adds a `sources` property to `Room` objects that returns the list of sources in the room.
 *
 * Caches the IDs of the source objects on first access.
 */
Object.defineProperty(Room.prototype, "sources", defineProperty({
  get: function() {
    if (!this._sources) {
      if (!this.memory.sources) {
        const sourceIds = this.find(FIND_SOURCES).map(source => source.id)

        this.memory.sources = sourceIds
      }

      const sources = this.memory.sources.map(id => Game.getObjectById(id))

      this._sources = sources
    }

    return this._sources
  }
}))

Room.prototype.hasFriendlySpawns = function() {
  return this.find(FIND_MY_SPAWNS).length > 0
}
