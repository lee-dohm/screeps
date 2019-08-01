require("./creep-patch")
require("./room-patch")
require("./room-position-patch")
require("./source-patch")

const buildCreep = require("./creep-factory")
const debug = require("./debug")
const foreman = require("./foreman-plus")

function loop() {
  debug.log("Start game loop")

  foreman.install()
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

  debug.log("Game loop end reached")
  debug.logStats()
}

module.exports = { loop }
