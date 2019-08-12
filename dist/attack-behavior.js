const Behavior = require("./behavior")

class AttackBehavior extends Behavior {
  constructor(creep) {
    super(creep)
  }

  isComplete() {
    return false
  }

  run() {
    if (!this.creep.target) {
      this.creep.target = this.findNextTarget()
    } else {
      if (this.creep.attack(this.creep.target) == ERR_NOT_IN_RANGE) {
        this.creep.moveTo(this.creep.target)
      }
    }
  }

  findNextTarget() {
    const hostileCreep = this.creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS)

    if (hostileCreep) {
      return hostileCreep
    }

    const hostileStructure = this.creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES)

    if (hostileStructure) {
      return hostileStructure
    }

    const hostileConstructionSite = this.creep.pos.findClosestByRange(
      FIND_HOSTILE_CONSTRUCTION_SITES
    )

    if (hostileConstructionSite) {
      return hostileConstructionSite
    }
  }
}

AttackBehavior.id = "attacking"

module.exports = AttackBehavior
