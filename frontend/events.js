// default networks in the wallet
// enum Network {
//     Testnet = 'Testnet',
//     Mainnet = 'Mainnet',
//     Devnet = 'Devnet',
//   }

const updateNetworkUi = (network) => {
  networkName.innerText = network;
};
const updateAccountUi = (account) => {
  activeAccount.innerText = JSON.stringify(account, null, 4);
};

const initNetwork = async (wallet) => {
  let network = await wallet.network();
  updateNetworkUi(network);
};

const initAccount = async (wallet) => {
  let currentAccount = await wallet.account();
  updateAccountUi(currentAccount);
};

window.onload = () => {
  const wallet = getAptosWallet();
  initNetwork(wallet);
  initAccount(wallet);
  // event listener for network changing
  wallet.onNetworkChange((network) => {
    console.log("Current Network: ", network.networkName);
    updateNetworkUi(network.networkName);
  });

  // event listener for disconnecting
  wallet.onAccountChange((newAccount) => {
    // currentAccount = wallet.connect();
    updateAccountUi(newAccount);
  });
};
