"use strict"

/**
 * Selects a target by executing as few rules as possible.
 */
class TargetSelector {
  constructor(creep) {
    this.creep = creep
    this.rules = []
  }

  /**
   * Adds a target selection rule.
   */
  addRule(ruleFn) {
    this.rules.push(ruleFn)
  }

  /**
   * Selects a single target based on the given rules.
   *
   * If a rule returns an array of targets, only the first element in the array is returned.
   *
   * If none of the rules returns a target, `undefined` is returned.
   */
  select() {
    for (const ruleFn of this.rules) {
      const result = ruleFn(this.creep)

      if (result instanceof Array) {
        const [target] = result

        return target
      } else if (!(_.isNull(result) || _.isUndefined(result))) {
        return result
      }
    }
  }
}

module.exports = TargetSelector
