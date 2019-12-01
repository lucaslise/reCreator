import {
  TOKEN_TYPE
} from './utils/constants'
import FSM from './FSM'
import Token from './Token'
import NFAState from './NFAState'

export default class NFA {
  constructor(startState, endState) {
    this.startState = startState;
    this.endState = endState;
  };

  toDFA() {
    const nfaGraph = this._constructGraph(this.startState);
    const alphabetTable = this._getAlphabetTable(nfaGraph)
    const variables = this._getDFAVariables(nfaGraph, alphabetTable)
    return this._constructNFA(variables)
  }

  _getAlphabetTable(nfaGraph) {
    var alphabetTable = {};
    for (var id in nfaGraph) {
      for (var j = 0; j < nfaGraph[id].length; ++j) {
        var label = nfaGraph[id][j][0];
        if (!alphabetTable.hasOwnProperty(label) && label != TOKEN_TYPE.EMPTY)
          alphabetTable[label] = 1;
      }
    }

    return alphabetTable
  }

  _getDFAVariables(nfaGraph, alphabetTable) {
    var dStates = [];
    var states2Id = {};
    var id2States = {};
    var id = 0;
    var closure = this._emptyClosure([this.startState.id], nfaGraph);
    states2Id[JSON.stringify(closure)] = id;
    id2States[id] = closure;
    dStates.push({
      id: id++,
      nextStates: {},
      vis: false
    });

    dStates[dStates.length - 1].accept = closure.indexOf(this.endState.id) != -1;
    dStates[dStates.length - 1].initial = closure.indexOf(this.startState.id) != -1;
    var unvisCnt = 1;

    while (unvisCnt) {
      var unvisState;
      unvisState = dStates.filter(function (state) {
        return !state.vis;
      })[0];
      unvisState.vis = true;
      --unvisCnt;
      for (var letter in alphabetTable) {
        if (letter == TOKEN_TYPE.EMPTY) continue;

        var nextStates = this._emptyClosure(this._move(unvisState, letter, id2States, nfaGraph), nfaGraph);

        if (!nextStates.length) continue;
        var nextStatesString = JSON.stringify(nextStates);
        if (!states2Id.hasOwnProperty(nextStatesString)) {
          states2Id[nextStatesString] = id;
          id2States[id] = nextStates;
          dStates.push({
            id: id++,
            nextStates: {},
            vis: false,
            accept: nextStates.indexOf(this.endState.id) != -1,
            initial: nextStates.indexOf(this.startState.id) != -1
          });
          ++unvisCnt;
        }

        unvisState.nextStates[letter] = nextStates;
      }
    }

    return {
      numOfStates: id,
      dStates,
      alphabetTable,
      states2Id
    }
  }

  _constructNFA({
    numOfStates,
    dStates,
    alphabetTable,
    states2Id
  }) {
    const dfa = new FSM();
    dfa.numOfStates = numOfStates;

    for (var i = 0; i < dStates.length; ++i) {
      if (dStates[i].initial) dfa.initialState = dStates[i].id.toString();
      if (dStates[i].accept) dfa.acceptStates.push(dStates[i].id.toString());

      for (var letter in alphabetTable) {
        if (!dStates[i].nextStates[letter]) continue;
        const arrayId = [];
        for (var j = 0; j < dStates[i].nextStates[letter].length; ++j) arrayId.push(dStates[i].nextStates[letter][j]);
        if (arrayId.length) {
          if (!dfa.transitions[dStates[i].id]) dfa.transitions[dStates[i].id] = {}
          dfa.transitions[dStates[i].id][states2Id[JSON.stringify(arrayId)]] = letter;
        }
      }
    }

    return dfa;
  }

  _emptyClosure(nfaStates, nfaGraph) {
    var closure = [];
    var stack = [];
    for (var i = 0; i < nfaStates.length; ++i) {
      stack.push(nfaStates[i]);
      closure.push(nfaStates[i]);
    }
    while (stack.length) {
      var stateId = stack.shift();
      for (var i = 0; i < nfaGraph[stateId].length; ++i) {
        var nextId = nfaGraph[stateId][i][1];
        var label = nfaGraph[stateId][i][0];
        if (label == TOKEN_TYPE.EMPTY && closure.indexOf(nextId) == -1) {
          closure.push(nextId);
          stack.push(nextId);
        }
      }
    }
    closure.sort(function (a, b) {
      return a < b;
    });
    return closure;
  }

  _move(dfaState, letter, id2States, nfaGraph) {
    var stateArray = id2States[dfaState.id];
    var result = [];
    for (var i = 0; i < stateArray.length; ++i) {
      var id = stateArray[i];
      for (var k = 0; k < nfaGraph[id].length; ++k) {
        var label = nfaGraph[id][k][0];
        if (label == letter) {
          result.push(nfaGraph[id][k][1]);
        }
      }
    }
    result.sort(function (a, b) {
      return a < b;
    });
    return result;
  }

  _constructGraph(startState) {
    var nfaGraph = {};
    var queue = [];
    queue.push(startState);
    var vis = {};
    while (queue.length) {
      var state = queue.shift();
      nfaGraph[state.id] = [];
      for (var i = 0; i < (state.nextStates).length; ++i) {
        var nextId = state.nextStates[i][1].id;
        var label = state.nextStates[i][0].text;
        var nextState = state.nextStates[i][1];
        nfaGraph[state.id].push([label, nextId]);
        if (nextId in vis) continue;
        vis[nextId] = 1;
        queue.push(state.nextStates[i][1]);
      }
    };
    return nfaGraph;
  }
}

export const EMPTYTOKEN = new Token(TOKEN_TYPE.EMPTY, 'ε');

export function contructNFAsUsingOR(subNFA1, subNFA2, parser) {
  var newNFA = new NFA(new NFAState(parser.id++, false), new NFAState(parser.id++, true));
  subNFA1.endState.isAccept = false;
  subNFA2.endState.isAccept = false;

  newNFA.startState.addStates(EMPTYTOKEN, subNFA1.startState);
  newNFA.startState.addStates(EMPTYTOKEN, subNFA2.startState);
  subNFA1.endState.addStates(EMPTYTOKEN, newNFA.endState);
  subNFA2.endState.addStates(EMPTYTOKEN, newNFA.endState);
  return newNFA;
}

export function constructCharacterNFA(characters, parser) {
  var nfa = new NFA(new NFAState(parser.id++, false), new NFAState(parser.id++, true));
  for (var i = 0; i < characters.length; ++i) {
    var subNFA = new NFA(new NFAState(parser.id++, false), new NFAState(parser.id++, false));

    subNFA.startState.addStates(EMPTYTOKEN, subNFA.endState);
    nfa.startState.addStates({
      text: characters[i]
    }, subNFA.startState);
    subNFA.endState.addStates(EMPTYTOKEN, nfa.endState);
  }

  return nfa;
}