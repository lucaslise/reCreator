import React from "react";
import AppContainer from "./containers/App";
import {
  Provider
} from 'react-redux';
import {
  Store
} from './store';

const App = () => (
  <Provider store={Store}>
    <AppContainer />
  </Provider>
)

export default App