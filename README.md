# Screeps

All my code for [Screeps](http://screeps.com).

## Use

### Getting started

1. Install Node (see [the Screeps documentation for which version to use](https://docs.screeps.com/architecture.html))
1. Clone the repository
1. Run `npm install`

### Building

The code doesn't need to be built, but you can autoformat the code using `npm run build`. Autoformatting also happens before deploys.

### Deploying

1. Copy `.screeps.json.example` to `.screeps.json`
1. Add your own credentials to the `.screeps.json` file
1. Deploy any code changes with `npm run deploy`

## Documentation

* [Documentation](docs/README.md)

## License

With the exception of `dist/watch-client.js`, the code in this repository is available under the [MIT license](LICENSE.md) in this repository.

`dist/watch-client.js` is used with permission under [the license in `screepers/screeps-multimeter`](https://github.com/screepers/screeps-multimeter/blob/3acc45e2c0ca3c2f4bddd0dc795daa05e03fe01b/LICENSE).
