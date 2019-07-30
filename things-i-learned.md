# Things I Learned

Part of the fun of Screeps is the process of learning the little tidbits of knowledge you need in order to make better use of the API or the strategies that you discover along the way. This is where I record the things I figure out.

## API

### Don't overfill

The [`Creep.transfer()` function](https://docs.screeps.com/api/#Creep.transfer) accepts an optional `amount` parameter. The default value for `amount` is "everything the creep is carrying", meaning that if you transfer more than the target can accept, you've wasted the excess.
