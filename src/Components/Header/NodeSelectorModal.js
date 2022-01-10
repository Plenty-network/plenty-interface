import PropTypes from 'prop-types';
import Button from '../Ui/Buttons/Button';
import React, { useEffect, useState } from 'react';
import { RPC_NODE } from '../../constants/localStorage';
import { connect } from 'react-redux';
import axios from 'axios';
import { setNode } from '../../redux/slices/settings/settings.slice';
import clsx from 'clsx';

async function isValidURL(userInput) {
  try {
    const response = await axios({
      method: 'get',
      baseURL: userInput,
      url: '/chains/main/blocks',
    });
    return response.status === 200;
  } catch (error) {
    return false;
  }
}

function NodeSelectorModal(props) {
  const [currentRPC, setCurrentRPC] = useState('');
  const [customRPC, setCustomRPC] = useState('');

  const LOCAL_RPC_NODES = {
    PLENTY: 'https://mifx20dfsr.windmill.tools/',
    GIGANODE: 'https://mainnet-tezos.giganode.io/',
    CRYPTONOMIC: 'https://tezos-prod.cryptonomic-infra.tech/',
  };
  const nodeNames = {
    PLENTY: 'Plenty node',
    GIGANODE: 'Giganode',
    CRYPTONOMIC: 'Cryptonomic',
  };

  const rpcNodeDetect = async () => {
    let RPCNodeInLS = localStorage.getItem(RPC_NODE);

    if (!RPCNodeInLS) {
      localStorage.setItem(RPC_NODE, LOCAL_RPC_NODES['CRYPTONOMIC']);
      props.setNode(LOCAL_RPC_NODES['CRYPTONOMIC']);
      setCurrentRPC(LOCAL_RPC_NODES['CRYPTONOMIC']);
      RPCNodeInLS = LOCAL_RPC_NODES['CRYPTONOMIC'];
    }

    const valid = await isValidURL(RPCNodeInLS);
    if (!valid) {
      localStorage.setItem(RPC_NODE, LOCAL_RPC_NODES['PLENTY']);
      props.setNode(LOCAL_RPC_NODES['PLENTY']);
      setCurrentRPC('PLENTY');
      return;
    }

    const matchedNode = Object.keys(LOCAL_RPC_NODES).find(
      (key) => LOCAL_RPC_NODES[key] === RPCNodeInLS,
    );

    if (!matchedNode) {
      setCurrentRPC('CUSTOM');
      setCustomRPC(RPCNodeInLS);
      return;
    }

    setCurrentRPC(matchedNode);
  };

  useEffect(() => {
    rpcNodeDetect();
    // eslint-disable-next-line
  }, [props.nodeSelector]);

  const setRPCInLS = async () => {
    if (currentRPC !== 'CUSTOM') {
      localStorage.setItem(RPC_NODE, LOCAL_RPC_NODES[currentRPC]);
      props.setNode(LOCAL_RPC_NODES[currentRPC]);
      //props.closeNodeSelectorModal();
    } else {
      let _customRPC = customRPC;
      if (!_customRPC.match(/\/$/)) {
        _customRPC += '/';
      }
      const response = await isValidURL(_customRPC);

      if (!response) {
        props.setLoaderMessage({ type: 'error', message: 'Invalid RPC URL' });
        setTimeout(() => {
          props.setLoaderMessage({});
        }, 5000);
      } else {
        localStorage.setItem(RPC_NODE, _customRPC);
        props.setNode(_customRPC);
        // props.closeNodeSelectorModal(_customRPC);
      }
    }
  };

  return (
    <>
      <div className="node-selector-modal">
        <div className="node-selector-radio-container node-selector-list">
          <ul>
            {Object.entries(nodeNames).map(([identifier, name]) => (
              <li key={identifier}>
                <label
                  className={clsx(currentRPC === identifier && 'selected-border')}
                  htmlFor={identifier}
                  onClick={() => setCurrentRPC(identifier)}
                >
                  <div className="check" />
                  <input
                    defaultChecked={currentRPC === identifier}
                    type="radio"
                    checked={currentRPC === identifier}
                    id={identifier}
                    name="selector"
                    className="input-nodeselector"
                  />
                  <span
                    className={clsx(currentRPC === identifier ? 'selected-label' : 'default-label')}
                  >
                    {name}
                  </span>
                </label>
              </li>
            ))}
            <li>
              <label
                className={clsx('custom', currentRPC === 'CUSTOM' && 'selected-border')}
                htmlFor="w-option"
                onClick={() => setCurrentRPC('CUSTOM')}
              >
                <input
                  defaultChecked={currentRPC === 'CUSTOM'}
                  type="radio"
                  id="w-option"
                  checked={currentRPC === 'CUSTOM'}
                  name="selector"
                  className="custominput"
                />
              </label>
              <input
                disabled={currentRPC !== 'CUSTOM'}
                type="url"
                htmlFor="w-option"
                className={clsx(
                  'node-selector-modal-input',
                  currentRPC === 'CUSTOM' && 'selected-border',
                )}
                placeholder="https://custom.tezos.node"
                value={customRPC}
                onChange={(e) => {
                  setCustomRPC(e.target.value);
                }}
              />
            </li>
          </ul>
        </div>
        <Button onClick={setRPCInLS} className="button-bg w-100 mt-1 mb-2 py-1">
          Set Node
        </Button>
      </div>
    </>
  );
}

const mapStateToProps = (state) => ({
  rpcNode: state.settings.rpcNode,
});

const mapDispatchToProps = (dispatch) => ({
  setNode: (rpcNode) => dispatch(setNode(rpcNode)),
});

NodeSelectorModal.propTypes = {
  closeNodeSelectorModal: PropTypes.func.isRequired,
  nodeSelector: PropTypes.func.isRequired,
  setLoaderMessage: PropTypes.func.isRequired,
  setNode: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(NodeSelectorModal);
