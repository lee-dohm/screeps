"use strict"

/**
 * Describes a need within the system.
 *
 * A need has the following properties:
 *
 * * `type` - describes what is needed: _ex:_ `energy`
 * * `target` - describes what needs this
 * * `created` - when the need was originally recorded
 * * `assignee` - the object assigned to fulfill the need, if any
 */
class Need {
  /**
   * Constructs a new `Need`.
   */
  constructor(type, target, created, assignee) {
    if (!type) {
      throw new Error("type is a required argument")
    }

    if (!target) {
      throw new Error("target is a required argument")
    }

    if (!created) {
      throw new Error("created is a required argument")
    }

    this._assignee = assignee
    this._created = created
    this._target = target
    this._type = type
  }

  get assignee() {
    return this._assignee
  }

  set assignee(assignee) {
    this._assignee = assignee
  }

  get created() {
    return this._created
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
    return this.type === other.type && this.target === other.target && this.created == other.created
  }
}
