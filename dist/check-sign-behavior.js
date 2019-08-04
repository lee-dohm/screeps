const Behavior = require("./behavior")
const username = require("./username")

const GITHUB_ZEN = [
  "Responsive is better than fast",
  "It's not fully shipped until it's fast",
  "Anything added dilutes everything else",
  "Practicality beats purity",
  "Approachable is better than simple",
  "Mind your words, they are important",
  "Speak like a human",
  "Half measures are as bad as nothing at all",
  "Encourage flow",
  "Non-blocking is better than blocking",
  "Favor focus over features",
  "Avoid administrative distraction",
  "Design for failure",
  "Keep it logically awesome"
]

/**
 * Checks the controller's sign to ensure that it is tagged by my robot army.
 */
class CheckSignBehavior extends Behavior {
  constructor(creep) {
    super(creep)
  }

  /**
   * Determines if the creep has been able to check the sign.
   */
  isComplete() {
    return this.creep.memory.mySign
  }

  run() {
    if (!this.creep.target) {
      this.findRoomController()
    } else {
      const sign = this.creep.target.sign
      debug.log(`Check controller sign: {green-fg}${JSON.stringify(sign)}{/green-fg}`)

      if (!sign || sign.username !== username) {
        if (this.creep.signController(this.randomQuote()) == ERR_NOT_IN_RANGE) {
          this.creep.moveTo(this.creep.target)
        }
      } else if (sign && sign.username === username) {
        this.creep.memory.mySign = true
      }
    }
  }

  findRoomController() {
    const targets = this.creep.room.find(FIND_STRUCTURES, {
      filter: structure => structure.structureType == STRUCTURE_CONTROLLER
    })

    this.creep.target = targets[0]
  }

  randomQuote() {
    return GITHUB_ZEN[Math.floor(Math.random() * GITHUB_ZEN.length)]
  }
}

CheckSignBehavior.id = "checkingSign"

module.exports = CheckSignBehavior
