const CreepRole = require("./creep-role")
const debug = require("./debug")

class HarvesterRole extends CreepRole {
  constructor(creep) {
    super(creep)
  }

  checkMode() {
    if (this.mode !== "harvesting" && this.creep.carry.energy === 0) {
      this.mode = "harvesting"
      this.creep.say("Harvesting")
    }

    if (this.mode === "harvesting" && this.creep.carry.energy === this.creep.carryCapacity) {
      this.mode = "depositing"
      this.creep.say("Depositing")
    }
  }

  runMode() {
    switch (this.mode) {
      case "harvesting": {
        this.runHarvesting()
        break
      }

      case "depositing": {
        this.runDepositing()
        break
      }

      default: {
        // Convert from old memory style
        if (this.creep.memory.harvesting) {
          this.mode = "harvesting"
        } else {
          this.mode = "depositing"
        }

        delete this.creep.memory.harvesting
        this.run()
        break
      }
    }
  }

  // ----------

  runDepositing() {
    const targets = this.creep.room.find(FIND_STRUCTURES, {
      filter: structure => {
        return (
          (structure.structureType == STRUCTURE_EXTENSION ||
            structure.structureType == STRUCTURE_SPAWN ||
            structure.structureType == STRUCTURE_TOWER) &&
          structure.energy < structure.energyCapacity
        )
      }
    })

    if (targets.length > 0) {
      if (this.creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        this.creep.moveTo(targets[0])
      }
    } else {
      const flags = this.creep.room.find(FIND_FLAGS)

      if (flags.length > 0) {
        this.creep.moveTo(flags[0])
      }
    }
  }

  runHarvesting() {
    const sources = this.creep.room.find(FIND_SOURCES)

    if (this.creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
      this.creep.moveTo(sources[0])
    }
  }
}

module.exports = HarvesterRole