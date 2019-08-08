"use strict"

class Body {
  static fromString(text) {
    const pattern = new RegExp("([0-9]+)([a-z])", "g")
    let match
    let result = []

    while ((match = pattern.exec(text)) !== null) {
      const count = parseInt(match[1], 10)
      let part

      switch (match[2].toLowerCase()) {
        case "c": {
          part = CARRY
          break
        }

        case "m": {
          part = MOVE
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

    return new Body(result)
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
