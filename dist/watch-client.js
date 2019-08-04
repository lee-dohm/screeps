/*
 * Copied with permission from
 * https://github.com/screepers/screeps-multimeter/blob/3acc45e2c0ca3c2f4bddd0dc795daa05e03fe01b/lib/watch-client.js
 *
 * Copyright (c) 2016 Ryan Patterson
 */

module.exports = function() {
  if (typeof Memory.watch !== "object") {
    Memory.watch = {}
  }
  if (typeof Memory.watch.expressions !== "object") {
    Memory.watch.expressions = {}
  }
  if (typeof Memory.watch.values !== "object") {
    Memory.watch.values = {}
  }
  _.each(Memory.watch.expressions, (expr, name) => {
    if (typeof expr !== "string") return
    let result
    try {
      result = eval(expr)
    } catch (ex) {
      result = "Error: " + ex.message
    }
    if (name == "console") {
      if (typeof result !== "undefined") console.log(result)
    } else {
      Memory.watch.values[name] = typeof result !== "undefined" ? result.toString() : result
    }
  })
}
