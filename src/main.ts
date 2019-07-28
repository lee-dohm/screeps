import * as debug from "./debug"
import * as foreman from "./foreman"

import * as roleBuilder from "./role.builder"
import * as roleUpgrader from "./role.upgrader"

import buildCreep from "./creep-factory"

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

    if (creep.memory.role == "builder") {
      roleBuilder.run(creep)
    } else if (creep.memory.role == "upgrader") {
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

export = { loop }
