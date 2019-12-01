import React from 'react';
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid';
import _ from 'lodash'
import Checkbox from '@material-ui/core/Checkbox';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setVisibleDFA, setVisibleNFA, setAutomataView } from '../../../../actions';
import { RegexRules } from '../../../../components'
import Chip from '@material-ui/core/Chip';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Snackbar from '@material-ui/core/Snackbar';
import Radio from '@material-ui/core/Radio';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const titleStyle = {
  fontSize: 20,
  padding: 10,
  fontWeight: 'bold',
  borderBottom: '1px solid #cacaca',
}

const Settings = ({ visible, onClose, visibleNFA, visibleDFA, setVisibleDFA, setVisibleNFA, automataView, setAutomataView }) => {
  const [copied, setCopied] = React.useState(false)

  return (
    <Drawer anchor="right" open={visible} onClose={onClose}>
      <Grid style={{ padding: 10, width: 600 }}>
        <List>
          <div align="center" style={titleStyle}>
            Regex referências
          </div>
          <ListItem>
            <RegexRules />
          </ListItem>
          <div align="center" style={titleStyle}>
            Configurações
          </div>
          <ListItem alignItems="flex-start" style={{ marginTop: 10 }}>
            Modo de visualização dos grafos:
            <Select
              style={{ marginLeft: 20, marginTop: -5 }}
              labelId="demo-simple-select-placeholder-label-label"
              id="demo-simple-select-placeholder-label"
              value={automataView}
              onChange={(event) => setAutomataView(event.target.value)}
            >
              <MenuItem value="dynamic">Dinâmico</MenuItem>
              <MenuItem value="continous">Contínuo</MenuItem>
              <MenuItem value="horizontal">Horizontal</MenuItem>
              <MenuItem value="vertical">Vertical</MenuItem>
              <MenuItem value="cubicBezier">Cúbico</MenuItem>
              <MenuItem value="curvedCCW">Curvado</MenuItem>
            </Select>
          </ListItem>
          <ListItem alignItems="flex-start">
            <ListItemText
              primary="Ocultar autômatos:"
              secondary={
                <React.Fragment>
                  <div>
                    <Checkbox
                      checked={visibleNFA}
                      onChange={() => {
                        localStorage.setItem('visibleNFA', _.toString(!visibleNFA))
                        setVisibleNFA(!visibleNFA)
                      }}
                    />
                    Autômato Finito nâo Determinístico (AFND)
                  </div>
                  <div>
                    <Checkbox
                      checked={visibleDFA}
                      onChange={() => {
                        localStorage.setItem('visibleDFA', _.toString(!visibleDFA))
                        setVisibleDFA(!visibleDFA)
                      }}
                    />
                    Autômato Finito Determinístico (AFD)
                  </div>
                </React.Fragment>
              }
            />
          </ListItem>
          <div align="center" style={titleStyle}>
            Regex exemplos
            <div style={{ fontSize: 12, fontWeight: 100 }}>
              Clique no item para copiar
            </div>
          </div>
          <ListItem>
            {
              _.map(['(abc)|(bbc)', '(2|3)*', '(aba)|(abb)', '[a-h]'], (v, index) => (
                <React.Fragment key={index}>
                  <CopyToClipboard text={v} onCopy={() => setCopied(true)}>
                    <Chip
                      label={v}
                      clickable
                      style={{ marginLeft: 5 }}
                      title="Copiar"
                    />
                  </CopyToClipboard>
                </React.Fragment>
              ))
            }
            <Snackbar
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              autoHideDuration={2000}
              open={copied}
              onClose={() => setCopied(false)}
              ContentProps={{
                'aria-describedby': 'message-id',
              }}
              message={<span id="message-id">Copiado!</span>}
            />
          </ListItem>
        </List>
      </Grid>
    </Drawer>
  );
};

Settings.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  setAutomataView: PropTypes.func.isRequired,
  setVisibleDFA: PropTypes.func.isRequired,
  setVisibleNFA: PropTypes.func.isRequired,
  visibleDFA: PropTypes.bool.isRequired,
  visibleNFA: PropTypes.bool.isRequired
};

const mapStateToProps = store => ({
  visibleDFA: store.settingsState.visibleDFA,
  visibleNFA: store.settingsState.visibleNFA,
  automataView: store.settingsState.automataView,
});

const mapDispatchToProps = dispatch => bindActionCreators({ setVisibleDFA, setVisibleNFA, setAutomataView }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
