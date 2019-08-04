# Screeps

All my code for [Screeps](http://screeps.com).

## Use

There are [much more mature Screeps codebases out there](https://github.com/search?o=desc&q=topic%3Ascreeps+topic%3Aai&s=stars&type=Repositories) if you want an introduction to serious AI concepts and logic. But if you want to learn from the ground up like I'm doing, feel free to fork my codebase and use it as your own starting point.

> :rotating_light: **Note:** This is not intended to be a stable platform. I reserve the right to completely burn the whole thing down and start over. I've done it twice already :grinning:

### Getting started

1. Install Node (see [the Screeps documentation for which version to use](https://docs.screeps.com/architecture.html))
1. Clone the repository
1. Run `npm install`
1. Copy `dist/username.js.example` to `dist/username.js`
1. Replace the example username in `dist/username.js` with your own Screeps username

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
