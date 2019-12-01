import {
  TOKEN_TYPE
} from './utils/constants'
import Tokenizer from './Tokenizer'
import NFAState from './NFAState'
import NFA, {
  EMPTYTOKEN,
  contructNFAsUsingOR,
  constructCharacterNFA
} from './NFA'
import FSM from './FSM'
import _ from 'lodash'

export default class Parser {
  constructor(regString) {
    this.nfa = null;
    this.id = 0;
    this.lexer = new Tokenizer(regString);
    this.lookHead = this.lexer.nextToken();
  }

  parseToNFA() {
    this.nfa = this._resolveExpression();
    this._reorderNFA();
    return this._transformToFSM();
  }

  parseToDFA() {
    this.parseToNFA();
    return this.nfa.toDFA();
  }

  _transformToFSM() {
    var fsm = new FSM();
    var queue = [];
    var vis = {};
    queue.push(this.nfa.startState);

    fsm.initialState = this.nfa.startState.id.toString();
    fsm.numOfStates = this.id;
    fsm.type = 'NFA';

    vis[this.nfa.startState.id] = 1;
    while (queue.length) {
      var state = queue.shift();
      for (var i = 0; i < (state.nextStates).length; ++i) {
        var nextState = state.nextStates[i][1];

        if (!fsm.transitions[state.id]) fsm.transitions[state.id] = {};
        fsm.transitions[state.id][nextState.id] = state.nextStates[i][0].text;
        if (nextState.id in vis) continue;
        vis[nextState.id] = 1;
        if (nextState.isAccept) fsm.acceptStates.push(nextState.id.toString());
        queue.push(state.nextStates[i][1]);
      }
    }
    return fsm;
  }

  _reorderNFA() {
    var queue = [];
    var ordered = [];
    var vis = {};
    queue.push(this.nfa.startState);
    this.id = 0;
    vis[this.nfa.startState.id] = 1;

    while (queue.length) {
      const state = queue.shift();
      ordered.push(state);

      for (var i = 0; i < (state.nextStates).length; ++i) {
        var nextId = state.nextStates[i][1].id;
        if (nextId in vis) continue;
        vis[nextId] = 1;
        queue.push(state.nextStates[i][1]);
      }
    }
    while (ordered.length) {
      var state = ordered.shift();
      state.id = this.id++;
    }
  }

  _resolveExpression() {
    var expressionNFA = this._resolveExpressionWithoutOr();
    if (_.isEqual(this.lookHead.type, TOKEN_TYPE.OR)) {
      this._read(TOKEN_TYPE.OR);
      return contructNFAsUsingOR(expressionNFA, this._resolveExpression(), this);
    }

    return expressionNFA;
  }

  _resolveExpressionWithoutOr() {
    var nfa = this._resolveHeadWithFactor();
    if (_.isEqual(this.lookHead.type, TOKEN_TYPE.REGCHAR) ||
      _.isEqual(this.lookHead.type, TOKEN_TYPE.EXTEND) ||
      _.isEqual(this.lookHead.type, TOKEN_TYPE.LPARENTHESIS) ||
      _.isEqual(this.lookHead.type, TOKEN_TYPE.LBRACE) ||
      _.isEqual(this.lookHead.type, TOKEN_TYPE.LBRACKET)
    ) {
      var subNFA = this._resolveExpressionWithoutOr();
      nfa.endState.isAccept = false;
      nfa.endState.id = subNFA.startState.id;
      nfa.endState.nextStates = subNFA.startState.nextStates;
      subNFA.startState = null;

      return new NFA(nfa.startState, subNFA.endState);
    }

    return nfa;
  }

