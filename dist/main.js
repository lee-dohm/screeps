const buildCreep = require("./creep-factory")
const debug = require("./debug")
const foreman = require("./foreman")
const roleBuilder = require("./role.builder")
const roleUpgrader = require("./role.upgrader")

function loop() {
  debug.log("Start game loop")

  if (!Memory.foreman || Memory.foreman != foreman) {
    Memory.foreman = foreman
  }

  foreman.reclaimDeadCreepMemory()

  foreman.maintainCreeps("builder", 5)
  foreman.maintainCreeps("upgrader", 5)
  foreman.maintainCreeps("harvester", 5)

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
