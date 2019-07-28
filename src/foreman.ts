import * as debug from "./debug"

type Role = "builder" | "harvester" | "soldier" | "upgrader"

type Body = BodyPartConstant[]

type BodyCost = [Body, number]

type RoleBodyMap = {
  [key in Role]: Body[]
}

const bodyForRole: RoleBodyMap = {
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

export function killAllCreeps() {
  for (const name in Game.creeps) {
    Game.creeps[name].suicide()
  }
}

export function listCreeps(role?: Role) {
  let creeps

  if (role) {
    creeps = filterCreeps((creep: Creep) => creep.memory.role === role)
  } else {
    creeps = filterCreeps((creep: Creep) => true)
  }

  const names = creeps.map((creep: Creep) => creep.name).sort()

  for (const name of names) {
    console.log(`Creep: ${name}`)
  }
}

export function maintainCreeps(role: Role, count: number) {
  debug.log(`Keep number of ${role} creeps at or above ${count}`)

  const spawn = Game.spawns["Spawn1"]

  if (!spawn.spawning) {
    const body = getBestBodyForRole(spawn, role)

    if (body) {
      if (canSpawnCreep(spawn, body)) {
        const creeps = filterCreeps((creep: Creep) => creep.memory.role === role)

        if (creeps.length < count) {
          spawnCreep(spawn, body, role)
        }
      }
    }
  }
}

export function reclaimDeadCreepMemory() {
  debug.log("Reclaim dead creep memory")

  for (let name in Memory.creeps) {
    if (!Game.creeps[name]) {
      debug.log(`Delete dead creep from memory: ${name}`)
      delete Memory.creeps[name]
    }
  }
}

export function removeConstructionSites(room: Room, type?: string) {
  let sites

  if (type) {
    sites = room.find(FIND_CONSTRUCTION_SITES, {
      filter: (structure: ConstructionSite) => {
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

function canSpawnCreep(spawn: StructureSpawn, body: Body) {
  return spawn.spawnCreep(body, "canSpawnCreep", { dryRun: true }) === OK
}

function filterCreeps(fn: (creep: Creep) => boolean) {
  let creeps: Creep[] = []

  for (const name in Game.creeps) {
    if (fn(Game.creeps[name])) {
      creeps.push(Game.creeps[name])
    }
  }

  return creeps
}

function generateCreepName(role: Role) {
  return `${role} ${Game.time}`
}

function getBestBodyForRole(spawn: StructureSpawn, role: Role): Body | undefined {
  const bodies = getBodiesForRole(role)
  const bodyCosts = getBodyCosts(bodies)
  const bestCost = bodyCosts
    .filter((cost: BodyCost) => canSpawnCreep(spawn, cost[0]))
    .sort((a: BodyCost, b: BodyCost) => a[1] - b[1])
    .shift()

  if (bestCost) {
    return bestCost[0]
  } else {
    return bestCost
  }
}

function getBodiesForRole(role: Role) {
  return bodyForRole[role]
}

function getBodyCost(body: Body): number {
  return body.reduce((cost: number, part: BodyPartConstant) => {
    return cost + costForPart[part]
  }, 0)
}

function getBodyCosts(bodies: Body[]): BodyCost[] {
  return bodies.map((body: Body) => {
    return [body, getBodyCost(body)]
  })
}

function spawnCreep(spawn: StructureSpawn, body: Body, role: Role) {
  const name = generateCreepName(role)

  debug.log(`Spawn ${name}`)
  spawn.spawnCreep(body, name, { memory: { body: body, role: role } })
}
