function costCallback(roomName, matrix) {
  const room = Game.rooms[roomName]

  room
    .find(FIND_STRUCTURES, {
      filter: struct => OBSTACLE_OBJECT_TYPES.includes(struct.structureType)
    })
    .map(struct => struct.pos)
    .forEach(pos => {
      matrix.set(pos.x, pos.y, 0xff)
    })

  return matrix
}

/**
 * Represents a road from point `a` to point `b`.
 */
class Road {
  /**
   * Converts the serialized form back into a `Road` object.
   */
  static deserialize(obj) {
    let road = new Road(obj.a, obj.b)

    if (obj.path) {
      road.path = Room.deserializePath(obj.path)
      road.plottedAt = obj.plottedAt
    }

    if (obj.paved) {
      road.paved = true
    }

    return road
  }

  static equals(road, other) {
    return (
      (_.isEqual(road.a, other.a) && _is.Equal(road.b, other.b)) ||
      (_.isEqual(road.a, other.b) && _is.Equal(road.b, other.a))
    )
  }

  constructor(a, b) {
    this.a = this.getPosition(a)
    this.b = this.getPosition(b)
  }

  /**
   * Determines how long ago the road was plotted.
   *
   * Over time, a road may need to be replotted due to new structures being built or other changes
   * occurring. This function gives an idea of how long it has been since the road was mapped out.
   */
  getPlotAge() {
    if (this.isPlotted()) {
      return Game.time - this.plottedAt
    }
  }

  /**
   * Determines if the road has been scheduled for paving.
   */
  isPaved() {
    return this.paved
  }

  /**
   * Determines if the road has been plotted out.
   */
  isPlotted() {
    return this.path
  }

  /**
   * Plots the road from point `a` to point `b`.
   *
   * ## Options
   *
   * * `force` - If `true`, the road will be replotted even if it is already mapped out.
   */
  plot(opts = {}) {
    if (opts.force || !this.isPlotted()) {
      const room = Game.rooms[this.a.roomName]

      PathFinder.use(true)
      this.path = room.findPath(this.a, this.b, {
        ignoreCreeps: true,
        ignoreRoads: true,
        costCallback: costCallback,
        range: 1,
        swampCost: 1
      })

      this.plottedAt = Game.time
    }

    return this.path
  }

  /**
   * Create construction sites to pave the road.
   */
  pave() {
    if (!this.isPlotted()) {
      this.plot()
    }

    this.path.forEach(pos => {
      if (pos.terrain === "swamp") {
        pos.createConstructionSite(STRUCTURE_ROAD)
      }
    })

    this.paved = true
  }

  /**
   * Serialize this road into a more compact form suitable for storage in `Memory`.
   */
  serialize() {
    return {
      a: this.a,
      b: this.b,
      path: this.path ? Room.serializePath(this.path) : undefined,
      paved: this.paved,
      plottedAt: this.plottedAt
    }
  }

  getPosition(obj) {
    return obj instanceof RoomPosition ? obj : obj.pos
  }
}

module.exports = Road
