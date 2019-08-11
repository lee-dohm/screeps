"use strict"

const Behavior = require("./behavior")
const debug = require("./debug")
const { randomItem } = require("./utils")

/**
 * Harvests energy until the creep is full.
 */
class HarvestBehavior extends Behavior {
  constructor(creep) {
    super(creep)
  }

  /**
   * Returns `true` when the creep is full.
   */
  isComplete() {
    return this.creep.isFull()
  }

  /**
   * Finds energy within the room and gathers or harvests it.
   */
  run() {
    // Prioritize gathering dropped resources over harvesting from sources
    const resource = this.findDroppedEnergy()

    if (resource) {
      this.creep.target = resource
    }

    if (!this.creep.target) {
      this.creep.target = this.findNextTarget()
    } else {
      if (this.creep.target instanceof Source && this.creep.target.isEmpty()) {
        this.creep.target = this.findNextTarget()
      } else {
        this.act(this.creep.target)
      }
    }
  }

  /**
   * Perform the appropriate action on the `target`.
   */
  act(target) {
    const fn = this.getActionFn(target)

    if (fn(target) == ERR_NOT_IN_RANGE) {
      this.creep.moveTo(target)
    }
  }

  /**
   * Creates a list of source IDs based on the number of harvestable positions each source has.
   *
   * For each source, there is one entry of its source ID in the list for every harvestable position
   * it has. When randomly selected from, this weights the target selection more toward sources that
   * have more harvestable positions.
   */
  createWeightedTargetList(sources) {
    let list = []

    for (const source of sources) {
      for (let i = 0; i < source.getHarvestablePositions().length; i++) {
        list.push(source.id)
      }
    }

    return list
  }

  /**
   * Finds the closest dropped energy in the room.
   */
  findDroppedEnergy() {
    return this.creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
      filter: res => res.resourceType == RESOURCE_ENERGY
    })
  }

  /**
   * Finds the next target for the harvester.
   */
  findNextTarget() {
    const sources = this.creep.room.sources
    const targetIds = this.createWeightedTargetList(sources.filter(source => source.energy > 0))
    const targetId = randomItem(targetIds)

    return Game.getObjectById(targetId)
  }

  /**
   * Gets the action function to perform based on the type of the `target`.
   */
  getActionFn(target) {
    if (target instanceof Resource) {
      return target => this.creep.pickup(target)
    } else {
      return target => this.creep.harvest(target)
    }
  }
}

HarvestBehavior.id = "harvesting"

module.exports = HarvestBehavior
