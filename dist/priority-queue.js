"use strict"

class PriorityQueue {
  constructor() {
    this.queues = new Array()
  }

  isEmpty() {
    return Object.keys(this.queues).length == 0
  }

  peek() {
    const [highestPriority] = Object.keys(this.queues)

    if (highestPriority) {
      return this.queues[highestPriority][0]
    }
  }

  pop() {
    const [highestPriority] = Object.keys(this.queues)

    if (highestPriority) {
      const item = this.queues[highestPriority].shift()

      if (this.queues[highestPriority].length) {
        delete this.queues[highestPriority]
      }

      return item
    }
  }

  push(item, priority) {
    if (!this.queues[priority]) {
      this.queues[priority] = []
    }

    this.queues[priority].push(item)
  }
}

PriorityQueue.CRITICAL = 0
PriorityQueue.HIGH = 1
PriorityQueue.MEDIUM = 2
PriorityQueue.LOW = 3

module.exports = PriorityQueue
