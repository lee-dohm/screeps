function run(creep) {
  if (creep.memory.upgrading && creep.carry.energy === 0) {
    creep.memory.upgrading = false
    creep.say("Harvesting")
  }

  if (!creep.memory.upgrading && creep.carry.energy === creep.carryCapacity) {
    creep.memory.upgrading = true
    creep.say("Upgrading")
  }

  if (creep.memory.upgrading) {
    if (creep.room.controller) {
      if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller)
      }
    }
  } else {
    var source = creep.pos.findClosestByRange(FIND_SOURCES)

    if (source) {
      if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
        creep.moveTo(source)
      }
    }
  }
}

module.exports = { run }
