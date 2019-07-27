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

let foreman = {
  /**
   * Create `count` creeps for the given role if the energy is available.
   *
   * @param  {String} role  Role of the creep to create.
   * @param  {Number} count Number of creeps of the given role to create.
   */
  createCreep: function(role: Role, count: Number) {
    let spawn = Game.spawns["Spawn1"]

    if (!spawn.spawning) {
      let body = this.getBestBodyForRole(spawn, role)

      if (body) {
        if (spawn.canCreateCreep(body) === OK) {
          let creeps = this.filterCreeps((creep: Creep) => {
            return creep.memory.role === role
          })

          if (creeps.length < count) {
            let newCreep = spawn.createCreep(body, undefined, { role: role, body: body })
            console.log(`Spawn new ${role} with ${body}: ${newCreep}`)
          }
        }
      }
    }
  },

  filterCreeps: function(fn: (creep: Creep) => boolean) {
    let creeps: Creep[] = []

    for (let creep in Game.creeps) {
      if (fn(Game.creeps[creep])) {
        creeps.push(Game.creeps[creep])
      }
    }

    return creeps
  },

  /**
   * Creates construction sites for up to the allowed number of extensions in a room.
   *
   * @param {Room} room Room to create extensions in
   */
  createExtensions: function(room: Room) {
    let extensions = room.find(FIND_MY_STRUCTURES, {
      filter: structure => {
        return structure.structureType == STRUCTURE_EXTENSION
      }
    })

    let extensionsUnderConstruction = room.find(FIND_MY_CONSTRUCTION_SITES, {
      filter: site => {
        return site.structureType == STRUCTURE_EXTENSION
      }
    })

    if (room.controller) {
      let extensionsNeeded =
        this.extensionsAllowed(room.controller.level) -
        extensions.length -
        extensionsUnderConstruction.length
      if (extensionsNeeded > 0) {
        let spawn = room.find(FIND_MY_SPAWNS)[0]
        let spaces = this.lookForEmptyTerrainAround(room, spawn.pos.x, spawn.pos.y, 2)

        spaces.forEach((space: any) => {
          console.log(`Create extension construction site at [${space.x}, ${space.y}]`)
          room.createConstructionSite(space.x, space.y, STRUCTURE_EXTENSION)
        })
      }
    }
  },

  /**
   * Delete all dead creeps from memory.
   */
  deleteDeadCreeps: function() {
    for (let name in Memory.creeps) {
      if (!Game.creeps[name]) {
        delete Memory.creeps[name]
        console.log(`Delete dead creep from memory: ${name}`)
      }
    }
  },

  /**
   * Gets the allowed number of extensions based on a room's controller level.
   *
   * @param  {Number} level Level of the room's controller.
   * @return {Number} Number of extensions allowed in the room.
   */
  extensionsAllowed: function(level: number) {
    return CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][level]
  },

  /**
   * Gets the best body for the given role that can be constructed by the spawn.
   *
   * @param  {StructureSpawn} spawn Spawn to construct the creep.
   * @param  {String} role Role to retrieve the body description for.
   * @return {Array} Body description.
   */
  getBestBodyForRole: function(spawn: StructureSpawn, role: Role): Body | undefined {
    let bodies = this.getBodiesForRole(role)
    let capacity = this.getTotalEnergyCapacity(spawn)

    return bodies.find((body: Body) => {
      this.getEnergyCostForBody(body) <= capacity
    })
  },

  /**
   * Gets the body descriptions for the given role.
   *
   * @param  {String} role Role to retrieve the body descriptions for.
   * @return {Array} Descriptions of the bodies defined for that role.
   */
  getBodiesForRole: function(role: Role) {
    return bodyForRole[role]
  },

  getEnergyCostForBody: function(body: Body) {
    let total = 0

    body.forEach((part: BodyPartConstant) => {
      total += costForPart[part]
    })

    return total
  },

  getTotalEnergyCapacity: function(spawn: StructureSpawn) {
    let total = spawn.energyCapacity

    let extensions = spawn.room.find(FIND_MY_STRUCTURES, {
      filter: { structureType: STRUCTURE_EXTENSION }
    })
    extensions.forEach((extension: Structure) => {
      if (extension instanceof StructureExtension) {
        total += extension.energyCapacity
      }
    })

    return total
  },

  /**
   * Examines the room state and performs any necessary tasks.
   *
   * @param  {Room} room Room to supervise.
   */
  supervise: function(room: Room) {
    this.createExtensions(room)
  },

  lookForEmptyTerrainAround: function(room: Room, x: number, y: number, distance: number) {
    let top = y - distance
    let left = x - distance
    let bottom = y + distance
    let right = x + distance

    let spaces = room.lookAtArea(top, left, bottom, right, true)

    return spaces.filter((space: any) => {
      if (space.type == "terrain" && room.lookAt(space.x, space.y).length == 1) {
        return true
      }
    })
  }
}

export default foreman
