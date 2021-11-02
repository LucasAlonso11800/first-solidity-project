const Web3 = require('web3');
const ganache = require('ganache-core');
const { describe, beforeEach } = require('mocha');
const assert = require('assert');
const contract = require('../compile');

const web3 = new Web3(ganache.provider());

const abi = contract.abi;
const bytecode = contract.evm.bytecode.object;

let accounts;
let inbox;

beforeEach(async () => {
    // Get a list of account
    accounts = await web3.eth.getAccounts();
    // Use one account to deploy contract
    inbox = await new web3.eth.Contract(abi)
        .deploy({
            data: bytecode,
            arguments: ['There is no way this works']
        })
        .send({
            from: accounts[0],
            gas: 1000000
        })
});

describe('Dummy test', () => {
    it('Whatever', () => {
        assert.strictEqual('ABC', 'ABC')
    })
});