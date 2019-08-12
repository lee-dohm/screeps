"use strict"

const HarvestBehavior = require("./harvest-behavior")

class BootstrapHarvestBehavior extends HarvestBehavior {
  constructor(creep) {
    super(creep)
  }

  findNextTarget() {
    const sources = this.creep.room.sources
    const target = this.creep.pos.findClosestByRange(sources)

    return target
  }
}

BootstrapHarvestBehavior.id = "bootstrap harvesting"

module.exports = BootstrapHarvestBehavior
