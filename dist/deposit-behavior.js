"use strict"

const Behavior = require("./behavior")
const debug = require("./debug")
const IdleError = require("./idle-error")

/**
 * Deposits the energy it carries in structures that can use energy.
 */
class DepositBehavior extends Behavior {
  constructor(creep) {
    super(creep)
  }

  /**
   * Returns `true` if the creep is empty.
   */
  isComplete() {
    return this.creep.isEmpty()
  }

  /**
   * Moves to the current target and deposits energy.
   *
   * If there is no target set, it finds the first energy-receiving structure and deposits energy.
   */
  run() {
    if (!this.creep.target) {
      const target = this.findNextTarget()

      if (target) {
        this.creep.target = target
      } else {
        this.fleeSources()
      }
    } else {
      const target = this.creep.target
      const amount = this.depositAmount()

      if (!amount || amount === 0) {
        this.creep.target = this.findNextTarget()
      } else {
        if (this.creep.transfer(target, RESOURCE_ENERGY, amount) == ERR_NOT_IN_RANGE) {
          this.creep.moveTo(target)
        }
      }
    }
  }

  /**
   * Determines the amount of energy to deposit into the target.
   */
  depositAmount() {
    if (this.creep.target) {
      const target = this.creep.target

      return Math.min(target.energyCapacity - target.energy, _.sum(this.creep.carry))
    }
  }

  findNextTarget() {
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

    return this.creep.pos.findClosestByRange(targets)
  }

  fleeSources() {
    const sourcePos = this.creep.room.sources.map(source => source.pos)
    this.creep.flee(sourcePos, 3)
  }
}

DepositBehavior.id = "depositing"

module.exports = DepositBehavior
