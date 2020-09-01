import { createContainer } from "unstated-next";
import { useEffect, useState } from "react";

import useWeb3 from "./use-web3";
import useContracts from "./use-contracts";
import { ethers } from "ethers";

function useDegenSnxEthLpToken() {
  const { ethAddress, connected, signer } = useWeb3.useContainer();
  const { contracts } = useContracts.useContainer();

  const [
    isGettingDegenSnxEthLpTokenBalance,
    setIsGettingDegenSnxEthLpTokenBalance,
  ] = useState<boolean>(false);
  const [
    degenSnxEthLpTokenBalance,
    setDegenSnxEthLpTokenBalance,
  ] = useState<null | ethers.BigNumber>(null);

  const getDegenSnxEthLpStats = async () => {
    const { DegenSnxEthLpToken } = contracts;

    setIsGettingDegenSnxEthLpTokenBalance(true);

    const bal = await DegenSnxEthLpToken.balanceOf(ethAddress);
    setDegenSnxEthLpTokenBalance(bal);
    setIsGettingDegenSnxEthLpTokenBalance(false);
  };

  useEffect(() => {
    if (!connected) return;
    if (!signer) return;
    if (!contracts) return;

    getDegenSnxEthLpStats();
    setInterval(getDegenSnxEthLpStats, 30000);
  }, [signer, contracts, connected]);

  return {
    isGettingDegenSnxEthLpTokenBalance,
    degenSnxEthLpTokenBalance,
    getDegenSnxEthLpStats,
  };
}

export default createContainer(useDegenSnxEthLpToken);
