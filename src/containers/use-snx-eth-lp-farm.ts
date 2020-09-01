import { createContainer } from "unstated-next";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useToasts } from "@zeit-ui/react";

import useWeb3 from "./use-web3";
import useContracts from "./use-contracts";
import useSnxEthLpToken from "./use-snx-eth-lp-token";
import useDegenSnxEthLpToken from "./use-snx-eth-lp-degen-token";

import { ERC20_ADDRESSES } from "./constants";

function useSnxEthLpFarm() {
  const [, setToast] = useToasts();
  const { ethAddress, connected, signer } = useWeb3.useContainer();
  const { contracts } = useContracts.useContainer();
  const { getSnxEthLpStats } = useSnxEthLpToken.useContainer();
  const { getDegenSnxEthLpStats } = useDegenSnxEthLpToken.useContainer();

  const [
    degenSnxEthLpRatio,
    setDegenSnxEthLpRatio,
  ] = useState<null | ethers.BigNumber>(null);
  const [lockedSnxEthLp, setLockedSnxEthLp] = useState<null | ethers.BigNumber>(
    null
  );
  const [harvestableAmount, setHarvestableAmount] = useState<null | ethers.BigNumber>(
    null
  );

  const [isGettingSnxEthLpFarmStats, setIsGettingSnxEthLpFarmStats] = useState<
    boolean
  >(false);

  const [isHarvesting, setIsHarvesting] = useState(false);
  const [isDepositing, setIsDepositing] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const getSnxEthLpFarmStats = async () => {
    const {
      SnxEthLpFarm,
      Masterchef,
      UniV2Router2,
      SushiToken,
      WEth,
      Snx,
      UniV2Pair,
    } = contracts;
    setIsGettingSnxEthLpFarmStats(true);

    const [
      ratio,
      locked,
      sushiPending,
      sushiBal,
      uniPairSnxBal,
      uniPairWethBal,
      uniSnxEthTotalSupply,
    ] = await Promise.all([
      SnxEthLpFarm.getRatioPerShare(),
      SnxEthLpFarm.getLpTokenBalance(),
      Masterchef.pendingSushi(6, SnxEthLpFarm.address),
      SushiToken.balanceOf(SnxEthLpFarm.address),
      Snx.balanceOf(ERC20_ADDRESSES.UNIV2_SNX_ETH),
      WEth.balanceOf(ERC20_ADDRESSES.UNIV2_SNX_ETH),
      UniV2Pair.attach(ERC20_ADDRESSES.UNIV2_SNX_ETH).totalSupply(),
    ]);

    const totalSushiBal = sushiPending.add(sushiBal);
    let liquidity = ethers.constants.Zero;

    if (totalSushiBal.gt(ethers.constants.Zero)) {
      // How many WETH can we get for our SUSHI?
      let wethBal = (
        await UniV2Router2.getAmountsOut(totalSushiBal, [
          ERC20_ADDRESSES.SUSHI,
          ERC20_ADDRESSES.WETH,
        ])
      )[1];

      // Divide by 2 to get SNX amount
      wethBal = wethBal.div(2);
      const snxBal = (
        await UniV2Router2.getAmountsOut(wethBal, [
          ERC20_ADDRESSES.WETH,
          ERC20_ADDRESSES.SNX,
        ])
      )[1];

      // How many UNIV2 SNX-ETH Tokens can we get given X sushi
      // https://github.com/Uniswap/uniswap-v2-core/blob/master/contracts/UniswapV2Pair.sol#L123
      const liquiditySnx = snxBal.mul(uniSnxEthTotalSupply).div(uniPairSnxBal);
      const liquidityWeth = wethBal
        .mul(uniSnxEthTotalSupply)
        .div(uniPairWethBal);

      liquidity = liquiditySnx.gt(liquidityWeth) ? liquiditySnx : liquidityWeth;
    }

    setHarvestableAmount(liquidity);
    setDegenSnxEthLpRatio(ratio);
    setLockedSnxEthLp(locked);

    setIsGettingSnxEthLpFarmStats(false);
  };

  const deposit = async (depositAmountWei: ethers.BigNumber) => {
    const { SnxEthLpToken, SnxEthLpFarm } = contracts;
    setIsDepositing(true);
    try {
      const approvedBal = await SnxEthLpToken.allowance(
        ethAddress,
        SnxEthLpFarm.address
      );

      if (approvedBal.lt(depositAmountWei)) {
        setToast({
          text: "Approving contract!",
        });

        const approveTx = await SnxEthLpToken["approve(address,uint256)"](
          SnxEthLpFarm.address,
          ethers.constants.MaxUint256
        );
        await approveTx.wait();

        setToast({
          text: "Approved contract!",
          type: "success",
        });
      }

      const tx = await SnxEthLpFarm.deposit(depositAmountWei, {
        gasLimit: 600000,
      });

      setToast({
        text: "Deposit pending!",
      });

      await tx.wait();

      setToast({
        text: "Deposit successful!",
        type: "success",
      });
    } catch (e) {
      setToast({
        text: "Deposit failed!",
        type: "error",
      });
    }

    getSnxEthLpFarmStats();
    getDegenSnxEthLpStats();
    getSnxEthLpFarmStats();

    setIsDepositing(false);
  };

  const withdraw = async (withdrawAmountWei: ethers.BigNumber) => {
    const { DegenSnxEthLpToken, SnxEthLpFarm } = contracts;
    setIsWithdrawing(true);
    try {
      const approvedBal = await DegenSnxEthLpToken.allowance(
        ethAddress,
        SnxEthLpFarm.address
      );

      if (approvedBal.lt(withdrawAmountWei)) {
        setToast({
          text: "Approving contract!",
        });

        const approveTx = await DegenSnxEthLpToken["approve(address,uint256)"](
          SnxEthLpFarm.address,
          ethers.constants.MaxUint256
        );
        await approveTx.wait();

        setToast({
          text: "Approved contract!",
          type: "success",
        });
      }

      const tx = await SnxEthLpFarm.withdraw(withdrawAmountWei, {
        gasLimit: 600000,
      });

      setToast({
        text: "Withdraw pending!",
      });

      await tx.wait();

      getSnxEthLpFarmStats();
      getDegenSnxEthLpStats();
      getSnxEthLpFarmStats();

      setToast({
        text: "Withdraw successful!",
        type: "success",
      });
    } catch (e) {
      setToast({
        text: "Deposit failed!",
        type: "error",
      });
    }
    setIsWithdrawing(false);
  };

  const harvest = async () => {
    const { SnxEthLpFarm } = contracts;
    setIsHarvesting(true);
    try {
      const tx = await SnxEthLpFarm.harvest({ gasLimit: 1500000 });
      setToast({
        text: "Harvesting pending!",
      });
      await tx.wait();

      getSnxEthLpFarmStats();
      getDegenSnxEthLpStats();
      getSnxEthLpFarmStats();

      setToast({
        text: "Harvesting successful!",
        type: "success",
      });
    } catch (e) {
      setToast({
        text: "Harvesting failed!",
        type: "error",
      });
    }
    setIsHarvesting(false);
  };

  useEffect(() => {
    if (!connected) return;
    if (!signer) return;
    if (!contracts) return;

    getSnxEthLpFarmStats();
    setInterval(getSnxEthLpFarmStats, 30000);
  }, [signer, contracts, connected]);

  return {
    harvestableAmount,
    isHarvesting,
    isDepositing,
    isWithdrawing,
    degenSnxEthLpRatio,
    lockedSnxEthLp,
    isGettingSnxEthLpFarmStats,
    deposit,
    withdraw,
    harvest,
  };
}

export default createContainer(useSnxEthLpFarm);
