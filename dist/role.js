/**
 * Represents the role the creep plays in the robot army.
 *
 * The creep's role defines:
 *
 * * How to constructe the creep, based on an amount of energy
 * * What the creep's default behavior is if it does not have one set
 * * What behavior should be adopted next if the current behavior's goals are complete
 * * Any visualizations that should be maintained for the creep
 *
 * ## Subclass requirements
 *
 * * `id` - `[static]` A unique `string` identifying the subclass for the factory function
 * * `bodyDefinitions` - `[static]` An `Array` of body part arrays, from most expensive to least
 *
 * ## Overrides
 *
 * * `setNextBehavior()` - To customize what happens when the creep transitions to the next behavior
 * * `visualize()` - To customize the room visualizations that are maintained for the creep
 */
class Role {
  /**
   * Constructs a new role object.
   *
   * * `creep` - The creep that is fulfilling this role
   * * `defaultBehavior` - Behavior the role should use if one is not set
   * * `behaviorTransitions` - A `string, string` map of current behavior to next behavior
   */
  constructor(creep, defaultBehavior, behaviorTransitions) {
    if (!creep || !(creep instanceof Creep)) {
      throw new Error(`No creep passed to Role constructor: ${JSON.stringify(creep)}`)
    }

    this.creep = creep
    this.behaviorTransitions = behaviorTransitions

    if (!this.creep.memory.behaviorId) {
      this.creep.memory.behaviorId = defaultBehavior
    }
  }

  /**
   * Finds the best body for this role that can be built with the given amount of `energy`.
   */
  getBestBody(energy) {
    return this.bodyDefinitions.find(parts => {
      const body = new Body(parts)

      return energy > body.getCost()
    })
  }

  /**
   * Default handling of changing from one behavior to the next.
   *
   * Subclasses should override this function if they need to do something beyond simply
   * transitioning to the next behavior, such as clearing the creep's target.
   */
  setNextBehavior() {
    this.creep.memory.behaviorId = this.behaviorTransitions[this.creep.memory.behaviorId]
  }

  /**
   * Draws the appropriate room visualizations for the creep's role.
   *
   * Subclasses should override this function if they need to do something beyond simply drawing
   * a line to the creep's current target.
   */
  visualize() {
    if (this.creep.target) {
      this.creep.room.visual.line(this.creep.pos, this.creep.target.pos, {
        color: "#0f0",
        lineStyle: "dashed"
      })
    }
  }
}

module.exports = Role
