const CID = "bafybeieu2lgxcv4bycdogwtj6j2cyxtg24pud32jhg46cp6c4itypeaqam";
const PRIVATE_KEY = "ed25519:47zFDCPM2xJeXusgNk3gcjnTzArxwDeze44aam9eJxoZFjm4SJNtNFvpBUuqGfTGgvD5d1Gt6kUQEwbStUpxaEHK";
const NETWORK = "testnet";
const WALLET_ADDRESS = "walletdev.testnet";
const CONTRACT_ADDRESS = "nft8.walletdev.testnet";
const ROYALTY = {
    "walletdev.testnet": 1000 // 10%
}

const CONTRACT_TOKEN_ADDRESS = "token2.walletdev.testnet";
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

module.exports = { getConfig, NETWORK, WALLET_ADDRESS, PRIVATE_KEY, CONTRACT_ADDRESS, ROYALTY, CID, CONTRACT_TOKEN_ADDRESS, TOKEN_DECIMAL}