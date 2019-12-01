import _ from 'lodash'

class CurrentState {
  constructor(status, currentState) {
    this.status = status
    this.currentState = currentState
  }
}

export default class FSM {
  constructor() {
    this.acceptStates = [];
    this.transitions = {};
  };

  match(text) {
    var currentState = this.initialState;

    for (var i = 0; i < text.length; ++i) {
      if (!this.transitions[currentState]) return new CurrentState(false, null);

      const findState = this._findTransitionState(text[i], currentState)

      if (!findState) return new CurrentState(false, null);

      currentState = findState
    }

    return new CurrentState(_.includes(this.acceptStates, currentState), currentState)
  }

  _findTransitionState(text, currentState) {
    var state = null

    for (var nextState in this.transitions[currentState]) {
      if (this.transitions[currentState][nextState] == text) {
        state = nextState;
        break;
      }
    }

    return state
  }
}