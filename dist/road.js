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
      (RoomPosition.equals(road.a, other.a) && RoomPosition.equals(road.b, other.b)) ||
      (RoomPosition.equals(road.a, other.b) && RoomPosition.equals(road.b, other.a))
    )
  }

  constructor(a, b) {
    if (!a) {
      throw new Error("`a` must be defined")
    }

    if (!b) {
      throw new Error("`b` must be defined")
    }

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

  toString() {
    return `[Road ${this.a} => ${this.b}]`
  }

  getPosition(obj) {
    if (obj instanceof RoomPosition) {
      return obj
    } else if (obj.pos) {
      return obj.pos
    } else if (obj.x && obj.y && obj.roomName) {
      return new RoomPosition(obj.x, obj.y, obj.roomName)
    } else {
      throw new Error(`Unrecognized position type: ${JSON.stringify(obj)}`)
    }
  }
}

module.exports = Road
