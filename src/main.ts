import foreman from "./foreman"

import roleBuilder from "./role.builder"
import roleHarvester from "./role.harvester"
import roleUpgrader from "./role.upgrader"

let loop = function() {
  if (!Memory.foreman || Memory.foreman != foreman) {
    Memory.foreman = foreman
  }

  foreman.deleteDeadCreeps()

  foreman.createCreep("builder", 5)
  foreman.createCreep("upgrader", 8)
  foreman.createCreep("harvester", 5)

  for (let name in Game.rooms) {
    let room = Game.rooms[name]

    foreman.supervise(room)
  }

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

export default loop
