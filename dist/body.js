"use strict"

/**
 * Represents a body definition for a creep.
 *
 * A body definition is described as a collection of [parts.](https://docs.screeps.com/api/#Creep)
 * This can be expressed as an array of Screep constants or as a string encoded as a series of
 * number/character pairs. The characters are:
 *
 * * `A` for `ATTACK`
 * * `C` for `CARRY`
 * * `H` for `HEAL`
 * * `K` or `X` for `CLAIM`
 * * `M` for `MOVE`
 * * `R` for `RANGED_ATTACK`
 * * `T` for `TOUGH`
 * * `W` for `WORK`
 *
 * So, for example, the text: `3c 2m 1w` would be converted to the array `[CARRY, CARRY, CARRY,
 * MOVE, MOVE, WORK]`. The text format is not case-sensitive.
 */
class Body {
  /**
   * Converts from text form into a `Body` instance.
   */
  static fromString(text) {
    return new Body(Body.parse(text))
  }

  /**
   * Converts from text form into an array of body part constants.
   */
  static parse(text) {
    const pattern = new RegExp("([0-9]+)([a-zA-Z])", "g")
    let match
    let result = []

    while ((match = pattern.exec(text)) !== null) {
      const count = parseInt(match[1], 10)
      let part

      switch (match[2].toLowerCase()) {
        case "a": {
          part = ATTACK
          break
        }

        case "c": {
          part = CARRY
          break
        }

        case "h": {
          part = HEAL
          break
        }

        case "k":
        case "x": {
          part = CLAIM
          break
        }

        case "m": {
          part = MOVE
          break
        }

        case "r": {
          part = RANGED_ATTACK
          break
        }

        case "t": {
          part = TOUGH
          break
        }

        case "w": {
          part = WORK
          break
        }
      }

      for (let i = 0; i < count; i++) {
        result.push(part)
      }
    }

    return result
  }

  constructor(parts) {
    this.parts = parts
  }

  /**
   * Calculate the energy cost required to spawn this body.
   */
  getCost() {
    return this.parts.reduce((total, part) => BODYPART_COST[part] + total, 0)
  }

  /**
   * Calculate the base movement speed per tick for this body.
   *
   * The base movement rate is the speed that the creep will move on plains. The creep will move
   * at twice the base on roads and one-fifth the base rate on swamps.
   *
   * ## Options
   *
   * * `laden` - If `true` calculates the laden movement speed, _default: false_
   */
  getMoveRate(opts) {
    const move = this.parts.filter(part => part === MOVE).length
    const weight = this.parts.filter(part => {
      return part !== CARRY || opts["laden"]
    }).length

    return weight / move
  }
}

module.exports = Body
