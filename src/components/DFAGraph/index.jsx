import React from "react";
import PropTypes from 'prop-types'
import Graph from "react-graph-vis";
import _ from 'lodash'

const getNodeColor = (accept, currentState, index) => {
  const indexInCurrentState = currentState == index

  if (index === 0 && indexInCurrentState && accept) {
    return '#c4ef9c' // green
  } else if (indexInCurrentState && accept) {
    return '#c4ef9c' // green
  } else if (indexInCurrentState) {
    return '#ec9a9a' // red
  } else {
    return '#fff'
  }
}

const getBorderColor = (accept, index) => {
  if (index === -1) return '#fff'

  return accept ? 'gray' : '#000000'
}

export const DFAGraph = ({ dfa, inputValue, automataView }) => {
  const [vis, setVis] = React.useState(null)

  React.useEffect(() => {
    try {
      vis && vis.updateGraph()
    } catch (error) {
      console.log(error)
    }
  }, [dfa])

  if (!dfa) return null

  const getNodes = (sm) => {
    const currentState = _.get(dfa.match(inputValue), 'currentState')

    return _.times(_.get(sm, 'numOfStates', 0) + 1, (key) => {
      const index = key - 1
      const isNodeAccept = _.includes(_.get(sm, 'acceptStates', []), _.toString(index))

      return {
        id: index,
        label: index === -1 ? '' : 'q' + index,
        font: {
          size: 20,
        },
        color: {
          border: getBorderColor(isNodeAccept, index),
          background: getNodeColor(isNodeAccept, currentState, index),
        },
        borderWidth: isNodeAccept ? 7 : 1,
        shape: 'circle',
        size: 25,
        margin: 20,
      }
    })
  }

  const getEdges = (sm) => {
    const transitions = _.get(sm, 'transitions')
    let edges = [{
      from: -1,
      to: 0,
    }]

    _.forIn(transitions, (value, key) => {
      _.forIn(value, (v, k) => {
        edges.push({
          from: key,
          to: k,
          label: v,
          width: 1,
        })
      })
    })

    return edges
  }

  const options = {
    autoResize: true,
    layout: {
      hierarchical: {
        direction: "LR",
        sortMethod: "directed"
      },
      improvedLayout: false,
    },
    edges: {
      arrows: { to: { scaleFactor: 1 } },
      font: {
        size: 33,
      },
      color: { inherit: false },
      smooth: { type: automataView },
    },
    height: "95%",
    width: "95%",
    physics: false
  };

  return (
    <Graph
      graph={{
        nodes: getNodes(dfa),
        edges: getEdges(dfa)
      }}
      options={options}
      ref={v => setVis(v)}
    />
  );
}

DFAGraph.propTypes = {
  dfa: PropTypes.object,
  inputValue: PropTypes.string,
  automataView: PropTypes.string.isRequired,
}
