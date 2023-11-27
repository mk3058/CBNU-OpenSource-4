const wallet = artifacts.require("EthWallet");

module.exports = function(deployer) {
    deployer.deploy(wallet);
};
