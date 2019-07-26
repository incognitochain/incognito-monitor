const jayson = require('jayson');

const RPCClient = function (host, port) {
  // create a client
  const client = jayson.client.http({
    host: host || '127.0.0.1',
    port: port || 9334,
  });
  return client;
};

class ConstantNodeRPC {
  constructor(host, port) {
    this.client = RPCClient(host, port);
  }

  // virtual method
  // node
  GetNetworkInfo() {}

  GetConnectionCount() {}

  GetAllPeers() {}

  GetRawMempool() {}

  GetMempoolEntry() {}

  EstimateFee() {}

  GetGenerate() {}

  GetMiningInfo() {}

  // block
  GetBlockChainInfo() {}

  GetBlockHeader(getBy = '', block = '', shardID = 0) {}

  GetBlockHash(shardID = 0, height = 0) {}

  GetBlockCount(shardID = 0) {}

  GetBlocks(numBlock = 0, shardID = '') {}

  // block
  // transaction
  /**
   *
   * privateKey - string
   */
  ListOutputCoins(privateKey = '') {}

  /**
   * min - number
   * max - number
   * privateKeys - array of object
   * list privateKeys example
   * [
   {
            "PrivateKey":"112t8rqGc71CqjrDCuReGkphJ4uWHJmiaV7rVczqNhc33pzChmJRvikZNc3Dt5V7quhdzjWW9Z4BrB2BxdK5VtHzsG9JZdZ5M7yYYGidKKZV"
         },{
            "PrivateKey":"112t8rqnMrtPkJ4YWzXfG82pd9vCe2jvWGxqwniPM5y4hnimki6LcVNfXxN911ViJS8arTozjH4rTpfaGo5i1KKcG1ayjiMsa4E3nABGAqQh"
         },{
            "PrivateKey":"112t8rnYJ1vLAeZdLthNe6k4CCEBbhmdL3q6Jh2pbD6vg5ZGRdxRPU2x9u7rrY8YCTGFkQciAgEZbkvA4EcuybCYBXDfS6mwkQcSMFhaaaBj"
         }
   ]
   */

  ListUnspentOutputCoins(min = 0, max = 999999, privateKeys = []) {}

  /**
   *
   * privateKey - string
   * example : "112t8rqGc71CqjrDCuReGkphJ4uWHJmiaV7rVczqNhc33pzChmJRvikZNc3Dt5V7quhdzjWW9Z4BrB2BxdK5VtHzsG9JZdZ5M7yYYGidKKZV"
   */
  GetBalanceByPrivatekey(privateKey = '') {}

  /**
   *
   * privateKey - string, eg : "112t8rqGc71CqjrDCuReGkphJ4uWHJmiaV7rVczqNhc33pzChmJRvikZNc3Dt5V7quhdzjWW9Z4BrB2BxdK5VtHzsG9JZdZ5M7yYYGidKKZV"
   * paymentAddress - objects with paymentAddress as key, eg :{"1Uv2bWvMhSh3SVBsRvcjaoS17sCbQZRnTjP5cRMas94RNRdmUYXEJY1h93Vn4Z4ekSU3um57dLvpBSV7amFSs7NqqzUKuPqRYgjYbSmP8":1}
   * fee - number
   * hasPrivacy - number (only 0|1)
   */
  CreateAndSendTransaction(privateKey = '', paymentAddress = [], fee = 0, hasPrivacy = 1) {}

  /**
   * transactionHash - string
   * eg: "916654c01e09828a3cbb17d8b58fb02ce975e84f7a2a8d207a343bba33589f56"
   */
  GetTransactionByHash(transactionHash = '') {}

  /**
   * blockHash - string
   * eg: "916654c01e09828a3cbb17d8b58fb02ce975e84f7a2a8d207a343bba33589f56"
   * verbosity - string
   */
  RetrieveBlock(blockHash = '', verbosity = '1') {}


  /**
   * blockHash - string
   * eg: "916654c01e09828a3cbb17d8b58fb02ce975e84f7a2a8d207a343bba33589f56"
   * verbosity - string
   */
  RetrieveBeaconBlock(blockHash = '', verbosity = '1') {}

  /**
   *
   * privateKey - string, eg : "112t8rqGc71CqjrDCuReGkphJ4uWHJmiaV7rVczqNhc33pzChmJRvikZNc3Dt5V7quhdzjWW9Z4BrB2BxdK5VtHzsG9JZdZ5M7yYYGidKKZV"
   * paymentAddress - objects with paymentAddress as key, eg :{"1Uv2bWvMhSh3SVBsRvcjaoS17sCbQZRnTjP5cRMas94RNRdmUYXEJY1h93Vn4Z4ekSU3um57dLvpBSV7amFSs7NqqzUKuPqRYgjYbSmP8":1}
   * fee - number
   * hasPrivacy - number (only 0)
   * stake Type - number
   */
  CreateAndSendStakingTransaction(privateKey = '', paymentAddress = [], fee = 0, hasPrivacy = 0, stakeType = 63) {}

  /**
   *
   */
  GetBeaconBestState() {}

  /**
   * shardId - number
   */
  GetShardBestState() {}

  GetNodeRole() {}

  CheckHashValue() {}

  GetMempoolInfo() {}

  ListPrivacyCustomToken() {}

  GetRewardAmount(data = "") {}

  ListRewardAmount() {}
}

// Implement virtual method
function rpc(method, client, params) {
  return new Promise((resolve, reject) => {
    client.request(method, params, (err, response) => {
      if (err) return reject(err);
      return resolve(response.Result);
    });
  });
}

for (const f of Object.getOwnPropertyNames(ConstantNodeRPC.prototype)) {
  if (f == 'constructor') continue;
  ConstantNodeRPC.prototype[f] = function (...params) {
    return rpc(f.toLowerCase(), this.client, params);
  };
}

module.exports = ConstantNodeRPC;
