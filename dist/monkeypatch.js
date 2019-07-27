Room.prototype.lookForAround = function (what, x, y, distance) {
  let top = y - distance
  let left = x - distance
  let bottom = y + distance
  let right = x + distance

  return this.lookForAtArea(what, top, left, bottom, right, true)
}

Room.prototype.lookForEmptyTerrainAround = function (x, y, distance) {
  let top = y - distance
  let left = x - distance
  let bottom = y + distance
  let right = x + distance

  let spaces = this.lookAtArea(top, left, bottom, right, true)

  return _.filter(spaces, (space) => {
    if (space.type == 'terrain' && this.lookAt(space.x, space.y).length == 1) {
      return true
    }
  })
}