  _resolveHeadWithFactor() {
    var headNFA = this._resolveHead();

    switch (this.lookHead.type) {
      case TOKEN_TYPE.PLUS:
        var nfa = new NFA(new NFAState(this.id++, false), new NFAState(this.id++, true));
        headNFA.endState.isAccept = false;
        nfa.startState.addStates(EMPTYTOKEN, headNFA.startState);
        headNFA.endState.addStates(EMPTYTOKEN, headNFA.startState);
        headNFA.endState.addStates(EMPTYTOKEN, nfa.endState);
        this._read(TOKEN_TYPE.PLUS);

        return nfa;
      case TOKEN_TYPE.STAR:
        var nfa = new NFA(new NFAState(this.id++, false), new NFAState(this.id++, true));
        headNFA.endState.isAccept = false;

        nfa.startState.addStates(EMPTYTOKEN, headNFA.startState);
        nfa.startState.addStates(EMPTYTOKEN, nfa.endState);
        headNFA.endState.addStates(EMPTYTOKEN, nfa.endState);
        headNFA.endState.addStates(EMPTYTOKEN, headNFA.startState);

        this._read(TOKEN_TYPE.STAR);
        return nfa;
      case TOKEN_TYPE.ALTER:
        var nfa = new NFA(new NFAState(this.id++, false), new NFAState(this.id++, true));
        headNFA.endState.isAccept = false;

        nfa.startState.addStates(EMPTYTOKEN, headNFA.startState);
        nfa.startState.addStates(EMPTYTOKEN, nfa.endState);
        headNFA.endState.addStates(EMPTYTOKEN, nfa.endState);

        this._read(TOKEN_TYPE.ALTER);
        return nfa;
      case TOKEN_TYPE.Unknown:
        throw new Error("Tipo desconhecido: " + this.lookHead.text);
      default:
        return headNFA;
    }
  }

  _resolveHead() {
    switch (this.lookHead.type) {
      case TOKEN_TYPE.REGCHAR:
        var nfa = new NFA(new NFAState(this.id++, false), new NFAState(this.id++, true));
        nfa.startState.addStates(this.lookHead, nfa.endState);
        this._read(TOKEN_TYPE.REGCHAR);
        return nfa;
      case TOKEN_TYPE.LPARENTHESIS:
        this._read(TOKEN_TYPE.LPARENTHESIS);
        var nfa = this._resolveExpression();
        this._read(TOKEN_TYPE.RPARENTHESIS);
        return nfa;
      case TOKEN_TYPE.LBRACKET:
        this._read(TOKEN_TYPE.LBRACKET);
        var allCharacters = this._bracketExpression();
        var nfa = constructCharacterNFA(allCharacters, this);
        this._read(TOKEN_TYPE.RBRACKET);
        return nfa;
      case TOKEN_TYPE.EXTEND:
        if (this.lookHead.text == '\d') return this._getNFADigits();
        else if (this.lookHead.text == '\w') return this._getNFAWords();
      default:
        throw new Error('Expressão inválida: ' + this.lookHead.text);
    }
  }

  _bracketExpression() {
    var aux = ''

    while (this.lookHead.type != TOKEN_TYPE.RBRACKET) {
      if (_.isEqual(this.lookHead.type, TOKEN_TYPE.END)) throw new Error('expressão inválida');

      aux += this.lookHead.text
      this._read(this.lookHead.type)
    }

    const command = aux.split('-')
    if (command.length !== 2 || aux.length === 0) throw new Error('expressão inválida');
    const start = command[0].charCodeAt(0);
    const end = command[1].charCodeAt(0);

    const response = []

    for (let index = start; index <= end; index++) {
      response.push(String.fromCharCode(index))
    }

    return response;
  }

  _read(type) {
    if (_.isEqual(this.lookHead.type, type)) this.lookHead = this.lexer.nextToken();
    else throw new Error('Tipo desconhecido: ' + this.lookHead.text);
  }

  _getNFAWords() {
    var allCharacters = (this._getValidDigits()).concat(
      Array.apply(null, {
        length: 26
      }).map(
        function (x, i) {
          return String.fromCharCode(97 + i)
        }));
    allCharacters = allCharacters.concat(Array.apply(null, {
        length: 26
      })
      .map(function (x, i) {
        return String.fromCharCode(65 + i)
      }));
    allCharacters.push('_');

    var nfa = constructCharacterNFA(allCharacters, this);
    this._read(TOKEN_TYPE.EXTEND);

    return nfa
  }

  _getNFADigits() {
    var nfa = constructCharacterNFA(this._getValidDigits(), this);
    this._read(TOKEN_TYPE.EXTEND);
    return nfa;
  }

  _getValidDigits() {
    return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  }
}