const USED_HISTORY_LENGTH = 10

function log(message) {
  if (Memory.debug) {
    console.log(message)
  }
}

function logStats() {
  const percentUsed = Math.round((Game.cpu.getUsed() / Game.cpu.tickLimit) * 100)

  if (Memory.debug || Memory.stats) {
    console.log(
      `${Math.round((Game.cpu.getUsed() / Game.cpu.tickLimit) * 100)}% of available CPU time used`
    )
    console.log(`History: ${JSON.stringify(Memory.usedHistory)}`)
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

module.exports = { log, logStats }
