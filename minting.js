const nearAPI = require("near-api-js");
const fs = require("fs");
const {
    getConfig,
    NETWORK,
    PRIVATE_KEY,
    WALLET_ADDRESS,
    CONTRACT_ADDRESS,
    ROYALTY,
    CID
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
    // adds the keyPair you created to keyStore
    await myKeyStore.setKey(NETWORK, WALLET_ADDRESS, keyPair);

    config.keyStore = myKeyStore;
    const nearConnection = await connect(config);
    const account = await nearConnection.account(WALLET_ADDRESS);

    const contract = new Contract(
        account, // the account object that is connecting
        CONTRACT_ADDRESS, {
            // name of contract you're connecting to
            viewMethods: [], // view methods do not change state but usually return a value
            changeMethods: ["nft_create_series", "nft_mint"], // change methods modify state
        }
    );

    let receivers_addresss = [];
    const recipient = JSON.parse(fs.readFileSync("./walletRecipient.json"));
    for (let receiver in recipient) {
        let count = recipient[receiver];
        if (!count || count < 0) {
            return console.log("invalid count recipient")
        }
        let i = 0;
        while (i++ < count) {
            receivers_addresss.push(receiver);
        }
    }

    let datas = fs.readdirSync("./art_engine/build/json");

    let token_series_id = 1;
    for (const data of datas) {
        if(data.startsWith('_')){
            continue;
        }
        const metadata = JSON.parse(fs.readFileSync(`./art_engine/build/json/${data}`));
        const param = {
            "creator_id": WALLET_ADDRESS,
            "token_metadata": {
                "title": metadata.name,
                "media": `${CID}/${metadata.image}`,
                "reference": `${CID}/${metadata.json}`,
                "copies": 1
            },
            "royalty": ROYALTY
        }

        const responseSeries = await contract.nft_create_series(
            param,
            GAS_FEE,
            DEPOSIT,
        )

        let receiver = token_series_id <= receivers_addresss.length ? receivers_addresss[token_series_id - 1] : WALLET_ADDRESS;

        const paramMint = {
            "token_series_id": token_series_id.toString(),
            "receiver_id": receiver
        }

        const responseMint = await contract.nft_mint(
            paramMint,
            GAS_FEE,
            DEPOSIT
        );

        console.log(metadata.name + " success minted to "+ receiver);

        token_series_id++;
    }
})()