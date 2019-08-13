"use strict"

class JobQueue {
  constructor(needs, queues) {
    this.needs = needs || []
    this.queues = queues || {}
  }

  add(need) {
    this.needs.push(need)
    this._insertNeedByType(need)
  }

  assign(type, assignee) {
    if (this.queues[type] && this.queues[type].length > 0) {
      const need = this.queues[type].shift()
      need.assignee = assignee

      return need
    }
  }

  complete(need) {
    const index = this.needs.findIndex(need)
    this.needs.splice(index, 1)
  }

  unassign(need) {
    need.assignee = null
    this._insertNeedByType(need)
  }

  _insertNeedByType(need) {
    if (!this.queues[need.type]) {
      this.queues[need.type] = []
    }

    this.queues[need.type].push(need)
  }
}

module.exports = JobQueue
