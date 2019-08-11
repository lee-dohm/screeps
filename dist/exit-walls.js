"use strict"

const { oppositeDirection, rotateClockwise, rotateCounterClockwise } = require("./utils")

const EXCLUSION_DISTANCE = 2

function isEligible(candidate) {
  return candidate.isWalkable()
}

function* generateInwardLeg(exitDirection, positions) {
  const pos = positions[0]
  const startPos = pos.translate(rotateCounterClockwise(exitDirection), EXCLUSION_DISTANCE)
  const inwardDirection = oppositeDirection(exitDirection)

  let nextPos = startPos
  for (let i = 0; i < EXCLUSION_DISTANCE; i++) {
    nextPos = nextPos.translate(inwardDirection)

    yield nextPos
  }
}

function* generateOutwardLeg(exitDirection, positions) {
  const pos = positions[positions.length - 1]
  const startPos = pos.translate(rotateClockwise(exitDirection, 3), EXCLUSION_DISTANCE)
  const outwardDirection = exitDirection

  let nextPos = startPos
  for (let i = 0; i < EXCLUSION_DISTANCE; i++) {
    yield nextPos

    nextPos = nextPos.translate(outwardDirection)
  }
}

function* generateWall(exitDirection, positions) {
  const pos = positions[0]
  const startPos = pos.translate(rotateCounterClockwise(exitDirection, 3), EXCLUSION_DISTANCE)
  const endPos = positions[positions.length - 1].translate(
    rotateClockwise(exitDirection, 3),
    EXCLUSION_DISTANCE
  )
  const wallDirection = rotateClockwise(exitDirection)
  const distance = startPos.getRangeTo(endPos) + 1

  let nextPos = startPos
  for (let i = 0; i < distance; i++) {
    yield nextPos

    nextPos = nextPos.translate(wallDirection)
  }
}

function* generateExitWallPos(exitDirection, positions) {
  if (positions.length > 0) {
    for (const pos of generateInwardLeg(exitDirection, positions)) {
      if (isEligible(pos)) {
        yield pos
      }
    }

    for (const pos of generateWall(exitDirection, positions)) {
      if (isEligible(pos)) {
        yield pos
      }
    }

    for (const pos of generateOutwardLeg(exitDirection, positions)) {
      if (isEligible(pos)) {
        yield pos
      }
    }
  }
}

/**
 * Generates the next exit wall position.
 *
 * Returns an object containing:
 *
 * * `done` - `true` if the wall for this exit is complete
 * * `value` - `RoomPosition` to place the wall construction site
 */
function generatePos(room, exitDirection, positions) {
  if (!global.exitWallGenerators) {
    global.exitWallGenerators = {}
  }

  if (!global.exitWallGenerators[room.name]) {
    global.exitWallGenerators[room.name] = {}
  }

  if (!global.exitWallGenerators[room.name][exitDirection]) {
    global.exitWallGenerators[room.name][exitDirection] = generateExitWallPos(
      exitDirection,
      positions
    )
  }

  return global.exitWallGenerators[room.name][exitDirection].next()
}

module.exports = { generatePos }
