# Things I Learned

Part of the fun of Screeps is the process of learning the little tidbits of knowledge you need in order to make better use of the API or the strategies that you discover along the way. This is where I record the things I figure out.

## API

### Don't overfill

The [`Creep.transfer()` function](https://docs.screeps.com/api/#Creep.transfer) accepts an optional `amount` parameter. The default value for `amount` is "everything the creep is carrying", meaning that if you transfer more than the target can accept, you've wasted the excess.

## Control levels

The amount of available energy in a room varies based on the [Room Controller Level](https://docs.screeps.com/control.html#Room-Controller-Level). So the body definitions that we design for each role should be built around the maximum available spawn energy for each RCL:

| RCL | Max available energy |
|-----|----------------------|
| 0 | 0 |
| 1 | 300 |
| 2 | 550 |
| 3 | 800 |
| 4 | 1,300 |
| 5 | 1,800 |
| 6 | 2,300 |
| 7 | 5,300 |
| 8 | 12,300 |

This means that at RCL 1 we could build any of the following:

* `[WORK, WORK, MOVE, MOVE]` - Harvester
* `[WORK, MOVE, MOVE, CARRY]` - Builder/Upgrader
* `[HEAL, MOVE]` - Healer
* `[MOVE, MOVE, MOVE, CARRY, CARRY, CARRY]` - Gatherer

But at RCL 2 we could build any of the following:

* `[WORK, WORK, WORK, WORK, MOVE, MOVE]` - Harvester
* `[WORK, WORK, MOVE, MOVE, MOVE, CARRY]` - Builder/Upgrader
* `[HEAL, HEAL, MOVE]` - Healer
* `[MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY]` - Gatherer

## Logging

### Errors

The best way to log errors is to fail fast by throwing an exception. I found [this technique](https://github.com/screepers/screeps-profiler/blob/4014ef56997d520295a481a28f5cd6acf70042f0/screeps-profiler.js#L7-L11) for creating a named error object with a stack trace using old, old JavaScript semantics. But we can use JavaScript classes for these too:

```javascript
class UnknownModeError {
  constructor(creep, mode) {
    this.name = "UnknownModeError"
    this.message = `Creep ${creep.name} has an unknown mode ${mode}`
    this.stack = new Error().stack
  }
}
```

Reasons why this is preferable:

1. Errors like this are emailed to the player if they're not caught
    * You can use [`Game.notify()`](https://docs.screeps.com/api/#Game.notify) to send emails for caught exceptions
1. You get a stack trace
1. You can catch them, so if a creep runs into an error, you can continue with the next creep instead of forfeiting your tick
