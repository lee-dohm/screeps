RoomPosition.prototype.getAdjacent = function() {
  const room = Game.rooms[this.roomName]

  return [
    room.getPositionAt(this.x - 1, this.y - 1),
    room.getPositionAt(this.x, this.y - 1),
    room.getPositionAt(this.x + 1, this.y - 1),
    room.getPositionAt(this.x - 1, this.y),
    // room.getPositionAt(this.x, this.y),
    room.getPositionAt(this.x + 1, this.y),
    room.getPositionAt(this.x - 1, this.y + 1),
    room.getPositionAt(this.x, this.y + 1),
    room.getPositionAt(this.x + 1, this.y + 1)
  ]
}

RoomPosition.prototype.isWalkable = function() {
  return this.lookFor(LOOK_TERRAIN)[0] !== "wall"
}

RoomPosition.prototype.isOccupied = function() {
  return this.lookFor(LOOK_CREEPS).length != 0
}
