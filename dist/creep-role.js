const { humanize } = require("./utility")

class CreepRole {
  constructor(creep) {
    this.creep = creep
  }

  get mode() {
    return this.creep.memory.mode
  }

  set mode(newMode) {
    this.creep.memory.mode = newMode
  }

  /**
   * Acts on `target` using `fn` or moves closer to it if not in range for the action.
   *
   * `target` is supplied to `fn` as its first parameter.
   */
  actOrMoveCloser(target, fn) {
    if (fn(target) === ERR_NOT_IN_RANGE) {
      this.creep.moveTo(target)
    }
  }

  getTerrain() {
    const found = this.creep.pos.lookFor(LOOK_TERRAIN)

    return found[0]
  }

  getTarget() {
    const id = this.creep.memory.targetId

    if (id) {
      return Game.getObjectById(id)
    }
  }

  indicateTarget(t) {
    const target = t ? t : this.getTarget()

    if (target) {
      this.creep.room.visual.line(this.creep.pos, target.pos, { lineStyle: "dashed" })
    }
  }

  logError(message) {
    console.log(`ERROR ${this.creep.name}: ${message}`)
  }

  markForPaving() {
    this.creep.pos.createConstructionSite(STRUCTURE_ROAD)
  }

  markSwampForPaving() {
    if (this.getTerrain() === "swamp") {
      this.markForPaving()
    }
  }

  moveAway(t) {
    const target = t ? t : this.getTarget()

    const path = PathFinder.search(this.creep.pos, { pos: target.pos, range: 2 }, { flee: true })

    this.creep.moveTo(path.pop())
  }

  setMode(mode) {
    this.mode = mode
    this.creep.say(humanize(this.mode))
  }

  setTarget(target) {
    if (target) {
      this.creep.memory.targetId = target.hasOwnProperty("id") ? target.id : target
    } else {
      this.logError(`Attempt to set invalid target: ${target}`)
    }
  }

  run() {
    this.checkMode()
    this.runMode()
  }
}

module.exports = CreepRole
