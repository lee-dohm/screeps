const CreepRole = require("./creep-role")
const debug = require("./debug")
const { energyDeficit } = require("./utility")

class HarvesterRole extends CreepRole {
  constructor(creep) {
    super(creep)
  }

  checkMode() {
    if (this.mode !== "harvesting" && this.creep.carry.energy === 0) {
      this.setMode("harvesting")
      this.setTarget(this.findNextSource())
    }

    if (this.mode === "harvesting" && this.creep.carry.energy === this.creep.carryCapacity) {
      this.setMode("depositing")
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

    const highestEnergyDeficit = targets.sort((a, b) => energyDeficit(b) - energyDeficit(a)).pop()

    return highestEnergyDeficit
  }

  findNextSource() {
    const sources = this.creep.room.find(FIND_SOURCES)

    return this.creep.pos.findClosestByPath(sources)
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
        console.log(`ERROR ${this.creep.name}: Unknown mode ${this.mode}, defaulting to harvesting`)
        this.setMode("harvesting")
        break
      }
    }
  }

  // ----------

  runDepositing() {
    const target = this.getTarget()

    if (target && target.energy < target.energyCapacity) {
      const amount = energyDeficit(target)
      this.actOrMoveCloser(target, target => this.creep.transfer(target, RESOURCE_ENERGY, amount))
      this.indicateTarget()
    } else {
      this.setTarget(this.findNextEnergyStructure())
      this.runDepositing()
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
