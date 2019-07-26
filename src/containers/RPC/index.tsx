import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Card } from '@blueprintjs/core';

import NodeInformation from 'components/NodeInformation';
import './index.scss';

import MOCK_UP_NODE from './test_node.json';
import { call, changeNode } from './actions';
import DataScrollable from 'components/DataScrollable';

type Props = {
  actions: any,
  match: any,
  nodes: any,
  node: any,
  gettingTokens: boolean,
  history: any,
  calling: boolean,
  result: any,
  method: string,
}

type State = {
  methods: any,
}

const DEFAULT_METHODS = {
  'GetBeaconBestState': { params: '[]', result: '' },
  'GetShardBestState': { params: '[]', result: '' },
  'GetMempoolInfo': { params: '[]', result: '' },
  'GetBeaconPoolState': { params: '[]', result: '' },
  'GetShardPoolState': { params: '[]', result: '' }
};

class Tokens extends Component<Props, State> {
  state = {
    methods: { ...DEFAULT_METHODS },
  };

  nodeId: string = '';

  componentDidMount() {
    this.getNode();
  }

  componentDidUpdate(prevProps: Props) {
    const { match: prevMatch, node: prevNode, result: prevResult } = prevProps;
    const {
      match, node, method, result,
    } = this.props;
    const prevNodeId = prevMatch.params.nodeId || _.get(prevNode, 'id');
    const currentNodeId = match.params.nodeId || _.get(node, 'id');

    if (prevNodeId !== currentNodeId) {
      this.getNode();
    }

    if (prevResult !== result) {
      const newMethods : any = { ...this.state.methods };
      newMethods[method].result = result;

      this.setState({
        methods: newMethods,
      })
    }
  }

  getNode() {
    const {
      match, nodes, actions, node,
    } = this.props;
    let nodeId = match.params.nodeId || _.get(node, 'id');

    if (!nodeId && _.isEmpty(node) && !_.isEmpty(nodes)) {
      nodeId = nodes[0].id;
    }

    if (nodeId !== _.get(node, 'id')) {
      const newNode = nodes.find((item: any) => item.id === nodeId);
      actions.changeNode(newNode);
      this.setState({
        methods: { ...DEFAULT_METHODS },
      })
    }

    this.nodeId = nodeId;
  }

  onChange(name: string, e: any) {
    const { methods } = this.state;
    const newMethods: any = { ...methods };

    newMethods[name].params = e.target.value;
    this.setState({ methods: newMethods });
  };

  onCall(name: string) {
    const { actions } = this.props;
    const methods: any = this.state.methods;
    const { params } = methods[name];

    actions.call(this.nodeId, name, params);
  }

  render() {
    const { gettingTokens, history, nodes } = this.props;
    const { methods } = this.state;

    let { node } = this.props;
    if (gettingTokens) {
      node = MOCK_UP_NODE;
    }

    return (
      <div className="rpc">
        <NodeInformation
          loading={gettingTokens}
          node={node}
          history={history}
          nodes={nodes}
          baseUrl="rpc"
        />
        <Card className="no-padding">
          <Card className="rpc-method method-header">
            <div className="method-name">Name</div>
            <div className="method-params">Params</div>
            <div className="method-result">Result</div>
          </Card>
          {_.map(methods, (method, name) => (
            <Card className="rpc-method">
              <div className="method-name">{name}</div>
              <div className="method-params">
                <input
                  onChange={this.onChange.bind(this, name)}
                  defaultValue={method.params}
                />
              </div>
              <div className="method-result">
                <DataScrollable data={method.result} />
              </div>
              <div className="method-actions">
                <Button onClick={this.onCall.bind(this, name)}>
                  Call
                </Button>
              </div>
            </Card>
          ))}
        </Card>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => ({
  nodes: state.NodesReducer.get('nodes'),
  node: state.RPCReducer.get('node'),
  result: state.RPCReducer.get('result'),
  method: state.RPCReducer.get('method'),
  calling: state.RPCReducer.get('calling'),
});

const mapDispatchToProps = (dispatch: any) => ({
  actions: bindActionCreators({
    call, changeNode,
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Tokens);
