"use strict"

const StatusSubsection = require("./status-subsection")
const { percentage } = require("./utils")

class MaintenanceStatusSubsection extends StatusSubsection {
  constructor(room) {
    super("Maintenance")

    const structures = room.find(FIND_STRUCTURES, {
      filter: struct => struct.hits < struct.hitsMax
    })

    structures.forEach(struct => this.addEntry(struct))
  }

  addEntry(struct) {
    super.addEntry(`${struct} ${percentage(struct.hits, struct.hitsMax)}`)
  }

  log() {
    if (this.entries.length > 0) {
      super.log()
    }
  }
}

module.exports = MaintenanceStatusSubsection
