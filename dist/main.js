require("./creep-patch")
require("./room-patch")
require("./room-position-patch")
require("./source-patch")

const foreman = require("./foreman")

function loop() {
  foreman.startShift()

  foreman.reclaimDeadMemory()
  foreman.maintainHarvesters()
  foreman.manageCreeps()
  foreman.visualizeCreeps()

  foreman.endShift()
}

module.exports = { loop }
