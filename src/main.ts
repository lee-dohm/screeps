import * as debug from "./debug"
import * as foreman from "./foreman"

import * as roleBuilder from "./role.builder"
import * as roleHarvester from "./role.harvester"
import * as roleUpgrader from "./role.upgrader"

function loop() {
  debug.log("Start game loop")

  if (!Memory.foreman || Memory.foreman != foreman) {
    Memory.foreman = foreman
  }

  foreman.reclaimDeadCreepMemory()

  foreman.maintainCreeps("builder", 5)
  foreman.maintainCreeps("upgrader", 8)
  foreman.maintainCreeps("harvester", 5)

  for (let name in Game.creeps) {
    let creep = Game.creeps[name]

    if (creep.memory.role == "builder") {
      roleBuilder.run(creep)
    }

    if (creep.memory.role == "harvester") {
      roleHarvester.run(creep)
    }

    if (creep.memory.role == "upgrader") {
      roleUpgrader.run(creep)
    }
  }

  debug.log("Game loop end reached")
  debug.log(
    `${Math.round((Game.cpu.getUsed() / Game.cpu.tickLimit) * 100)}% of available CPU time used`
  )
}

export = { loop }
