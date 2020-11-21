const JsonObjectFormatHandler = require("../handler/jsonObjectFormatHandler");

function EthereumTransactionFormater() {
  const ethereumTransactionFormater = {
    formatForDB(transaction) {
      const transactionTemplate = new Map();
      let formatedTransaction;

      transactionTemplate.set("blockHash", false);
      transactionTemplate.set("gasPrice", false);
      transactionTemplate.set("nonce", false);
      transactionTemplate.set("transactionIndex", false);
      transactionTemplate.set("value", false);
      transactionTemplate.set("v", false);
      transactionTemplate.set("r", false);
      transactionTemplate.set("s", false);

      transaction = this.formater.format({
        obj: transaction,
        templateMap: transactionTemplate,
      });

      return transaction;
    },
  };

  Object.defineProperty(ethereumTransactionFormater, "chainname", {
    value: "ethereum",
    writable: false,
    enumerable: true,
    configurable: true,
  });

  Object.defineProperty(ethereumTransactionFormater, "formater", {
    value: JsonObjectFormatHandler(),
    writable: false,
    enumerable: true,
    configurable: true,
  });

  return ethereumTransactionFormater;
}

module.exports = EthereumTransactionFormater;