const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const contract = require('./compile');
require('dotenv').config();

const abi = contract.abi;
const bytecode = contract.evm.bytecode.object;

const provider = new HDWalletProvider(
    process.env.MNEMONIC,
    process.env.RINKEBY_URL
);

const web3 = new Web3(provider);


async function deploy (){
    // Get a list of account
    const accounts = await web3.eth.getAccounts();
    console.log('Account', accounts[0]);
    // Use one account to deploy contract
    
    const INITIAL_STRING = 'Hello world'
    await new web3.eth.Contract(abi)
        .deploy({
            data: bytecode,
            arguments: [INITIAL_STRING]
        })
        .send({
            from: accounts[0],
            gas: 1000000
        });

    provider.engine.stop()
};

deploy()