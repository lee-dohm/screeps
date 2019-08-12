"use strict"

function log(message) {
  if (Memory.debug) {
    _log(message)
  }
}

function logException(e) {
  const message = `{red-fg}{bold}ERROR:{/} ${e.message}\n${e.stack}`

  if (!Memory.suppressExceptionLogging) {
    console.log(message)
  }

  Game.notify(message, e.groupInterval)
}

function _log(message) {
  console.log(`DEBUG: ${message}`)
}

module.exports = { log, logException }
