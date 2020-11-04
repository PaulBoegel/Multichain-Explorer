"user-strict";
const EventEmitter = require("events");

function FullnodeNotifyerManager() {
  const events = new EventEmitter();
  const notifyerArray = [];

  function setNotifyer(notifyer) {
    notifyerArray.push(notifyer);
  }

  function activateAllNotifyers() {
    if (notifyerArray.length == 0) throw "Notifyer array is empty.";

    notifyerArray.forEach(async (notifyer) => {
      await initNotifyer(notifyer);
    });
  }

  async function activateNotifyer(blockchainName) {
    try {
      if (notifyerArray.length == 0) throw "Notifyer array is empty.";

      const notifyer = notifyerArray.find(
        (item) => item.blockchain == blockchainName
      );
      await notifyerAPI(notifyer);
    } catch (err) {
      throw err;
    }
  }

  async function initNotifyer(notifyer) {
    try {
      //notifyer.events.addListener("onNewTransaction", onNewTransaction);
      notifyer.events.addListener("onNewBlock", onNewBlock);
      await notifyer.connectToSocket();
      //await notifyer.subscribeToTransactions();
      await notifyer.subscribeToBlocks();
    } catch (err) {
      throw err;
    }
  }

  function onNewBlock(blockHash, chainname) {
    events.emit("onNewBlock", blockHash, chainname);
  }

  function onNewTransaction(transaction, inputDepth, chainname) {
    events.emit("onNewTransaction", transaction, inputDepth, chainname);
  }

  return { activateAllNotifyers, activateNotifyer, setNotifyer, events };
}

module.exports = FullnodeNotifyerManager;
