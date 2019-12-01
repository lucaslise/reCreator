import React from 'react';
import Grid from '@material-ui/core/Grid';

const rows = [
  {
    pattern: 'a+',
    description: "Um ou mais a's",
  },
  {
    pattern: 'a*',
    description: "Zero ou mais a's",
  },
  {
    pattern: 'a?',
    description: 'Zero ou um a',
  },
  {
    pattern: '(...)',
    description: 'Encapsula expressão',
  },
  {
    pattern: 'a|b',
    description: 'a ou b',
  },
  {
    pattern: '\\w',
    description: '[a-zA-Z0-9_]',
  },
  {
    pattern: '\\d',
    description: '[0-9]'
  },
  {
    pattern: '[a-z]',
    description: 'Qualquer caractere entre a-z'
  }
]

export const RegexRules = () => {
  return (
    <div style={{ width: '1000px' }}>
      <Grid item>
        <div style={{ display: 'grid' }}>
          {rows.map(r => {
            return (
              <div style={{ display: 'inline-flex', paddingBottom: 10 }}>
                <div style={{ width: 80 }}><b>{r.pattern}</b></div>
                <div>{r.description}</div>
              </div>
            )
          })}
        </div>
      </Grid>
    </div>
  );
};
