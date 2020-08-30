import { createContainer } from "unstated-next";
import { useEffect, useState } from "react";

import useWeb3 from "./use-web3";
import useContracts from "./use-contracts";
import { ethers } from "ethers";

function useGrazingSushiToken() {
  const { ethAddress, connected, signer } = useWeb3.useContainer();
  const { contracts } = useContracts.useContainer();

  const [isGettingGSushiBalance, setIsGettingGSushiBalance] = useState<boolean>(
    false
  );
  const [gSushiBalance, setGSushiBalance] = useState<null | ethers.BigNumber>(
    null
  );

  const getGSushiStats = async () => {
    const { GrazingSushiToken } = contracts;

    setIsGettingGSushiBalance(true);
    const bal = await GrazingSushiToken.balanceOf(ethAddress);
    setGSushiBalance(bal);
    setIsGettingGSushiBalance(false);
  };

  useEffect(() => {
    if (!connected) return;
    if (!signer) return;
    if (!contracts) return;

    getGSushiStats();
  }, [signer, contracts, connected]);

  return {
    gSushiBalance,
    isGettingGSushiBalance,
    getGSushiStats,
  };
}

export default createContainer(useGrazingSushiToken);
