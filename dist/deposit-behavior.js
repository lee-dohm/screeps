class DepositBehavior {
  static mode = "depositing"

  constructor(creep) {
    this.creep = creep
  }

  isComplete() {
    return this.creep.isEmpty()
  }

  run() {
    if (!this.creep.target) {
      this.findNextTarget()
    } else {
      const target = this.creep.target
      const amount = target.energyCapacity - target.energy

      if (this.creep.transfer(target, RESOURCE_ENERGY, amount) == ERR_NOT_IN_RANGE) {
        this.creep.moveTo(target)
      }
    }
  }
}
