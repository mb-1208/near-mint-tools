# Near Mint Tools

## Prerequisites

Rust, cargo, near-cli, etc... Everything should work if you have NEAR development env for Rust contracts set up.

Check Near Docs for detail prerequisites. https://docs.near.org/develop/contracts/introduction

## Clone Repository

```sh
git clone https://github.com/mb-1208/near-mint-nodejs.git
```

## Generate Metadata

### Step 1 

Enter to art engine folder using:

```sh
cd .\art_engine\
```

### Step 2

Inside folder art_engine, Open the 'layers' folder, insert your NFT assets, and then adjust your NFT to match the format folder provided within the folder organization according to your NFT assets.
After that, open `./src` folder and you will see config.js. Change the configuration inside the file as needed.

_For detailed configuration, you can refer to the README.md inside the 'art_engine' folder for more clarity._ 

### Step 3

After you've placed your NFT assets into the 'layers' folder with the correct folder structure and configured the 'config.js' file:

Then, execute the 'generate' function with the following command:

```sh
npm run generate
```

If there are no issues, inside the 'art_engine' folder, you will see a new folder named 'build,' and within it, there will be two folders; 'json' and 'images.' Each file within them is organized with token numbers starting from 0.

### Step 4

If step 3 has been completed without any issues, proceed to run the function:

```sh
npm run merge
```

After successfully running this function, a new folder named 'upload' will be added inside the 'build' folder.

### Optional

If, after completing all the steps above, you wish to modify the contents of `./art_engine/src/config.js` without altering the existing metadata one by one, you simply need to edit `./art_engine/src/config.js` and then run the function:

```sh
npm run update_info
```

## Upload Metadata to IPFS

### Step 1

If you still inside `./art_engine` folder, don't forget to go back to main folder using this command:

```sh
cd ..
```

### Step 2 

Insert your NFT.storage API key into `./config/index.js`. Inside `index.js`, there is a variable named API_NFT_STORAGE; place your API key there.

### Step 3

And then upload the metadata to your nft storage account with command:

```sh
npm run upload
```

If the function has been successful, inside the terminal you will see your generated CID, copy the CID and insert it into `./config/index.js`, there is a variable named CID; place your CID there.

## Deploy NFT/FT Contract

### *Create sub account wallet (Optional but recommended)*

Creating a sub-account is not mandatory, this method is just for keeping NFTs and FTs deployed under the same main account but using different sub-accounts. 

Another method is to create two separate main accounts, which is also acceptable. In this tutorial, I will provide instructions using sub-accounts. After this stage, it should be relatively easy for you to understand the differences between using a main account and sub-account when deploying the smart contract, so please adapt it to your needs.

### Step 1

I will separate the sub-account for deploying the NFTs and FTs from one main account. First, I will create an account for the NFT sub-account:

```sh
near create-account nft.walletdev.testnet --masterAccount walletdev.testnet --initialBalance 10
```

_`walletdev.testnet` here is my wallet that I created previously, and `walletdev.testnet` is the main account. With the command above, I created a sub-account named `nft.walletdev.testnet`_

### Step 2

One more thing, I will create a sub-account for the FTs:

```sh
near create-account ft.walletdev.testnet --masterAccount walletdev.testnet --initialBalance 10
```

_`walletdev.testnet` here is my wallet that I created previously, and `walletdev.testnet` is the main account. With the command above, I created a sub-account named `ft.walletdev.testnet`_

After creating the two sub-accounts for each deployment, let's proceed to the next step: deploying the contract.

### *Deploy NFT*

### Step 1

Open the file `./contracts/nft/paras-nft-contract/src/lib.rs` and search and change for code like the following:

```sh
const DATA_IMAGE_SVG_PARAS_ICON: &str = "data:image/png;base64,iVBORw0KGgoA...";
const NAME: &str = "NEAR Punks";
const SYMBOL: &str = "Punks";
const BASE_URI: &str = "https://ipfs.fleek.co/ipfs";
```

You don't need to change `const BASE_URI: &str = "https://ipfs.fleek.co/ipfs";` part, just change 3 out of the rest (DATA_IMAGE_SVG_PARAS_ICON, NAME, SYMBOL). And for the DATA_IMAGE_SVG_PARAS_ICON, you must use the base64 format as the icon.

### Step 2

Then, navigate to the terminal with the path of the NFT contract, which is `./contracts/nft`. After that, run the following function:

```sh
yarn && yarn test:deploy
```

```sh
near deploy --wasmFile out/main.wasm --accountId nft.walletdev.testnet
```

```sh
near call nft.walletdev.testnet new_default_meta '{"owner_id":"walletdev.testnet", "treasury_id":"walletdev.testnet"}' --accountId walletdev.testnet
```

