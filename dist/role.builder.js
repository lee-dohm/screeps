function run(creep) {
  if (creep.memory.building && creep.carry.energy === 0) {
    creep.memory.building = false
    creep.say("Harvesting")
  }

  if (!creep.memory.building && creep.carry.energy === creep.carryCapacity) {
    creep.memory.building = true
    creep.say("Building")
  }

  if (creep.memory.building) {
    let target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES)

    if (target) {
      if (creep.build(target) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target)
      }
    }
  } else {
    let source = creep.pos.findClosestByRange(FIND_SOURCES)

    if (source) {
      if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
        creep.moveTo(source)
      }
    }
  }
}

module.exports = { run }
