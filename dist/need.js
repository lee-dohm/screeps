"use strict"

/**
 * Describes a need within the system.
 *
 * A need has the following properties:
 *
 * * `type` that describes what is needed: _ex:_ `energy`
 * * `target` that describes what needs this
 * * `assignee` that describes the creep assigned to fulfill the need
 */
class Need {
  /**
   * Deserializes `obj` into the equivalent `Need` instance.
   */
  static deserialize(obj) {
    return new Need(obj.type, Game.getObjectById(obj.targetId), Game.getObjectById(obj.assigneeId))
  }

  /**
   * Constructs a new `Need`.
   */
  constructor(type, target, assignee) {
    this._assignee = assignee
    this._target = target
    this._type = type
  }

  get assignee() {
    return this._assignee
  }

  set assignee(assignee) {
    this._assignee = assignee
  }

  get target() {
    return this._target
  }

  get type() {
    return this._type
  }

  /**
   * Determines if `other` is equivalent to this need.
   *
   * Though a single object can have multiple needs, it can only have one need of a given type. For
   * example: an extension might need repair and need energy, but it can't have two energy needs.
   */
  equals(other) {
    return this.type === other.type && this.target === other.target
  }

  /**
   * Serializes this need into a format that is appropriate for storage in `Memory`.
   */
  serialize() {
    return {
      assigneeId: this._assignee && this._assignee.id,
      targetId: this._target && this._target.id,
      type: this._type
    }
  }
}