If there are no issues when running the function above, it means your contract has been successfully deployed.

### *Deploy FT*

### Step 1

Open the file `./contracts/token/ft/src/lib.rs` and search and change for code like the following:

```sh
const SVG_PARAS_ICON: &str = "data:image/png;base64,iVBORw0KG...";
const TOTAL_SUPPLY: Balance = 100_000_000_000_000_000_000_000_000;
const NAME: &str = "PARAS";
const SYSMBOL: &str = "PARAS";
const DECIMAL: u8 = 18;
```

For the SVG_PARAS_ICON, you must use the base64 format as the icon.

### Step 2

Then, navigate to the terminal with the path of the NFT contract, which is `./contracts/token`. After that, run the following function:

```sh
./build.sh
```

```sh
near deploy --wasmFile res/fungible_token.wasm --accountId ft.walletdev.testnet
```

```sh
near call ft.walletdev.testnet new_paras_meta '{"owner_id": "walletdev.testnet"}' --accountId walletdev.testnet
```

```sh
near call ft.walletdev.testnet storage_deposit '' --accountId walletdev.testnet --amount 0.00125
```

If there are no issues when running the function above, it means your contract has been successfully deployed.

## Setup/Update Configuration

After successfully completing all the above steps, let's proceed to update `./config/index.js`. Open the file again and fill in the variables inside the file that haven't been filled in previously. Like this:

```sh
const API_NFT_STORAGE = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDI1Nzg1NEMzM0FhODI0RTFCNjA2NkNjMDI3NTk5N2Y0RjI3NDgxRjQiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY5ODQ2NzEyNjkzMywibmFtZSI6Im5mdF91cGxvYWQifQ.y6yPD_tZROr4leH1h2_lOIgMkmZ8zs8MYaPhe9SwmeA"
const CID = "bafybeic53n2q3rcqqrxnsorstrtqixtnucs6cov42lsghzok5m6o5242rq";
const PRIVATE_KEY = "ed25519:47zFDCPM2xJeXusgNk3gcjnTzArxwDeze44aam9eJxoZFjm4SJNtNFvpBUuqGfTGgvD5d1Gt6kUQEwbStUpxaEHK";
const NETWORK = "testnet";
const WALLET_ADDRESS = "walletdev.testnet";
const CONTRACT_ADDRESS = "nft.walletdev.testnet";
const ROYALTY = {
    "walletdev.testnet": 1000 // 10%
}

const CONTRACT_TOKEN_ADDRESS = "ft.walletdev.testnet";
const TOKEN_DECIMAL = 18;


function getConfig(env) {
    switch (env) {
        case 'production':
        case 'mainnet':
            return {
                    networkId: 'mainnet',
                    nodeUrl: 'https://rpc.mainnet.near.org',
                    walletUrl: 'https://wallet.near.org',
                    helperUrl: 'https://helper.mainnet.near.org',
                    archivalUrl: "https://archival-rpc.mainnet.near.org",
                    explorerUrl: "https://explorer.near.org",
            }
            case 'development':
            case 'testnet':
                return {
                        networkId: 'testnet',
                        nodeUrl: 'https://rpc.testnet.near.org',
                        helperUrl: 'https://helper.testnet.near.org',
                        archivalUrl: "https://archival-rpc.testnet.near.org",
                        explorerUrl: "https://explorer.testnet.near.org",
                }
                default:
                    throw Error(`Unconfigured environment '${env}'. Can be configured in src/config.js.`)
    }
}

module.exports = { getConfig, NETWORK, WALLET_ADDRESS, PRIVATE_KEY, CONTRACT_ADDRESS, ROYALTY, CID, CONTRACT_TOKEN_ADDRESS, TOKEN_DECIMAL, API_NFT_STORAGE}
```

_I'm using the testnet network here. If you're using the mainnet, change the 'NETWORK' variable to 'mainnet'._

After the above configurations are complete, now fill in 'walletRecipient.json' and 'walletTokenRecipient.json' to specify the wallets to which NFTs will be minted or tokens will be transferred.

'walletRecipient.json' for NFT, example:

```sh
{
  "walletdev.testnet": 1,
  "walletdev2.testnet": 1,
  "walletdev3.testnet": 1
}
```

'walletTokenRecipient.json' for FT, example:

```sh
{
  "walletuser.testnet": 1000,
  "walletuser2.testnet": 2000,
  "walletuser3.testnet": 1000,
}
```

## Mint NFT

Run the command below to execute the Mint command based on the wallets specified in 'walletRecipient.json':

```sh
npm run mint_nft
```

## Transfer FT

Run the command below to execute the Transfer command based on the wallets specified in 'walletTokenRecipient.json':

```sh
npm run transfer_ft
```


 
