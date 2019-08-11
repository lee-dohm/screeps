"use strict"

const SHORTCODE_TO_BODYPART = {
  a: ATTACK,
  c: CARRY,
  h: HEAL,
  k: CLAIM,
  x: CLAIM,
  m: MOVE,
  r: RANGED_ATTACK,
  t: TOUGH,
  w: WORK
}

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
      let part = SHORTCODE_TO_BODYPART[match[2].toLowerCase()]

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
}

module.exports = Body
