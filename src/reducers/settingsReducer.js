import {
  SET_VISIBLE_NFA,
  SET_VISIBLE_DFA,
  SET_AUTOMATA_VIEW
} from '../actions/actionTypes'
import _ from 'lodash'

const storageNFA = _.isNull(localStorage.getItem('visibleNFA')) || localStorage.getItem('visibleNFA') === 'true'
const storageDFA = _.isNull(localStorage.getItem('visibleDFA')) || localStorage.getItem('visibleDFA') === 'true'

const initialState = {
  visibleDFA: _.isNil(storageDFA) ? true : storageDFA,
  visibleNFA: _.isNil(storageNFA) ? true : storageNFA,
  automataView: ''
};

export const settingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_VISIBLE_NFA:
      return {
        ...state,
        visibleNFA: action.visibleNFA
      };
    case SET_VISIBLE_DFA:
      return {
        ...state,
        visibleDFA: action.visibleDFA
      };
    case SET_AUTOMATA_VIEW:
      return {
        ...state,
        automataView: action.automataView
      };
    default:
      return state;
  }
};