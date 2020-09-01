import { createContainer } from "unstated-next";
import { useEffect, useState } from "react";
import ethers from "ethers";

import useWeb3 from "./use-web3";

import sushiFarmJson from "./sushi-farm.sol.json";
import snxEthLpFarmJson from "./snx-eth-lp-farm.sol.json";

import uniswapPairAbi from "./uniswap-pair.abi.json";

const dsTokenAbi =
  sushiFarmJson.contracts["lib/ds-token/src/token.sol:DSToken"].abi;
const uniV2Router2Abi =
  snxEthLpFarmJson.contracts["src/interfaces/uniswap.sol:UniswapRouterV2"].abi;
const sushiFarmAbi =
  sushiFarmJson.contracts["src/sushi-farm.sol:SushiFarm"].abi;
const masterchefAbi =
  sushiFarmJson.contracts["src/interfaces/masterchef.sol:Masterchef"].abi;
const snxEthLPFarmAbi =
  snxEthLpFarmJson.contracts["src/lp-farm.sol:LPFarm"].abi;

interface EthersContracts {
  SushiFarm: ethers.Contract;
  SushiToken: ethers.Contract;
  WEth: ethers.Contract;
  Snx: ethers.Contract;
  GrazingSushiToken: ethers.Contract;
  Masterchef: ethers.Contract;
  SnxEthLpFarm: ethers.Contract;
  SnxEthLpToken: ethers.Contract;
  DegenSnxEthLpToken: ethers.Contract;
  UniV2Router2: ethers.Contract;
  UniV2Pair: ethers.Contract;
}

function useContracts() {
  const { signer } = useWeb3.useContainer();
  const [contracts, setContracts] = useState<null | EthersContracts>(null);

  const updateContractSigner = () => {
    setContracts({
      SushiFarm: new ethers.Contract(
        "0xA0508a94848fc6c1bed5597905cD7d2bbA4A959a",
        sushiFarmAbi,
        signer
      ),
      WEth: new ethers.Contract(
        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        dsTokenAbi,
        signer
      ),
      Snx: new ethers.Contract(
        "0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F",
        dsTokenAbi,
        signer
      ),
      SushiToken: new ethers.Contract(
        "0x6B3595068778DD592e39A122f4f5a5cF09C90fE2",
        dsTokenAbi,
        signer
      ),
      GrazingSushiToken: new ethers.Contract(
        "0x339d73f9a0fbd064ea81f274437760a9db934806",
        dsTokenAbi,
        signer
      ),
      Masterchef: new ethers.Contract(
        "0xc2edad668740f1aa35e4d8f227fb8e17dca888cd",
        masterchefAbi,
        signer
      ),
      SnxEthLpFarm: new ethers.Contract(
        "0xC9a6fbCb2541EcB37ed0D67C36d3E7B54A0a09cA",
        snxEthLPFarmAbi,
        signer
      ),
      SnxEthLpToken: new ethers.Contract(
        "0x43AE24960e5534731Fc831386c07755A2dc33D47",
        dsTokenAbi,
        signer
      ),
      DegenSnxEthLpToken: new ethers.Contract(
        "0x594000baf94b5185054cf7ba809d9ec089e2e62e",
        dsTokenAbi,
        signer
      ),
      UniV2Router2: new ethers.Contract(
        "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
        uniV2Router2Abi,
        signer
      ),
      UniV2Pair: new ethers.Contract(
        ethers.constants.AddressZero,
        uniswapPairAbi,
        signer
      ),
    });
  };

  useEffect(() => {
    if (signer === null) return;

    updateContractSigner();
  }, [signer]);

  return {
    contracts,
  };
}

export default createContainer(useContracts);
