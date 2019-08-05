"use strict"

const USED_HISTORY_LENGTH = 10

function log(message) {
  if (Memory.debug) {
    _log(message)
  }
}

function logException(e) {
  const message = `{red-fg}{bold}ERROR:{/} ${e.message}\n${e.stack}`

  console.log(message)
  Game.notify(message, e.groupInterval)
}

function logStats() {
  const percentUsed = Math.round((Game.cpu.getUsed() / Game.cpu.tickLimit) * 100)

  if (Memory.debug || Memory.stats) {
    _log(`${percentUsed}% of available CPU time used`)
    _log(`History: ${JSON.stringify(Memory.usedHistory)}`)
  }

  updateUsedHistory(percentUsed)
}

function updateUsedHistory(used) {
  if (Memory.usedHistory) {
    while (Memory.usedHistory.length > USED_HISTORY_LENGTH - 1) {
      Memory.usedHistory.shift()
    }

    Memory.usedHistory.push(used)
  } else {
    Memory.usedHistory = [used]
  }
}

function _log(message) {
  console.log(`DEBUG: ${message}`)
}

module.exports = { log, logException, logStats }
