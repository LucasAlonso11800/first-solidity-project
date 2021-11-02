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
const INITIAL_STRING = 'Hello world'

beforeEach(async () => {
    // Get a list of account
    accounts = await web3.eth.getAccounts();
    // Use one account to deploy contract
    inbox = await new web3.eth.Contract(abi)
        .deploy({
            data: bytecode,
            arguments: [INITIAL_STRING]
        })
        .send({
            from: accounts[0],
            gas: 1000000
        })
});

describe('Inbox', () => {
    it('deploys a contract', () => {
        assert.ok(inbox.options.address)
    });

    it('has a default message', async () => {
        const message = await inbox.methods.message().call();
        assert.equal(message, INITIAL_STRING);
    });

    it('can change the message', async () => {
        const NEW_MESSAGE = 'Some new message';
        await inbox.methods.setMessage(NEW_MESSAGE).send({ from: accounts[0] });

        const message = await inbox.methods.message().call();
        assert.equal(message, NEW_MESSAGE);
    });
});