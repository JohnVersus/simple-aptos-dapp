const sendTx = async () => {
  const wallet = getAptosWallet(); // see "Connecting"

  // Example Transaction, following an [EntryFunctionPayload](https://github.com/aptos-labs/aptos-core/blob/main/ecosystem/typescript/sdk/src/generated/models/EntryFunctionPayload.ts#L8-L21)
  const address =
    "0x17099e697e0ca0426b18c69a57fd715a5830538387933b13e470adff9f8e1c49";
  const transaction = {
    arguments: [receiversAddress.value, Number(transferValue.value) * 1e8],
    function: "0x1::coin::transfer",
    type: "entry_function_payload",
    type_arguments: ["0x1::aptos_coin::AptosCoin"],
  };

  try {
    const pendingTransaction = await wallet.signAndSubmitTransaction(
      transaction
    );

    // In most cases a dApp will want to wait for the transaction, in these cases you can use the typescript sdk

    // Works only in modules when imported
    // const client = new AptosClient("https://testnet.aptoslabs.com");
    // const txn = await client.waitForTransactionWithResult(
    //   pendingTransaction.hash
    // );
    console.log(txn);
  } catch (error) {
    // see "Errors"
    console.log(error);
  }
};
