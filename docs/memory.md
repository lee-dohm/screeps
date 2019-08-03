# Memory

The [`Memory` object](https://docs.screeps.com/global-objects.html#Memory-object) in Screeps is where your code can store information that persists between ticks. This space is limited to **2MB** (as of this writing) in `JSON.stringify()` form. Because of these two facts, it is important to be compact in our use of this resource as well as keep in mind that we cannot store full JavaScript objects.

## Conventions

### `Id` signifier on names

In order to be clear that what is stored in memory is not a full object, the key for all values that represent a full object of some sort, whether it is a game object or an object from this AI library, must end in `Id`. For example, while a creep's target is stored in its `target` property during a tick, the value is persisted between ticks in `creep.memory.targetId`.
