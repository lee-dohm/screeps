const CreepRole = require("./creep-role")

class BuilderRole extends CreepRole {
  constructor(creep) {
    super(creep)
  }

  checkMode() {
    if (this.mode === "harvesting" && this.creep.carry.energy === 0) {
      this.mode = "building"
      this.creep.say("Building")
    }

    if (this.mode === "building" && this.creep.carry.energy === this.creep.carryCapacity) {
      this.mode = "harvesting"
      this.creep.say("Harvesting")
    }
  }

  runMode() {
    switch (this.mode) {
      case "harvesting": {
        let source = creep.pos.findClosestByRange(FIND_SOURCES)

        if (source) {
          if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source)
          }
        }

        break
      }

      case "building": {
        let target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES)

        if (target) {
          if (creep.build(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target)
          }
        }

        break
      }

      default: {
        if (this.creep.memory.building) {
          this.mode = "building"
        } else {
          this.mode = "harvesting"
        }

        delete this.creep.memory.building
        this.run()
        break
      }
    }
  }
}
