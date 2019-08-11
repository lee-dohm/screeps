"use strict"

const StatusSubsection = require("./status-subsection")
const { percentage } = require("./utils")

class ConstructionStatusSubsection extends StatusSubsection {
  constructor(room) {
    super("Construction")

    const sites = room.find(FIND_MY_CONSTRUCTION_SITES)
    sites.forEach(site => this.addEntry(site))
  }

  addEntry(site) {
    super.addEntry(site.status)
  }

  log() {
    if (this.entries.length > 0) {
      super.log()
    }
  }
}

module.exports = ConstructionStatusSubsection
