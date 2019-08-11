"use strict"

const CreepsStatusSection = require("./creeps-status-section")
const GlobalStatusSection = require("./global-status-section")
const RoomStatusSection = require("./room-status-section")

class Status {
  constructor() {
    this.sections = []

    this.addSection(new GlobalStatusSection())
    this.addSection(new CreepsStatusSection())

    Object.values(Game.rooms).forEach(room => this.addSection(new RoomStatusSection(room)))
  }

  addSection(section) {
    this.sections.push(section)
  }

  log() {
    this.sections.forEach(section => section.log())
  }
}

module.exports = Status
