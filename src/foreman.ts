import * as debug from "./debug"

type Role = "builder" | "harvester" | "soldier" | "upgrader"

type Body = BodyPartConstant[]

type RoleBodyMap = {
  [key in Role]: Body[]
}

const bodyForRole: RoleBodyMap = {
  builder: [[CARRY, WORK, MOVE]],
  harvester: [[CARRY, WORK, MOVE]],
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

export function killAllCreeps() {
  for (const name in Game.creeps) {
    Game.creeps[name].suicide()
  }
}

export function maintainCreeps(role: Role, count: number) {
  debug.log(`Keep number of ${role} creeps at or above ${count}`)

  const spawn = Game.spawns["Spawn1"]

  if (!spawn.spawning) {
    let body = getBestBodyForRole(spawn, role)

    if (body) {
      if (canSpawnCreep(spawn, body) === OK) {
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

function canSpawnCreep(spawn: StructureSpawn, body: Body) {
  return spawn.spawnCreep(body, "canSpawnCreep", { dryRun: true })
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

function getBestBodyForRole(spawn: StructureSpawn, role: Role) {
  const bodies = getBodiesForRole(role)

  return bodies[0]
}

function getBodiesForRole(role: Role) {
  return bodyForRole[role]
}

function spawnCreep(spawn: StructureSpawn, body: Body, role: Role) {
  const name = generateCreepName(role)

  debug.log(`Spawn ${name}`)
  spawn.spawnCreep(body, name, { memory: { body: body, role: role } })
}
