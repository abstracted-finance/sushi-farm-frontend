import { createContainer } from "unstated-next";
import { useEffect, useState } from "react";
import ethers from "ethers";

import useWeb3 from "./use-web3";

import sushiFarmJson from "./sushi-farm.sol.json";

const dsTokenAbi =
  sushiFarmJson.contracts["lib/ds-token/src/token.sol:DSToken"].abi;
const sushiFarmAbi =
  sushiFarmJson.contracts["src/sushi-farm.sol:SushiFarm"].abi;
const masterchefAbi =
  sushiFarmJson.contracts["src/interfaces/masterchef.sol:Masterchef"].abi;

interface EthersContracts {
  SushiFarm: ethers.Contract;
  SushiToken: ethers.Contract;
  GrazingSushiToken: ethers.Contract;
  Masterchef: ethers.Contract;
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
