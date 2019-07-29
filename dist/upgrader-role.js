const CreepRole = require("./creep-role")

class UpgraderRole extends CreepRole {
  constructor(creep) {
    super(creep)
  }

  checkMode() {
    if (this.creep.memory.upgrading && this.creep.carry.energy === 0) {
      this.creep.memory.upgrading = false
      this.creep.say("Harvesting")
    }

    if (!this.creep.memory.upgrading && this.creep.carry.energy === this.creep.carryCapacity) {
      this.creep.memory.upgrading = true
      this.creep.say("Upgrading")
    }
  }

  runMode() {
    if (this.creep.memory.upgrading) {
      if (this.creep.room.controller) {
        if (this.creep.upgradeController(this.creep.room.controller) == ERR_NOT_IN_RANGE) {
          this.creep.moveTo(this.creep.room.controller)
        }
      }

      this.indicateTarget(this.creep.room.controller)
    } else {
      const source = this.creep.pos.findClosestByRange(FIND_SOURCES)

      if (source) {
        if (this.creep.harvest(source) == ERR_NOT_IN_RANGE) {
          this.creep.moveTo(source)
        }
      }

      this.indicateTarget(source)
    }
  }
}

module.exports = UpgraderRole
