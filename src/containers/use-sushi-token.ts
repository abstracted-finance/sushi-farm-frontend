import { createContainer } from "unstated-next";
import { useEffect, useState } from "react";

import useWeb3 from "./use-web3";
import useContracts from "./use-contracts";
import { ethers } from "ethers";

function useSushiToken() {
  const { ethAddress, connected, signer } = useWeb3.useContainer();
  const { contracts } = useContracts.useContainer();

  const [usdPerSushi, setUSDPerSushi] = useState<null | Number>(null)

  const [isGettingSushiBalance, setIsGettingSushiBalance] = useState<boolean>(
    false
  );
  const [sushiBalance, setSushiBalance] = useState<null | ethers.BigNumber>(
    null
  );

  const getSushiStats = async () => {
    const { SushiToken } = contracts;

    setIsGettingSushiBalance(true);

    const [bal, gecko] = await Promise.all([
      SushiToken.balanceOf(ethAddress),
      fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=sushi&vs_currencies=usd",
        {
          headers: {
            accept: "application/json",
            "accept-language":
              "en-AU,en;q=0.9,ru-RU;q=0.8,ru;q=0.7,zh-CN;q=0.6,zh;q=0.5,en-GB;q=0.4,en-US;q=0.3",
            "if-none-match": 'W/"b152af8a86daf39dd04e1140e3bb6543"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
          },
          referrer: "https://www.coingecko.com/",
          referrerPolicy: "strict-origin-when-cross-origin",
          body: null,
          method: "GET",
          mode: "cors",
          credentials: "omit",
        }
      )
    ])
    const geckoData = await gecko.json()

    setUSDPerSushi(geckoData.sushi.usd)
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
    usdPerSushi
  };
}

export default createContainer(useSushiToken);
