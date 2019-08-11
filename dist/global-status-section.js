"use strict"

const StatusSection = require("./status-section")
const { percentage } = require("./utils")

class GlobalStatusSection extends StatusSection {
  constructor() {
    super("Global")

    this.addEntry(
      `{bold}GCL:{/bold} ${Game.gcl.level} + ${percentage(
        Game.gcl.progress,
        Game.gcl.progressTotal
      )}`
    )
    this.addEntry(`{bold}Bucket:{/bold} ${percentage(Game.cpu.bucket, 10000)}`)
  }
}

module.exports = GlobalStatusSection
