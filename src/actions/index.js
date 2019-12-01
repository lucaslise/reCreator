import {
  SET_VISIBLE_NFA,
  SET_VISIBLE_DFA,
  SET_AUTOMATA_VIEW
} from './actionTypes';

export const setVisibleDFA = value => ({
  type: SET_VISIBLE_DFA,
  visibleDFA: value
});

export const setVisibleNFA = value => ({
  type: SET_VISIBLE_NFA,
  visibleNFA: value
});

export const setAutomataView = value => ({
  type: SET_AUTOMATA_VIEW,
  automataView: value
});