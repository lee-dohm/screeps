"use strict"

const NAMES = [
  "alpha",
  "bravo",
  "charlie",
  "delta",
  "echo",
  "foxtrot",
  "golf",
  "hotel",
  "indigo",
  "juliet",
  "kilo",
  "lima",
  "mike",
  "november",
  "oscar",
  "papa",
  "quebec",
  "romeo",
  "sierra",
  "tango",
  "uniform",
  "victor",
  "whiskey",
  "xray",
  "yankee",
  "zulu"
]

/**
 * Functions for dealing with creep names.
 */
class Names {
  /**
   * Gets the next name in the list.
   */
  getName() {
    if (!Memory.names) {
      Memory.names = {}
    }

    if (typeof Memory.names.counter !== "number") {
      Memory.names.counter = 0
    } else {
      Memory.names.counter = (Memory.names.counter + 1) % NAMES.length
    }

    return NAMES[Memory.names.counter]
  }
}

module.exports = new Names()
