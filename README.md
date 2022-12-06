# lintulista-electron

[Electron](https://www.electronjs.org/) wrapping to convert the deprecated SaaS web app previously made up of [lintulista-client](https://github.com/leikareipa/lintulista-client) and [lintulista-server](https://github.com/leikareipa/lintulista-server) into a desktop app.

This project is work in progress.

![A screenshot of Lintulista](./screenshot.webp)

## Getting started

1. Install the dependencies: `$ yarn run install-all`
2. Refresh the distributable: `$ yarn run build-all`
3. View a sample list: `$ cd distributable && ./lintulista samplelst && cd -`

### How this repo is organized

The [client](./client/) comprises the app's GUI, while the [server](./server/) mediates access (fetching, adding, and removing observations) to the [database](./distributable/database/) of lists. The [distributable](./distributable/) is what you copy and distribute to whoever you want to give the app &ndash; making sure to expand the symlinks in the copy.

### Adding a new list

Have a look at the default sample list, [samplelst.json](./distributable/database/samplelst.json). You can use it as a template for creating new lists.

To create a new list, make a copy of **samplelst.json** and give the copy a new filename. Reflect the base filename in the list's `key` property, and set the `observations` property to an empty string. Leave any other properties as is.

For example, if your new list's key is "abcdefghi" (keys must be 9 characters from the range [a-z0-9]), you'd name the file **abcdefghi.json**, and open the list in the app by running `$ ./lintulista abcdefghi` from the [distributable](./distributable) folder.
