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
    Memory.namesCounter = (Memory.namesCounter + 1) % NAMES.length

    return NAMES[Memory.namesCounter]
  }
}

module.exports = new Names()
