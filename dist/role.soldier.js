class Soldier {
  run (creep) {
    let target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS)

    if (target) {
      if (creep.attack(target) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target)
      }
    } else {
      let targets = creep.room.find(FIND_FLAGS)

      creep.moveTo(targets[0])
    }
  }
}

module.exports = new Soldier()
