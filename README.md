# electron-typescript-react-starter
> a custom configuration of [electron-webpack-quick-start](https://github.com/electron-userland/electron-webpack-quick-start) with [typeorm](https://github.com/typeorm/typeorm) via [sql.js](https://github.com/kripken/sql.js/) for portable persistent storage, [react-redux](https://github.com/reduxjs/react-redux) for state-management, [formik](https://github.com/jaredpalmer/formik) for form-building, [Bootstrap 4](https://getbootstrap.com/) for layout styling and [Photon](http://photonkit.com/) for native app styling.

Make sure to check out [electron-webpack's documentation](https://webpack.electron.build/) for available plugins and add-ons.

## Quickstart
```
yarn install
yarn dev
```

### Development Scripts

```bash
# run application in development mode
yarn dev

# compile source code and create webpack output
yarn compile

# `yarn compile` & create build with electron-builder
yarn dist

# `yarn compile` & create unpacked build with electron-builder
yarn dist:dir
```
