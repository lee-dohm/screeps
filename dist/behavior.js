/**
 * Base class for all creep behaviors.
 *
 * ## Subclass requirements
 *
 * * `id` - `[static]` A unique `string` identifying the subclass for the factory function
 * * `isComplete()` - determines whether the behavior's goals are complete
 * * `run()` - executes the behavior's actions
 */
class Behavior {
  /**
   * Constructs a new behavior object.
   */
  constructor(creep) {
    if (!creep || !(creep instanceof Creep)) {
      throw new Error(`No creep passed to Behavior constructor: ${JSON.stringify(creep)}`)
    }

    this.creep = creep
  }

  /**
   * Transitions to the next behavior when the current behavior's goal is complete.
   *
   * ## Options
   *
   * * `clearTarget` - When `true` clears the creep's target before transitioning to the new
   *   behavior. _(Default: `true`)_
   */
  setNextBehavior(id, opts = {clearTarget: true}) {
    if (opts.clearTarget) {
      this.creep.clearTarget()
    }

    this.creep.behavior = id
  }
}

module.exports = Behavior
