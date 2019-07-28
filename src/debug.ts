export function log(message: string) {
  if (Memory.debug) {
    console.log(message)
  }
}

export function logStats() {
  if (Memory.debug) {
    console.log(
      `${Math.round((Game.cpu.getUsed() / Game.cpu.tickLimit) * 100)}% of available CPU time used`
    )
  }
}
