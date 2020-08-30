import { createContainer } from "unstated-next";
import { useEffect, useState } from "react";

import useWeb3 from "./use-web3";
import useContracts from "./use-contracts";
import { ethers } from "ethers";

function useSushiToken() {
  const { ethAddress, connected, signer } = useWeb3.useContainer();
  const { contracts } = useContracts.useContainer();

  const [isGettingSushiBalance, setIsGettingSushiBalance] = useState<boolean>(
    false
  );
  const [sushiBalance, setSushiBalance] = useState<null | ethers.BigNumber>(
    null
  );

  const getSushiStats = async () => {
    const { SushiToken } = contracts;

    setIsGettingSushiBalance(true);
    const bal = await SushiToken.balanceOf(ethAddress);
    setSushiBalance(bal);
    setIsGettingSushiBalance(false);
  };

  useEffect(() => {
    if (!connected) return;
    if (!signer) return;
    if (!contracts) return;

    getSushiStats();
  }, [signer, contracts, connected]);

  return {
    sushiBalance,
    isGettingSushiBalance,
    getSushiStats,
  };
}

export default createContainer(useSushiToken);
