# Things I Learned

Part of the fun of Screeps is the process of learning the little tidbits of knowledge you need in order to make better use of the API or the strategies that you discover along the way. This is where I record the things I figure out.

## API

### Don't overfill

The [`Creep.transfer()` function](https://docs.screeps.com/api/#Creep.transfer) accepts an optional `amount` parameter. The default value for `amount` is "everything the creep is carrying", meaning that if you transfer more than the target can accept, you've wasted the excess.

## Logging

### Errors

The best way to log errors is to fail fast by throwing an exception. I found [this technique](https://github.com/screepers/screeps-profiler/blob/4014ef56997d520295a481a28f5cd6acf70042f0/screeps-profiler.js#L7-L11) for creating a named error object with a stack trace:

```javascript
function UnknownModeError(creep, mode) {
  this.name = 'UnknownModeError'
  this.message = `Creep ${creep.name} has an unknown mode ${mode}`
  this.stack = ((new Error())).stack
}
```

Reasons why this is preferable:

1. Errors like this are emailed to the player
1. You get a stack trace
