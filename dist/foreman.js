const bodyForRole = {
  builder: [[CARRY, WORK, MOVE]],
  harvester: [
    [CARRY, WORK, MOVE],
    [CARRY, WORK, WORK, MOVE],
    [CARRY, WORK, WORK, WORK, WORK, MOVE, MOVE]
  ],
  soldier: [[ATTACK, ATTACK, MOVE, MOVE]],
  upgrader: [[CARRY, WORK, MOVE]]
}

const costForPart = {
  move: 50,
  work: 100,
  carry: 50,
  attack: 80,
  ranged_attack: 150,
  heal: 250,
  claim: 600,
  tough: 10
}

// ***** Exported functions *****

function killAllCreeps() {
  for (const name in Game.creeps) {
    Game.creeps[name].suicide()
  }
}

function listCreeps(role) {
  let creeps

  if (role) {
    creeps = filterCreeps(creep => creep.memory.role === role)
  } else {
    creeps = filterCreeps(creep => true)
  }

  const names = creeps.map(creep => creep.name).sort()

  for (const name of names) {
    console.log(`Creep: ${name}`)
  }
}

function maintainCreeps(role, count) {
  debug.log(`Keep number of ${role} creeps at or above ${count}`)

  const spawn = Game.spawns["Spawn1"]

  if (!spawn.spawning) {
    const body = getBestBodyForRole(spawn, role)

    if (body) {
      if (canSpawnCreep(spawn, body)) {
        const creeps = filterCreeps(creep => creep.memory.role === role)

        if (creeps.length < count) {
          spawnCreep(spawn, body, role)
        }
      }
    }
  }
}

function reclaimDeadCreepMemory() {
  debug.log("Reclaim dead creep memory")

  for (let name in Memory.creeps) {
    if (!Game.creeps[name]) {
      debug.log(`Delete dead creep from memory: ${name}`)
      delete Memory.creeps[name]
    }
  }
}

function removeConstructionSites(room, type) {
  let sites

  if (type) {
    sites = room.find(FIND_CONSTRUCTION_SITES, {
      filter: structure => {
        return structure.structureType == type
      }
    })
  } else {
    sites = room.find(FIND_CONSTRUCTION_SITES)
  }

  for (const site of sites) {
    site.remove()
  }
}

// ***** Private functions *****

function canSpawnCreep(spawn, body) {
  return spawn.spawnCreep(body, "canSpawnCreep", { dryRun: true }) === OK
}

function filterCreeps(fn) {
  let creeps = []

  for (const name in Game.creeps) {
    if (fn(Game.creeps[name])) {
      creeps.push(Game.creeps[name])
    }
  }

  return creeps
}

function generateCreepName(role) {
  return `${role} ${Game.time}`
}

function getBestBodyForRole(spawn, role) {
  const bodies = getBodiesForRole(role)
  const bodyCosts = getBodyCosts(bodies)
  const bestCost = bodyCosts
    .filter(cost => canSpawnCreep(spawn, cost[0]))
    .sort((a, b) => a[1] - b[1])
    .shift()

  if (bestCost) {
    return bestCost[0]
  } else {
    return bestCost
  }
}

function getBodiesForRole(role) {
  return bodyForRole[role]
}

function getBodyCost(body) {
  return body.reduce((cost, part) => {
    return cost + costForPart[part]
  }, 0)
}

function getBodyCosts(bodies) {
  return bodies.map(body => {
    return [body, getBodyCost(body)]
  })
}

function spawnCreep(spawn, body, role) {
  const name = generateCreepName(role)

  debug.log(`Spawn ${name}`)
  spawn.spawnCreep(body, name, { memory: { body: body, role: role } })
}

module.exports = {
  killAllCreeps,
  listCreeps,
  maintainCreeps,
  reclaimDeadCreepMemory,
  removeConstructionSites
}
