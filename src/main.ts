console.log('Import code')

import * as foreman from "./foreman"

import * as roleBuilder from "./role.builder"
import * as roleHarvester from "./role.harvester"
import * as roleUpgrader from "./role.upgrader"

console.log('Done importing code')

function loop() {
  console.log('Start loop')

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
}

export = { loop }
