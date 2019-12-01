import {
  settingsReducer
} from './settingsReducer';
import {
  combineReducers
} from 'redux';

export const Reducers = combineReducers({
  settingsState: settingsReducer,
});