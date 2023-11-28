import Web3 from 'web3';
import HTLCContractJSON from './contracts/HashedTimelock.json';

class EthereumBackend {
    constructor() {
        const serverUrl = process.env.REACT_APP_SERVER_URL;
        const serverPort = process.env.REACT_APP_SERVER_PORT;

        this.web3 = new Web3(Web3.givenProvider || `${serverUrl}:${serverPort}`);
        this.hltcContract = null;
        this.initializeHTLCContract();
    }

    async initializeHTLCContract() {
        const networkId = await this.web3.eth.net.getId();
        const deployedNetwork = HTLCContractJSON.networks[networkId];

        this.hltcContract = new this.web3.eth.Contract(
            HTLCContractJSON.abi,
            deployedNetwork && deployedNetwork.address,
        );
    }

    async newContract(receiver, hashlock, timelock, amount) {
        const BigNumber = require('bignumber.js');
        const accounts = await this.web3.eth.getAccounts();

        const estimatedGas = await this.hltcContract.methods.newContract(receiver, hashlock, timelock)
            .estimateGas({ from: accounts[0], value: this.web3.utils.toWei(amount, 'ether') });
        const gasLimit = new BigNumber(estimatedGas).plus(new BigNumber(100000)); // gasLimit 넉넉하게 설정
        const response = await this.hltcContract.methods.newContract(receiver, hashlock, timelock)
            .send({ from: accounts[0], value: this.web3.utils.toWei(amount, 'ether'), gas: gasLimit.toString() });
        const contractId = response.events.LogHTLCNew.returnValues.contractId;
        return contractId;
    }

    async refund(contractId) {
        const accounts = await this.web3.eth.getAccounts();
        return this.hltcContract.methods.refund(contractId)
            .send({ from: accounts[0] });
    }
}

const ethereumBackend = new EthereumBackend();
export default ethereumBackend;
