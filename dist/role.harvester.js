var roleHarvester = {
  /** @param {Creep} creep **/
  run: function (creep) {
    if (!creep.memory.harvesting && creep.carry.energy == 0) {
      creep.memory.harvesting = true
      creep.say('harvesting')
    }

    if (creep.memory.harvesting && creep.carry.energy == creep.carryCapacity) {
      creep.memory.harvesting = false
      creep.say('depositing')
    }

    if (creep.memory.harvesting) {
      let sources = creep.room.find(FIND_SOURCES)

      if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
        creep.room.createConstructionSite(creep.pos, STRUCTURE_ROAD)
        creep.moveTo(sources[0])
      }
    } else {
      let targets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
          return (structure.structureType == STRUCTURE_EXTENSION ||
                  structure.structureType == STRUCTURE_SPAWN ||
                  structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity
        }
      })

      if (targets.length > 0) {
        if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.room.createConstructionSite(creep.pos, STRUCTURE_ROAD)
          creep.moveTo(targets[0])
        }
      } else {
        let flags = creep.room.find(FIND_FLAGS)

        if (flags.length > 0) {
          creep.moveTo(flags[0])
        }
      }
    }
  }
}

module.exports = roleHarvester;
