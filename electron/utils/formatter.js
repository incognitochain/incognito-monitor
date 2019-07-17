function formatBlock(block, isBeaconBlock) {
  return {
    hash: block.Hash,
    shardId: block.ShardId,
    confirmations: block.Confirmations,
    version: block.Version,
    txRoot: block.TxRoot,
    time: block.Time,
    previousBlockHash: block.PreviousBlockHash,
    nextBlockHash: block.NextBlockHash,
    height: block.Height,
    producer: block.BlockProducer,
    producerSign: block.BlockProducerSign,
    data: block.Data,
    beaconHeight: block.BeaconHeight,
    beaconBlockHash: block.BeaconBlockHash,
    aggregatedSig: block.AggregatedSig,
    r: block.R,
    round: block.Round,
    crossShards: [],
    epoch: block.Epoch,
    txs: block.Txs,
    txHashes: block.TxHashes,
    fee: block.Fee,
    reward: block.Reward,
    isBeaconBlock,
    instructions: block.Instructions,
  };
}

function formatTransaction(transaction) {
  return {
    blockHash: transaction.BlockHash,
    blockHeight: transaction.BlockHeight,
    index: transaction.index,
    shardID: transaction.shardID,
    hash: transaction.Hash,
    version: transaction.Version,
    type: transaction.Type,
    lockTime: transaction.LockTime,
    fee: transaction.Fee,
    image: transaction.Image,
    isPrivacy: transaction.IsPrivacy,
    proof: transaction.Proof,
    proofDetail: transaction.ProofDetail,
    inputCoinPubKey: transaction.InputCoinPubKey,
    sigPubKey: transaction.SigPubKey,
    sig: transaction.Sig,
    metadata: transaction.Metadata,
    customTokenData: transaction.CustomTokenData,
    privacyCustomTokenData: transaction.PrivacyCustomTokenData,
    isInMempool: transaction.IsInMempool,
    isInBlock: transaction.IsInBlock,
  }
}

module.exports = {
  formatTransaction,
  formatBlock
};
