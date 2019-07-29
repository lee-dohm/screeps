const CreepRole = require("./creep-role")

class BuilderRole extends CreepRole {
  constructor(creep) {
    super(creep)
  }

  checkMode() {
    if (this.mode !== "building" && this.creep.carry.energy === this.creep.carryCapacity) {
      this.startBuilding()
    }

    if (this.mode === "building" && this.creep.carry.energy === 0) {
      this.startHarvesting()
    }
  }

  runMode() {
    switch (this.mode) {
      case "harvesting": {
        this.runHarvesting()
        break
      }

      case "building": {
        this.runBuilding()
        break
      }

      default: {
        console.log(`ERROR: Unknown mode ${this.mode}, defaulting to harvesting`)
        this.startHarvesting()
        break
      }
    }
  }

  findNextConstructionSite() {
    const target = this.creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES, {
      filter: structure => {
        return this.creep.pos.getRangeTo(structure) >= 3
      }
    })

    this.setTarget(target)

    return target
  }

  findNextSource() {
    const target = this.creep.pos.findClosestByRange(FIND_SOURCES)
    this.setTarget(target)

    return target
  }

  startBuilding() {
    this.setMode("building")
    this.findNextConstructionSite()
  }

  startHarvesting() {
    this.setMode("harvesting")
    this.findNextSource()
  }

  runBuilding() {
    const target = this.getTarget()
    const site = target ? target : this.findNextConstructionSite()

    if (site) {
      this.actOrMoveCloser(site, target => {
        return this.creep.build(target)
      })
    }

    this.indicateTarget(site)
  }

  runHarvesting() {
    const target = this.getTarget()
    const source = target ? target : this.findNextSource()

    if (source) {
      this.actOrMoveCloser(source, target => {
        return this.creep.harvest(target)
      })
    }

    this.indicateTarget(source)
  }
}

module.exports = BuilderRole
