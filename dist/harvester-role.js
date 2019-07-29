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
      this.setTarget(this.findNextSource())
    }

    if (this.mode === "harvesting" && this.creep.carry.energy === this.creep.carryCapacity) {
      this.mode = "depositing"
      this.creep.say("Depositing")
      this.setTarget(this.findNextEnergyStructure())
    }
  }

  findNextEnergyStructure() {
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

    const highestEnergyDeficit = targets
      .sort((a, b) => {
        return a.energyCapacity - a.energy - (b.energyCapaticy - b.energy)
      })
      .pop()

    return highestEnergyDeficit
  }

  findNextSource() {
    const sources = this.creep.room.find(FIND_SOURCES)

    return sources[0]
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
    const target = this.getTarget()

    if (target && target.energy < target.energyCapacity) {
      this.actOrMoveCloser(target, target => this.creep.transfer(target, RESOURCE_ENERGY))
      this.indicateTarget()
    } else {
      this.setTarget(this.findNextEnergyStructure())
    }

    this.markSwampForPaving()
  }

  runHarvesting() {
    const target = this.getTarget()

    if (target) {
      this.actOrMoveCloser(target, target => this.creep.harvest(target))
      this.indicateTarget()
    } else {
      this.setTarget(this.findNextSource())
    }

    this.markSwampForPaving()
  }
}

module.exports = HarvesterRole
