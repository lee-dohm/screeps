const COST_FOR_PART = {
  move: 50,
  work: 100,
  carry: 50,
  attack: 80,
  ranged_attack: 150,
  heal: 250,
  claim: 600,
  tough: 10
}

class Body {
  constructor(parts) {
    this.parts = parts
  }

  /**
   * Calculate the energy cost required to spawn this body.
   */
  getCost() {
    this.parts.reduce((total, part) => COST_FOR_PART[part] + total)
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
