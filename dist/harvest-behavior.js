class HarvestBehavior {
  constructor(parentCreep) {
    this.parentCreep = parentCreep
  }

  isComplete() {
    return false
  }

  run() {
    this.parentCreep.creep.harvest(this.parentCreep.target)
  }
}
