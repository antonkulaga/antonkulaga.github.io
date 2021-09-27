# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Installing dependencies ##

### Linux ###

The project depends on nodejs and yarn. Note: official software sources of Linux distributions rely on outdated versions of node and yarn
The easiest way to install latest nodejs is using https://github.com/nvm-sh/nvm
```bash
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
nvm install node
```
Then install yarn and use it for dependencies resolution:
```bash
npm install -g yarn
yarn install
```

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.


## Code and architecture

The code is written in typescript and is based on React as well as [3d-force-graph-vr](https://vasturiano.github.io) library.
It loads cytoscape graphs (at the moment synergy age graphs are used) and visualizes them in 3D.

The final code is published to index_bundle.js and index.html, and uses the content of public, media and graph folders.
Paths to the networks are specified in  ./src/App.tsx and are computed ad networkBase + Route.path.