require("./creep-patch")
require("./room-position-patch")

const buildCreep = require("./creep-factory")
const debug = require("./debug")
const foreman = require("./foreman")

function loop() {
  debug.log("Start game loop")

  if (!Memory.foreman || Memory.foreman != foreman) {
    Memory.foreman = foreman
  }

  foreman.reclaimDeadCreepMemory()

  foreman.maintainCreeps("builder", 3)
  foreman.maintainCreeps("upgrader", 3)
  foreman.maintainCreeps("harvester", 3)

  for (let name in Game.creeps) {
    try {
      const creepRole = buildCreep(name)

      if (creepRole) {
        creepRole.run()
      }
    } catch (e) {
      console.log(`Exception caught: ${e.message}`)
      console.log(e.stack)
    }
  }

  debug.log("Game loop end reached")
  debug.logStats()
}

module.exports = { loop }
