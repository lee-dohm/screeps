require("./creep-patch")
require("./room-patch")
require("./room-position-patch")
require("./source-patch")

const buildCreep = require("./creep-factory")
const foreman = require("./foreman")

function loop() {
  foreman.startShift()

  foreman.reclaimDeadMemory()

  for (let name in Game.creeps) {
    try {
      const creep = buildCreep(name)

      if (creep) {
        creep.run()
      }
    } catch (e) {
      const message = `ERROR: ${e.message}\n${e.stack}`

      console.log(message)
      Game.notify(message)
    }
  }

  foreman.endShift()
}

module.exports = { loop }
