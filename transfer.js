const nearAPI = require("near-api-js");
const fs = require("fs");
const {
    getConfig,
    NETWORK,
    PRIVATE_KEY,
    WALLET_ADDRESS,
    CONTRACT_TOKEN_ADDRESS,
    TOKEN_DECIMAL,
} = require("./config");

const config = getConfig("testnet");

(async () => {

    // creates keyStore from a private key string
    // you can define your key here or use an environment variable

    const {
        keyStores,
        KeyPair,
        Contract,
        connect
    } = nearAPI;

    const myKeyStore = new keyStores.InMemoryKeyStore();
    // creates a public / private key pair using the provided private key
    const keyPair = KeyPair.fromString(PRIVATE_KEY);
    const GAS_FEE = `100000000000000`;
    const DEPOSIT = nearAPI.utils.format.parseNearAmount('0.01');
    const DEPOSIT_ONE = 1;
    // adds the keyPair you created to keyStore
    await myKeyStore.setKey(NETWORK, WALLET_ADDRESS, keyPair);

    config.keyStore = myKeyStore;
    const nearConnection = await connect(config);
    const account = await nearConnection.account(WALLET_ADDRESS);

    const contract = new Contract(
        account, // the account object that is connecting
        CONTRACT_TOKEN_ADDRESS, {
            // name of contract you're connecting to
            viewMethods: [], // view methods do not change state but usually return a value
            changeMethods: ["ft_transfer", "storage_deposit"], // change methods modify state
        }
    );

    const recipient = JSON.parse(fs.readFileSync("./walletTokenRecipient.json"));
    for (let receiver in recipient) {

        try {
            let resp = await contract.storage_deposit({
                "account_id": receiver
            }, 
            GAS_FEE,
            DEPOSIT);
            console.log(resp);
        } catch (error) {
            console.log(error);
        }

        let amount = recipient[receiver];
        let parseAmount = amount.toString() + (10 ** TOKEN_DECIMAL).toString().substring(1);
        let response = await contract.ft_transfer({
            "receiver_id": receiver,
            "amount": parseAmount.toString(),
        }, 
        GAS_FEE,
        DEPOSIT_ONE);

        console.log("success transfer " + parseAmount + " to "+ receiver);
    }
    
})()