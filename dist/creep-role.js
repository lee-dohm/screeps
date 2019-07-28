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

  run() {
    this.checkMode()
    this.runMode()
  }
}

module.exports = CreepRole
