const isPetraInstalled = window.aptos;

const getAptosWallet = () => {
  if ("aptos" in window) {
    return window.aptos;
  } else {
    window.open("https://petra.app/", `_blank`);
  }
};

const signAndVerify = async (message) => {
  try {
    const response = await window.aptos.signMessage({
      message,
      nonce: Math.ceil(Math.random() * 10e7),
      application: true,
      address: true,
      chainId: true,
    });
    const { publicKey } = await window.aptos.account();
    // Remove the 0x prefix
    const key = publicKey?.slice(2, 66);
    const verified = nacl.sign.detached.verify(
      buffer.Buffer.from(response.fullMessage),
      buffer.Buffer.from(response.signature, "hex"),
      buffer.Buffer.from(key, "hex")
    );
    console.log(verified);
  } catch (error) {
    console.error(error);
  }
};

const connect = async () => {
  const wallet = getAptosWallet();
  console.log(wallet);
  try {
    const response = await wallet.connect();
    console.log(response); // { address: string, publicKey: string }

    const message = "Welcome to my dapp!";
    await signAndVerify(message);

    const account = await wallet.account();
    console.log(account); // { address: string, publicKey: string }

    localStorage.setItem("userAccount", JSON.stringify(account));

    refreshUi();
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
    walletInfo.innerText = "Wallet Not Connected!!";
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
  await wallet.disconnect();
  localStorage.setItem("userAccount", "{}");
  refreshUi();
};

const init = async () => {
  refreshUi();
};
init();
