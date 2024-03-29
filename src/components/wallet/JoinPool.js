import React from "react";
import {
    Button,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Row
} from 'reactstrap';
import { getDelegation, blockfrostRequest, getUtxos, getAddress, getProtocolParameters, txBuilder, signSubmitTx } from "./Transactions";
import { Link } from 'react-router-dom';
import CircleLoader
    from "react-spinners/CircleLoader";
import { css } from "@emotion/core";
import { connect } from 'react-redux';

import { getWallet } from '../wallet/walletutil'

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;
var Loader;
var protocolParameter;
var delegation;
var user;
var stakeKeyHash;

class JoinPool extends React.Component {
    // https://github.com/Felippo001/nami-wallet-api

    constructor(props){
        super(props);
        this.state = {
            loading: true,
            walletAddress: "thisisthewalletaddress",
            price: 0,
            paymentReceived: false,
            nftReserved: null,
            planetName: null,
            refreshedScreen: false,
            joinPoolResponse: "",
            modal: false,
            modal_backdrop: false,
            modal_nested_parent: false,
            modal_nested: false,
        };
      }
    

    async componentDidMount() {
        window.scrollTo(0, 0);

        try {
            var wallet = this.props.wallet;
            console.log(wallet)
        } catch (error) {
        }
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps)
    }

    toggle = modalType => () => {
        if (!modalType) {
            return this.setState({
                modal: !this.state.modal,
            });
        }
        this.setState({
            [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
        });
    };


    async getProtocolParameters() {
        var HOST = "https://api.koios.rest/api/v0/";
        const tip = await fetch(HOST + '/tip', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'GET'
        }).then((response) => response.json());
        var slotnumber = tip.epoch_slot;

        const epochInfo = await fetch(HOST + '/epoch_params', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'GET'
        }).then((response) => response.json());
        if (epochInfo.status >= 400 && epochInfo.status < 600) {
            throw new Error("Bad response from server");
        }

        var value = {
            linearFee: {
                coefficient: new Uint8Array(epochInfo.min_fee_a),
                constant: new Uint8Array(epochInfo.min_fee_b)
            },
            minUtxo: new Uint8Array(epochInfo.min_utxo),
            poolDeposit: new Uint8Array(epochInfo.pool_deposit),
            keyDeposit: new Uint8Array(epochInfo.key_deposit),
            maxTxSize: epochInfo.max_tx_size,
            slot: slotnumber,
        };
        return value;
    };



    async joinPool() {
        console.log('Wallet selected: ' + this.props.wallet)

        if (this.props.wallet === "typhon") {
            await this.joinPoolTyphon();
        } else {
            await this.joinPoolCIP30();
        }
    }

    async joinPoolTyphon() {
        const targetPoolId = this.props.pool.pool_id;
        const delegationResponse = window.cardano.typhon.delegationTransaction({ poolId: targetPoolId });

        if (delegationResponse.status) {
            this.setState({ joinPoolResponse: delegationResponse.data.transactionId, loading: false });
        } else {
            console.log("delegateResponse: ", delegationResponse);
        }
    }

    async joinPoolCIP30() {
        try {
            this.setState({ modal: true });
            //initialize loader
            Loader = await import('@emurgo/cardano-serialization-lib-browser');
            // Loader = await import('@emurgo/cardano-serialization-lib-asmjs');

            var wallet = await getWallet(this.props.wallet);
            console.log(wallet);

            user = await wallet.getUsedAddresses();
            console.log(user);

            var rewardAddressesList = await wallet.getRewardAddresses();
            console.log(rewardAddressesList);
            //get stake key hash
            stakeKeyHash = Loader.RewardAddress.from_address(
                Loader.Address.from_bytes(
                    Buffer.from(
                        rewardAddressesList[0],
                        'hex'
                    )
                )
            ).payment_cred().to_keyhash().to_bytes();
            console.log(stakeKeyHash);
            //get protocol params
            protocolParameter = await getProtocolParameters(wallet, Loader);
            console.log(protocolParameter)
            //current delegation
            delegation = await getDelegation(wallet, Loader);
            console.log(delegation)
            //target pool id
            const targetPoolId = this.props.pool.pool_id;
            console.log(targetPoolId)
            //get utxos
            //var utxos = await getUtxos();//.map(u => S.TransactionUnspentOutput.from_bytes(Buffer.from(u, 'hex')))
            //        var utxosMap = utxos.map(u => Loader.TransactionUnspentOutput.from_bytes(Buffer.from(u, 'hex')));       
            var Utxos = await wallet.getUtxos();
            console.log(Utxos)
            var UtxosHex = Utxos.map(u => Loader.TransactionUnspentOutput.from_bytes(
                Buffer.from(
                    u,
                    'hex'
                )
            )
            );
            console.log(UtxosHex)
            //paymentAddress
            var PaymentAddress = await getAddress(wallet, Loader);

            //outputs
            let outputs = Loader.TransactionOutputs.new()
            outputs.add(
                Loader.TransactionOutput.new(
                    Loader.Address.from_bech32(PaymentAddress),
                    Loader.Value.new(
                        Loader.BigNum.from_str(protocolParameter.keyDeposit)
                    )
                )
            )

            console.log(outputs)

            //transaction
            let transaction = await txBuilder(Loader, {
                PaymentAddress,
                Utxos: UtxosHex,
                ProtocolParameter: protocolParameter,
                Outputs: outputs,
                Delegation: {
                    poolHex: targetPoolId,
                    stakeKeyHash: stakeKeyHash,
                    delegation: delegation
                },
                Metadata: null,
                MetadataLabel: '721'
            });

            console.log(transaction)

            //submit trx
            let response = await signSubmitTx(wallet, Loader, transaction);

            this.setState({ joinPoolResponse: response, loading: false });
        } catch (error) {
            console.log(error);
            this.setState({ joinPoolResponse: "Unable to submit at this time.", loading: false });
        }

    }

    render() {
        return (
            <div>
                {this.props.wallet !== "" &&
                    <p><Button variant="outline-light" size="sm" onClick={() => this.joinPool()}>Join</Button>
                        <Modal
                            isOpen={this.state.modal}
                            toggle={false}
                            contentClassName="custom-modal-style"
                        >
                            <ModalHeader toggle={this.toggle()}>Join Pool</ModalHeader>
                            <ModalBody style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                textAlign: 'center',
                            }}>
                                <Row>
                                    <div>
                                        <p>You have selected to join Pool: <Link to={`/pool/${this.props.pool.pool_id}`}>{this.props.pool.name}</Link></p>
                                        <p>A Wallet screen will appear to sign the transaction.</p>
                                        <p>Once complete your Wallet will update to the new pool within a few minutes.</p>
                                        <br></br>



                                        {this.state.loading ? <div> <p>Waiting on confirmation.</p><CircleLoader color={'#45b649'} loading={this.state.loading} css={override} size={180} /></div>
                                            : <div><small>{this.state.joinPoolResponse}</small></div>}
                                    </div>

                                </Row>

                            </ModalBody>
                        </Modal>
                    </p>}
            </div>

        );
    }
}

const mapStateToProps = state => {
    console.log("mapStateToProps:" + state)
    console.log(state)
    return {
        wallet: state
    };
};

export default connect(mapStateToProps)(JoinPool);

