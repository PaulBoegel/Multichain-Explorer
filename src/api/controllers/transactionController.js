"use strict";

function TransactionController(transactionHandler, fullnodeServiceManager) {
  async function getByTxId(req, res) {
    try {
      const chainname = req.params.chainname;
      const txid = req.params.txid;
      const service = fullnodeServiceManager.getService(chainname);

      let result = await transactionHandler.getTransaction(txid, service);

      if (result) {
        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify(result, null, 4));
        return;
      }

      return res.code(404);
    } catch (err) {
      res.send(err.message);
    }
  }

  return { getByTxId };
}

module.exports = TransactionController;
