const defineProperty = require("./define-property")

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
        if (!this.memory.sources) {
          const sources = this.find(FIND_SOURCES)
          const sourceIds = sources.map(source => source.id)

          this.memory.sources = sourceIds
        }

        const sourceMap = this.memory.sources.reduce((map, sourceId) => {
          map[sourceId] = Game.getObjectById(sourceId)

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
