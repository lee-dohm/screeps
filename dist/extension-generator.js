"use strict"

/**
 * Determines if `candidate` is an eligible room position for placing an extension.
 */
function isEligible(candidate, pos, n) {
  return (
    candidate.isWalkable() &&
    candidate.x != pos.x &&
    candidate.y != pos.y &&
    !(candidate.x == pos.x - n && candidate.y == pos.y - n) &&
    !(candidate.x == pos.x - n && candidate.y == pos.y + n) &&
    !(candidate.x == pos.x + n && candidate.y == pos.y - n) &&
    !(candidate.x == pos.x + n && candidate.y == pos.y + n)
  )
}

/**
 * Generates the northern line of the box at distance `n` from the center point `pos`.
 */
function* generateExtensionNorthLine(room, pos, n) {
  const y = pos.y - n
  let x = pos.x - n

  while (x != pos.x + n + 1) {
    yield room.getPositionAt(x, y)
    x += 1
  }
}

/**
 * Generates the eastern line of the box at distance `n` from the center point `pos`.
 */
function* generateExtensionEastLine(room, pos, n) {
  const x = pos.x + n
  let y = pos.y - n

  while (y != pos.y + n + 1) {
    yield room.getPositionAt(x, y)
    y += 1
  }
}

/**
 * Generates the southern line of the box at distance `n` from the center point `pos`.
 */
function* generateExtensionSouthLine(room, pos, n) {
  const y = pos.y + n
  let x = pos.x + n

  while (x != pos.x - n - 1) {
    yield room.getPositionAt(x, y)
    x -= 1
  }
}

/**
 * Generates the western line of the box at distance `n` from the center point `pos`.
 */
function* generateExtensionWestLine(room, pos, n) {
  const x = pos.x - n
  let y = pos.y + n

  while (y != pos.y - n - 1) {
    yield room.getPositionAt(x, y)
    y -= 1
  }
}

/**
 * Generates the series of extension room positions centered at `pos`.
 */
function* generateExtensionPos(room, pos) {
  let n = 2

  while (true) {
    for (const candidate of generateExtensionNorthLine(room, pos, n)) {
      if (candidate && isEligible(candidate, pos, n)) {
        yield candidate
      }
    }

    for (const candidate of generateExtensionEastLine(room, pos, n)) {
      if (candidate && isEligible(candidate, pos, n)) {
        yield candidate
      }
    }

    for (const candidate of generateExtensionSouthLine(room, pos, n)) {
      if (candidate && isEligible(candidate, pos, n)) {
        yield candidate
      }
    }

    for (const candidate of generateExtensionWestLine(room, pos, n)) {
      if (candidate && isEligible(candidate, pos, n)) {
        yield candidate
      }
    }

    n += 1
  }
}

module.exports = generateExtensionPos
