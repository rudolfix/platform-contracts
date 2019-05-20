const Web3 = require("web3");
const ProviderEngine = require("web3-provider-engine");
// eslint-disable-next-line
const Web3Subprovider = require("web3-provider-engine/subproviders/web3.js");
const HookedWalletEthTxSubprovider = require("web3-provider-engine/subproviders/hooked-wallet-ethtx");
const Wallet = require("ethereumjs-wallet");

const getFixtureAccounts = require("./migrations/getFixtureAccounts").getFixtureAccounts;

const inherits = require("util").inherits;

// module.exports = MultiWalletSubprovider;

// need to import `inhertis` from some ethereum-js-utils etc. see below
// https://github.com/ethereumjs/ethereumjs-wallet/blob/master/src/provider-engine.js
// https://github.com/MetaMask/web3-provider-engine/blob/master/subproviders/hooked-wallet.js
inherits(MultiWalletSubprovider, HookedWalletEthTxSubprovider);

function MultiWalletSubprovider(wallets, params) {
  const opts = params || {};

  const indexedWallets = wallets.reduce((map, wallet) => {
    const address = wallet.getAddressString().toLowerCase();
    map[address] = wallet.getPrivateKey();
    return map;
  }, {});

  opts.getAccounts = cb => {
    cb(null, Object.keys(indexedWallets));
  };
  opts.getPrivateKey = (address, cb) => {
    address = address.toLowerCase();
    if (!(address in indexedWallets)) {
      cb(new Error(`Account ${address} not found`));
    } else {
      cb(null, indexedWallets[address]);
    }
  };

  MultiWalletSubprovider.super_.call(this, opts);
}

export function multiWalletProvider(nodeUrl) {
  const web3HttpProvider = new Web3.providers.HttpProvider(nodeUrl);
  const engine = new ProviderEngine();

  const fas = getFixtureAccounts();
  const wallets = [];
  for (const name of Object.keys(fas)) {
    if (fas[name].privateKey !== null) {
      const privateKey = Buffer.from(fas[name].privateKey.substr(2), "hex");
      const wallet = new Wallet.fromPrivateKey(privateKey);
      wallets.push(wallet);
    }
  }

  engine.addProvider(new MultiWalletSubprovider(wallets));
  engine.addProvider(new Web3Subprovider(web3HttpProvider));
  engine.start();

  return engine;
}
