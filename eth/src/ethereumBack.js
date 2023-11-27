import Web3 from 'web3';
import ContractJSON from './contracts/EthWallet.json';

class EthereumBackend {
    constructor() {
        this.web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');
        this.contract = null;
        this.initializeContract();
    }

    async initializeContract() {
        const networkId = await this.web3.eth.net.getId();
        const deployedNetwork = ContractJSON.networks[networkId];
        this.contract = new this.web3.eth.Contract(
            ContractJSON.abi,
            deployedNetwork && deployedNetwork.address,
        );
    }

    async getBalance() {
        const accounts = await this.web3.eth.getAccounts();
        return this.contract.methods.getBalance().call({ from: accounts[0] });
    }

    async sendEther(to, amount) {
        const accounts = await this.web3.eth.getAccounts();
        return this.contract.methods.sendEther(to, this.web3.utils.toWei(amount, 'ether'))
            .send({ from: accounts[0] });
    }
}

export default new EthereumBackend();
