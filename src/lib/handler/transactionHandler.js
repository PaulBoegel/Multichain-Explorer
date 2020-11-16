"use strict";

function TransactionHandler(transactionRepo, blockRepo) {
  async function saveTransaction(inTransaction, inputDepth, service, verbose) {
    let transaction = verbose
      ? inTransaction
      : await service.decodeTransaction(inTransaction);
    const chainname = service.chainname;
    const id = transaction.txid;

    transaction.chainname = chainname;
    await transactionRepo.add(transaction);
    await service.handleTransactionInputs(transaction, inputDepth);
  }

  async function saveManyTransactions(inputs, inputDepth, service) {
    for (let i = 0; i > inputs.length; i++) {
      inputs.splice(i, 1);
    }

    await transactionRepo.addMany(inputs);

    inputs.forEach(async (input) => {
      await service.handleTransactionInputs(input, inputDepth);
    });
  }

  async function getTransaction(txid, service) {
    let transaction = await transactionRepo.getByIds(txid, service.chainname);
    if (transaction) return transaction;

    transaction = await service.getTransaction({ txid, verbose: true });

    if (transaction) {
      await transactionRepo.add(transaction);
      return transaction;
    }

    return null;
  }

  async function saveBlockDataWithHash({ blockhash, service }) {
    const blockData = await service.getBlock({ blockhash, verbose: true });
    saveBlockData({ blockData, service });
  }

  async function saveBlockData({ blockData, service }) {
    const { tx, ...data } = blockData;
    tx.map((transaction) => (transaction.chainname = service.chainname));
    const inserted = await transactionRepo.addMany(tx);
    await blockRepo.add({
      ...data,
      chainname: service.chainname,
      tx: tx.map((transaction) => {
        return transaction.txid;
      }),
    });
    return inserted;
  }

  async function getHighestBlockHash(service) {
    let height = 0;
    let blocks = await blockRepo.get({
      query: { chainname: service.chainname },
      sort: { height: -1 },
      limit: 1,
    });
    if (blocks.length > 0) {
      height = blocks[0].height + 1;
    }

    return await service.getBlockHash({ height, verbose: true });
  }

  return {
    getTransaction,
    saveTransaction,
    saveManyTransactions,
    saveBlockData,
    saveBlockDataWithHash,
    getHighestBlockHash,
  };
}

module.exports = TransactionHandler;
