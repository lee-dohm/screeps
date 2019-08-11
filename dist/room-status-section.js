"use strict"

const ConstructionStatusSubsection = require("./construction-status-subsection")
const MaintenanceStatusSubsection = require("./maintenance-status-subsection")
const StatusSection = require("./status-section")
const { percentage } = require("./utils")

class RoomStatusSection extends StatusSection {
  constructor(room) {
    super(`Room ${room.name}`)

    this.room = room

    this.addEntry(
      `{bold}RCL:{/bold} ${room.controller.level} + ${percentage(
        room.controller.progress,
        room.controller.progressTotal
      )}`
    )
    this.addSubsection(new ConstructionStatusSubsection(room))
    this.addSubsection(new MaintenanceStatusSubsection(room))
  }
}

module.exports = RoomStatusSection
