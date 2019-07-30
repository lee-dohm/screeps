const position = require("./position")

/**
 * Manages the harvesting of a `Source`.
 */
class SourceManager {
  constructor(source) {
    this.source = source
  }

  /**
   * Calculates the maximum number of creeps that can harvest this source at once.
   */
  getHarvesterCapacity() {
    this.getAdjacentPositions().length
  }

  /**
   * Calculates the room positions that are adjacent to the source.
   */
  getAdjacentPositions() {
    return position.getAdjacent(this.source.pos)
  }

  /**
   * Calculates the room positions that can be used to harvest the source.
   */
  getHarvestablePositions() {
    return this.getAdjacentPositions().filter(pos => position.isWalkable(pos))
  }

  /**
   * Calculates the room positions that can be used to harvest the source that are currently
   * unoccupied.
   */
  getOpenPositions() {
    return this.getHarvestablePositions().filter(pos => !position.isOccupied(pos))
  }
}

module.exports = SourceManager
