const wallet = artifacts.require("EthWallet");

module.exports = function(deployer) {
    deployer.deploy(wallet);
};

//테스트를 위해 migration시 90 ether를 wallet에 송금
module.exports = async function(deployer, network, accounts) {
  await deployer.deploy(wallet);
  const deployedContract = await wallet.deployed();
  
  await web3.eth.sendTransaction({ 
    from: accounts[1], 
    to: deployedContract.address, 
    value: web3.utils.toWei("90", "ether") 
  });
};
