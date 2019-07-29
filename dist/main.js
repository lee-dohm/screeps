const buildCreep = require("./creep-factory")
const debug = require("./debug")
const foreman = require("./foreman")
const roleUpgrader = require("./role.upgrader")

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
    let creep = Game.creeps[name]

    if (creep.memory.role == "upgrader") {
      roleUpgrader.run(creep)
    } else {
      const creepRole = buildCreep(name)

      if (creepRole) {
        creepRole.run()
      }
    }
  }

  debug.log("Game loop end reached")
  debug.logStats()
}

module.exports = { loop }
