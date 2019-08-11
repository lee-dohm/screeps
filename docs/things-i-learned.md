# Things I Learned

Part of the fun of Screeps is the process of learning the little tidbits of knowledge you need in order to make better use of the API or the strategies that you discover along the way. This is where I record the things I figure out.

## Creeps

### Lifespan

Creeps have a limited lifespan. Once spawned, they live for only 1,500 ticks. Because a creep costs energy to spawn, every tick a creep spends idle is wasted energy; specifically, 0.067% of the energy you spent to build the creep.

### Body definitions

A creep is constructed from an array of body parts. Normally, the order of the body parts in the array is insignificant because only the presence of a part matters for whether a creep can perform a given action. But when a creep encounters combat, body parts are damaged or destroyed, in order, from the beginning to the end of the array. So if you create a creep with all of its `TOUGH` parts at the end of the array, then they aren't doing the creep any good because all the parts that perform actions are destroyed before the `TOUGH` parts can absorb any damage.

## Energy

A standard energy source in an owned room generates 3,000 energy every 300 ticks. So you must average 10 energy harvested every tick to maximize the amount of energy harvested. But harvesting more than 10 energy per tick also wastes energy because that means your harvesters are going to spend time idle waiting for the energy source to regenerate.

Given that:

* 1 `WORK` part harvests 2 energy per tick
* A source generates 10 energy per tick
* You need 5 `WORK` parts harvesting a source every tick

## API

### Don't over- or under-fill

The [`Creep.transfer()` function](https://docs.screeps.com/api/#Creep.transfer) accepts an optional `amount` parameter. The default value for `amount` is "everything the creep is carrying", meaning that if you transfer more than the target can accept, you've wasted the excess. On the other hand, if you try to transfer more than the creep has, the transfer will not execute.

### Spawning

Determining what creep body a given spawn can create is tricky. Since spawns can draw energy from any spawn or extension anywhere in the room, you have to use some "can I spawn this?" logic:

```javascript
return spawn.spawnCreep(body, name, { dryRun: true }) === OK)
```

But this only tells you that the spawn can create the creep with the energy it has **now**. It can't tell you what the spawn is _capable_ of creating if all energy structures were full of energy. Since it is often more important to build the largest creep you can, even if you have to wait, then you have to calculate the total energy capacity of all the energy structures in the room.

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
