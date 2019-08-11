"use strict"

const StatusSection = require("./status-section")

class CreepsStatusSection extends StatusSection {
  constructor() {
    super("Creeps")

    const creeps = Object.values(Game.creeps).sort((a, b) => (a.name < b.name ? -1 : 1))
    creeps.forEach(creep => this.addEntry(creep.status))
  }
}

module.exports = CreepsStatusSection
