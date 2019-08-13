"use strict"

/**
 * Describes a need within the system.
 *
 * A need has the following properties:
 *
 * * `type` that describes what is needed: _ex:_ `energy`
 * * `target` that describes what needs this
 * * `assignee` that describes what is assigned to fulfill the need
 *
 * Typically the `assignee` is a creep, but it could be some other piece of code that can perform a
 * task such as a room planner.
 */
class Need {
  static deserialize(obj) {
    return new Need(obj.type, Game.getObjectById(obj.targetId), Game.getObjectById(obj.assigneeId))
  }

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

  serialize() {
    return {
      assigneeId: this._assignee && this._assignee.id,
      targetId: this._target && this._target.id,
      type: this._type
    }
  }
}
