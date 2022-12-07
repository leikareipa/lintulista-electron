# lintulista-electron

[Electron](https://www.electronjs.org/) wrapping to convert the deprecated SaaS web app Lintulista &ndash; previously made up of [lintulista-client](https://github.com/leikareipa/lintulista-client) and [lintulista-server](https://github.com/leikareipa/lintulista-server) &ndash; into a desktop app.

![A screenshot of Lintulista](./screenshot.webp)

The gist of Lintulista is that it lets the user create and govern lists of bird sightings, with a visually rewarding presentation. The program is intended for casual use, generally for keeping track of the date on which you first observed a particular species in a given year.

This Electron version of Lintulista has been made with Linux (Ubuntu) in mind. You may need to adapt it to suit other operating environments.

## How this repo is organized

The [client](./client/) comprises the app's GUI, while the [server](./server/) mediates access (fetching, adding, and removing observations) to the [database](./distributable/database/) of lists. The [distributable](./distributable/) is what you copy and distribute to whoever you want to give the app &ndash; making sure the copy expands symlinks.

## Getting started

1. Install the dependencies: `$ yarn run install-all`
2. Refresh the distributable: `$ yarn run build-all`
3. View a sample list: `$ cd distributable && ./lintulista samplelst && cd -`
    - Note: You may need to give the `lintulista` file executable permission first.

### Creating a new list

Have a look at the default sample list, [samplelst.json](./distributable/database/samplelst.json). You can use it as a template for creating new lists.

To create a new list, make a copy of **samplelst.json** and give the copy a new filename (must be 9 characters from the range [a-z0-9], and with the `.json` suffix). Reflect the base filename in the `key` property of the file's JSON content, and set the `observations` property to an empty string. Leave the other properties as is.

For example, if your new list's `key` is "abcdefghi", you'd name the file **abcdefghi.json**, and open it in Lintulista by running `$ ./lintulista abcdefghi` from the [distributable](./distributable) folder.
