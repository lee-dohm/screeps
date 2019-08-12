"use strict"

require("./construction-site-patch")
require("./creep-patch")
require("./room-patch")
require("./room-position-patch")
require("./source-patch")

const debug = require("./debug")
const foreman = require("./foreman")

function loop() {
  foreman.startShift()

  try {
    foreman.reclaimDeadMemory()

    foreman.maintainCreeps()
    foreman.handleHostiles()

    foreman.plotExitWalls()
    foreman.plotExtensions()
    foreman.plotRoads()
    foreman.paveHarvestablePositions()
    foreman.paveAroundExtensions()

    foreman.manageCreeps()
    foreman.visualizeCreeps()
  } catch (e) {
    debug.logException(e)
  }

  foreman.endShift()
}

module.exports = { loop }
