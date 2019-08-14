"use strict"

/**
 * Selects a target by executing as few rules as possible.
 */
class TargetSelector {
  constructor(creep) {
    this.creep = creep
    this.rules = []
  }

  addRule(ruleFn) {
    this.rules.push(ruleFn)
  }

  select() {
    for (const ruleFn of this.rules) {
      const result = ruleFn(this.creep)

      if (result instanceof Array) {
        const [target] = result

        return target
      } else if (!_.isNil(result)) {
        return result
      }
    }
  }
}

module.exports = TargetSelector
