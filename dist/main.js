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
    foreman.maintainHarvesters()
    foreman.manageCreeps()
    foreman.visualizeCreeps()
  } catch (e) {
    debug.logException(e)
  }

  foreman.endShift()
}

module.exports = { loop }
