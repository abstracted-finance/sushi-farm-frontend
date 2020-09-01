import { createContainer } from "unstated-next";
import { useEffect, useState } from "react";

import useWeb3 from "./use-web3";
import useContracts from "./use-contracts";
import { ethers } from "ethers";
import { ERC20_ADDRESSES } from "./constants";

function useSnxEthLpToken() {
  const { ethAddress, connected, signer } = useWeb3.useContainer();
  const { contracts } = useContracts.useContainer();

  const [
    isGettingSnxEthLpTokenBalance,
    setIsGettingSnxEthLpTokenBalance,
  ] = useState<boolean>(false);
  const [
    snxEthLpTokenBalance,
    setSnxEthLpTokenBalance,
  ] = useState<null | ethers.BigNumber>(null);

  const [
    usdPerSnxEthLpToken,
    setUsdPerSnxEthLpToken,
  ] = useState<null | ethers.BigNumber>(null);

  const getSnxEthLpStats = async () => {
    const { SnxEthLpToken, Snx, WEth, UniV2Pair } = contracts;

    setIsGettingSnxEthLpTokenBalance(true);

    const bal = await SnxEthLpToken.balanceOf(ethAddress);

    const [wethSupply, snxSupply, totalSupply, gecko] = await Promise.all([
      WEth.balanceOf(ERC20_ADDRESSES.UNIV2_SNX_ETH),
      Snx.balanceOf(ERC20_ADDRESSES.UNIV2_SNX_ETH),
      UniV2Pair.attach(ERC20_ADDRESSES.UNIV2_SNX_ETH).totalSupply(),
      fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=havven,ethereum&vs_currencies=usd",
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
      ),
    ]);

    const geckoData = await gecko.json();

    const oneLpToken = ethers.utils.parseUnits("1", 18);

    // How much is 1 LP token worth in SNX and WETH?
    // https://github.com/Uniswap/uniswap-v2-core/blob/master/contracts/UniswapV2Pair.sol#L144
    const wethAmount = oneLpToken.mul(wethSupply).div(totalSupply);
    const snxAmount = oneLpToken.mul(snxSupply).div(totalSupply);

    const wethUsdAmount = wethAmount
      .mul(ethers.utils.parseUnits(geckoData.ethereum.usd.toString(), 18))
      .div(ethers.utils.parseUnits("1", 18));
    const snxUsdAmount = snxAmount
      .mul(ethers.utils.parseUnits(geckoData.havven.usd.toString(), 18))
      .div(ethers.utils.parseUnits("1", 18));

    const totalUsdAmount = wethUsdAmount.add(snxUsdAmount);

    setUsdPerSnxEthLpToken(totalUsdAmount);
    setSnxEthLpTokenBalance(bal);
    setIsGettingSnxEthLpTokenBalance(false);
  };

  useEffect(() => {
    if (!connected) return;
    if (!signer) return;
    if (!contracts) return;

    getSnxEthLpStats();
    setInterval(getSnxEthLpStats, 30000);
  }, [signer, contracts, connected]);

  return {
    isGettingSnxEthLpTokenBalance,
    usdPerSnxEthLpToken,
    snxEthLpTokenBalance,
    getSnxEthLpStats,
  };
}

export default createContainer(useSnxEthLpToken);
