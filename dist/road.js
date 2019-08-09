function getCostMatrix(roomName) {
  let matrix = new PathFinder.CostMatrix()
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
  constructor(a, b) {
    this.a = this.getPosition(a)
    this.b = this.getPosition(b)
  }

  plot() {
    if (!this.path) {
      const result = PathFinder.search(
        this.a,
        { pos: this.b, range: 1 },
        { roomCallback: getCostMatrix, swampCost: 1 }
      )

      this.path = result.path
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
  }

  getPosition(obj) {
    return obj instanceof RoomPosition ? obj : obj.pos
  }
}

module.exports = Road
