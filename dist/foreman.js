const bodyForRole = {
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

var foreman = {
  /**
   * Create `count` creeps for the given role if the energy is available.
   *
   * @param  {String} role  Role of the creep to create.
   * @param  {Number} count Number of creeps of the given role to create.
   */
  createCreep: function (role, count) {
    var spawn = Game.spawns['Spawn1']

    if (!spawn.spawning) {
      let body = this.getBestBodyForRole(spawn, role)

      if (body && spawn.canCreateCreep(body) == OK) {
        var creeps = _.filter(Game.creeps, (creep) => creep.memory.role === role)

        if (creeps.length < count) {
          var newCreep = spawn.createCreep(body, undefined, {role: role, body: body})
          console.log(`Spawn new ${role} with ${body}: ${newCreep}`)
        }
      }
    }
  },

  /**
   * Creates construction sites for up to the allowed number of extensions in a room.
   *
   * @param {Room} room Room to create extensions in
   */
  createExtensions: function (room) {
    var extensions = room.find(FIND_MY_STRUCTURES, {
      filter: (structure) => { return structure.structureType == STRUCTURE_EXTENSION }
    })

    var extensionsUnderConstruction = room.find(FIND_MY_CONSTRUCTION_SITES, {
      filter: (site) => { return site.structureType == STRUCTURE_EXTENSION }
    })

    var extensionsNeeded = this.extensionsAllowed(room.controller.level) - extensions.length - extensionsUnderConstruction.length
    if (extensionsNeeded > 0) {
      var spawn = room.find(FIND_MY_SPAWNS)[0]
      var spaces = room.lookForEmptyTerrainAround(spawn.pos.x, spawn.pos.y, 2)

      _.forEach(spaces, (space) => {
        console.log(`Create extension construction site at [${space.x}, ${space.y}]`)
        room.createConstructionSite(space.x, space.y, STRUCTURE_EXTENSION)
      })
    }
  },

  /**
   * Delete all dead creeps from memory.
   */
  deleteDeadCreeps: function () {
    for(var name in Memory.creeps) {
      if(!Game.creeps[name]) {
        delete Memory.creeps[name];
        console.log(`Delete dead creep from memory: ${name}`);
      }
    }
  },

  /**
   * Gets the allowed number of extensions based on a room's controller level.
   *
   * @param  {Number} level Level of the room's controller.
   * @return {Number} Number of extensions allowed in the room.
   */
  extensionsAllowed: function (level) {
    return CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][level]
  },

  /**
   * Gets the best body for the given role that can be constructed by the spawn.
   *
   * @param  {StructureSpawn} spawn Spawn to construct the creep.
   * @param  {String} role Role to retrieve the body description for.
   * @return {Array} Body description.
   */
  getBestBodyForRole: function(spawn, role) {
    let bodies = this.getBodiesForRole(role)
    let capacity = this.getTotalEnergyCapacity(spawn)

    return _.find(bodies, (body) => this.getEnergyCostForBody(body) <= capacity)
  },

  /**
   * Gets the body descriptions for the given role.
   *
   * @param  {String} role Role to retrieve the body descriptions for.
   * @return {Array} Descriptions of the bodies defined for that role.
   */
  getBodiesForRole: function (role) {
    return bodyForRole[role]
  },

  getEnergyCostForBody: function (body) {
    let total = 0

    _.forEach(body, (part) => { total += costForPart[part] })

    return total
  },

  getTotalEnergyCapacity: function (spawn) {
    let total = spawn.energyCapacity

    let extensions = spawn.room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_EXTENSION }})
    _.forEach(extensions, (extension) => { total += extension.energyCapacity })

    return total
  },

  /**
   * Examines the room state and performs any necessary tasks.
   *
   * @param  {Room} room Room to supervise.
   */
  supervise: function (room) {
    this.createExtensions(room)
  }
}

module.exports = foreman
