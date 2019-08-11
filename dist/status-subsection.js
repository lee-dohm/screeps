"use strict"

const StatusSection = require("./status-section")

class StatusSubsection extends StatusSection {
  constructor(name) {
    super(name)
  }

  logHeader() {
    console.log(`{bold}----- ${this.name} -----{/bold}`)
  }
}

module.exports = StatusSubsection
