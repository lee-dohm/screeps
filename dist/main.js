require('monkeypatch')

const foreman = require('foreman')
const helpers = require('helpers')

const roleBuilder = require('role.builder')
const roleHarvester = require('role.harvester')
const roleSoldier = require('role.soldier')
const roleUpgrader = require('role.upgrader')

module.exports.loop = function () {
  if(!Memory.foreman || Memory.foreman != foreman) {
    Memory.foreman = foreman
  }

  foreman.deleteDeadCreeps()

  foreman.createCreep('builder', 5)
  foreman.createCreep('soldier', 5)
  foreman.createCreep('upgrader', 8)
  foreman.createCreep('harvester', 5)

  _.forEach(Game.rooms, (room) => { foreman.supervise(room) })

  _.forEach(Game.creeps, (creep) => {
    if (creep.memory.role == 'builder') {
      roleBuilder.run(creep)
    }

    if (creep.memory.role == 'harvester') {
      roleHarvester.run(creep)
    }

    if (creep.memory.role == 'soldier') {
      roleSoldier.run(creep)
    }

    if (creep.memory.role == 'upgrader') {
      roleUpgrader.run(creep)
    }
  })
}
