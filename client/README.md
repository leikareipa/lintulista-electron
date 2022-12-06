# [lintulista-electron](https://github.com/leikareipa/lintulista-electron/) / client

An adaptation of the original [Lintulista client](https://www.github.com/leikareipa/lintulista-client), for use with the Electron version of Lintulista.

The client provides the app's React-based GUI.

## How the files are organized

The [source](./source/) folder provides the unbuilt React/JavaScript source code, while [distributable](./distributable/) holds the corresponding built code intended for distribution with lintulista-electron. The [tools](./tools/) folder contains a selection of custom dev tools.

## Getting started

The base lintulista-electron repo provides scripts for installing and building the app as a whole, but if you want to operate specifically on this client:

1. Install the dependencies: `$ yarn install`
2. Build the code: `$ yarn run build`

## Credits

Developed by [Tarpeeksi Hyvae Soft](https://www.tarpeeksihyvaesoft.com).

The bird thumbnail images bundled with the distributable come from a variety of authors. See [distributable/guide/images.html](./distributable/guide/images.html) for a full list.

Some third-party [fonts](./distributable/fonts/) are included.

Icons from [Font Awesome](https://fontawesome.com/) are also bundled.
