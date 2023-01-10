const isPetraInstalled = window.aptos;

const getAptosWallet = () => {
  if ("aptos" in window) {
    return window.aptos;
  } else {
    window.open("https://petra.app/", `_blank`);
  }
};

const wait = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const signAndVerify = async (message) => {
  const wallet = getAptosWallet();
  try {
    const response = await wallet.signMessage({
      message,
      nonce: Math.ceil(Math.random() * 1e7), // should be sequential or a known secret in production
      application: true,
      address: true,
      chainId: true,
    });
    const { publicKey } = await wallet.account();
    // Remove the 0x prefix
    const key = publicKey?.slice(2, 66);
    const verified = nacl.sign.detached.verify(
      buffer.Buffer.from(response.fullMessage),
      buffer.Buffer.from(response.signature, "hex"),
      buffer.Buffer.from(key, "hex")
    );
    console.log({ verified });
  } catch (error) {
    console.error(error);
  }
};

const connect = async () => {
  const wallet = getAptosWallet();
  try {
    const response = await wallet.connect();
    console.log(response);

    const account = await wallet.account();
    console.log(account);

    // 1sec Wait is used as an immediate signIn request is throwing error.
    await wait(1000);

    const message = "Welcome to my dapp!";
    await signAndVerify(message);

    localStorage.setItem("userAccount", JSON.stringify(account));

    refreshUi();
    // defined in event.js file
    initNetwork(wallet);
    initAccount(wallet);
  } catch (error) {
    // { code: 4001, message: "User rejected the request."}
    console.log(error);
  }
};

const showUserData = () => {
  const account = localStorage.getItem("userAccount");
  console.log(account);
  if (account !== "{}" && account !== null) {
    walletInfo.innerText = JSON.stringify(JSON.parse(account), null, 4);
  } else {
    walletInfo.innerText = "Wallet Not Authenticated!!";
  }
};

const toggleBtn = async () => {
  const account = localStorage.getItem("userAccount");
  if (account !== "{}" && account !== null) {
    connectButton.disabled = true;
    disconnectButton.disabled = false;
  } else {
    connectButton.disabled = false;
    disconnectButton.disabled = true;
  }
};

const refreshUi = () => {
  console.log("Ui Updated");
  showUserData();
  toggleBtn();
};

const disconnect = async () => {
  const wallet = getAptosWallet();
  try {
    await wallet.disconnect();
    localStorage.setItem("userAccount", "{}");
    refreshUi();
    // defined in event.js file
    initNetwork(wallet);
    initAccount(wallet);
  } catch (error) {
    console.log(error.message);
    alert(
      "You can only disconnect from connected wallet. Change wallet account to disconnect"
    );
  }
};

const init = async () => {
  refreshUi();
};
init();
