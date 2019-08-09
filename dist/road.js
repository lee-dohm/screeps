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

class Road {
  static deserialize(obj) {
    let road = new Road(obj.a, obj.b)

    if (obj.path) {
      road.path = Room.deserializePath(obj.path)
    }

    if (obj.paved) {
      road.paved = true
    }

    return road
  }

  constructor(a, b) {
    this.a = this.getPosition(a)
    this.b = this.getPosition(b)
  }

  plot() {
    if (!this.path) {
      const room = Game.rooms[this.a.roomName]

      PathFinder.use(true)
      this.path = room.findPath(this.a, this.b, {
        ignoreCreeps: true,
        ignoreRoads: true,
        costCallback: costCallback,
        range: 1,
        swampCost: 1
      })
    }

    return this.path
  }

  pave() {
    if (!this.path) {
      this.plot()
    }

    this.path.forEach(pos => {
      if (pos.lookFor(LOOK_TERRAIN)[0] === "swamp") {
        pos.createConstructionSite(STRUCTURE_ROAD)
      }
    })

    this.paved = true
  }

  serialize() {
    return {
      a: this.a,
      b: this.b,
      path: this.path ? Room.serializePath(this.path) : undefined,
      paved: this.paved
    }
  }

  getPosition(obj) {
    return obj instanceof RoomPosition ? obj : obj.pos
  }
}

module.exports = Road
