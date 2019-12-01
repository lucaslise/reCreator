import React from 'react';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { NFAGraph, DFAGraph } from '../../components'
import PropTypes from 'prop-types'
import SettingIcon from '@material-ui/icons/Settings';
import Fab from '@material-ui/core/Fab';
import Parser from '../../services/Parser'
import _ from 'lodash'
import Settings from './components/Settings'
import { connect } from 'react-redux';

const Home = ({ visibleNFA, visibleDFA, automataView }) => {
  const [pattern, setPattern] = React.useState('');
  const [input, setInput] = React.useState('');
  const [settingsVisible, setSettingsVisible] = React.useState(false);

  let error = null
  let parser = new Parser()
  let nfa = null
  let dfa = null

  try {
    if (pattern.length) {
      parser = new Parser(pattern)
      nfa = parser.parseToNFA()

      parser = new Parser(pattern)
      dfa = parser.parseToDFA()
    }

  } catch (e) {
    error = e.message
  }

  const acceptedSentence = pattern.length === 0 || dfa && dfa.match(input).status

  return (
    <div style={{ backgroundColor: '#fff', padding: 15 }}>
      <Grid container spacing={3}>
        <Grid item xs={3} style={{ padding: 0, paddingRight: 5, paddingLeft: 10 }}>
          <TextField
            autoFocus
            id="pattern"
            error={!_.isEmpty(error)}
            fullWidth
            label="Padrão"
            margin="normal"
            variant="outlined"
            onChange={(value) => {
              setPattern(value.target.value)
            }}
          />
          <div style={{ color: 'red' }}>
            {error}
          </div>
        </Grid>
        <Grid item xs={3} style={{ padding: 0, paddingRight: 5, paddingLeft: 5 }}>
          <TextField
            id="input"
            fullWidth
            label="Entrada"
            margin="normal"
            variant="outlined"
            error={!acceptedSentence}
            onChange={(value) => setInput(value.target.value)}
          />
        </Grid>
        <Grid item xs={2} style={{ padding: 0, paddingRight: 5, paddingLeft: 5 }}>
          <Fab aria-label="add" style={{ marginTop: 15 }} onClick={() => setSettingsVisible(true)}>
            <SettingIcon />
          </Fab>
          <Settings visible={settingsVisible} onClose={() => setSettingsVisible(false)} />
        </Grid>
        <Grid item xs={3} style={{ padding: 0, paddingRight: 5, paddingLeft: 10 }}>
          {pattern.length > 0 && <div align="center"
            style={{
              height: '75%',
              fontSize: 30,
              marginTop: 15,
              color: '#ffffff',
              borderRadius: 5,
              fontWeight: 'bold',
              display: 'grid',
              alignContent: 'center',
              backgroundColor: acceptedSentence ? '#c4ef9c' : '#ec9a9a',
            }}>
            {acceptedSentence ? 'Aceita' : 'Rejeitada'}
          </div>}
        </Grid>
        {
          visibleNFA && (
            <Grid item xs={visibleDFA ? 6 : 12} style={{ padding: 10 }}>
              <div style={{ color: '#000000', borderRadius: 8, height: '88vh' }}>
                <div align="center" style={{ fontSize: 20, padding: 10 }}>Autômato Finito Não Determinístico</div>
                <NFAGraph nfa={nfa} automataView={automataView} />
              </div>
            </Grid>)
        }
        {
          visibleDFA && (
            <Grid item xs={visibleNFA ? 6 : 12} style={{ padding: 10 }}>
              <div style={{ color: '#000000', borderRadius: 8, height: '88vh' }}>
                <div align="center" style={{ fontSize: 20, padding: 10 }}>Autômato Finito Determinístico</div>
                <DFAGraph dfa={dfa} automataView={automataView} inputValue={input} />
              </div>
            </Grid>)
        }
      </Grid>
    </div >
  );
};

Home.propTypes = {
  visibleDFA: PropTypes.bool.isRequired,
  visibleNFA: PropTypes.bool.isRequired
};

const mapStateToProps = store => ({
  visibleDFA: store.settingsState.visibleDFA,
  visibleNFA: store.settingsState.visibleNFA,
  automataView: store.settingsState.automataView,
});

export default connect(mapStateToProps)(Home);
