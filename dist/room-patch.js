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

      return Memory.rooms[this.name] || {}
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
 * Caches the IDs of the `Source` objects in `Memory` on first access. Caches the `Source` objects
 * in temporary memory on first access within a tick.
 */
Object.defineProperty(
  Room.prototype,
  "sources",
  defineProperty({
    get: function() {
      if (!this._sources) {
        let sources

        if (!this.memory.sources) {
          sources = this.find(FIND_SOURCES)
          const sourceIds = sources.map(source => source.id)

          this.memory.sources = sourceIds
        }

        const sourceMap = sources.reduce((source, map) => {
          map[source.id] = source

          return map
        }, {})

        this._sources = sourceMap
      }

      return this._sources
    }
  })
)

Room.prototype.hasFriendlySpawns = function() {
  return this.find(FIND_MY_SPAWNS).length > 0
}
