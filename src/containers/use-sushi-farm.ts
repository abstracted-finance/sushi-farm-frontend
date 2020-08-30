import { createContainer } from "unstated-next";
import { useEffect, useState } from "react";

import useWeb3 from "./use-web3";
import useContracts from "./use-contracts";
import useSushiToken from "./use-sushi-token";
import useGrazingSushiToken from "./use-grazing-sushi-token";
import { ethers, BigNumber } from "ethers";
import { useToasts } from "@zeit-ui/react";

function useSushiFarm() {
  const [, setToast] = useToasts();
  const { ethAddress, connected, signer } = useWeb3.useContainer();
  const { contracts } = useContracts.useContainer();
  const { getSushiStats } = useSushiToken.useContainer();
  const { getGSushiStats } = useGrazingSushiToken.useContainer();

  const [
    totalLockedGSushi,
    setTotalLockedGSushi,
  ] = useState<null | ethers.BigNumber>(null);

  const [
    harvestableAmount,
    setHarvestableAmount,
  ] = useState<null | ethers.BigNumber>(null);

  const [isHarvesting, setIsHavesting] = useState<boolean>(false);
  const [isDepositingSushi, setIsDepositingSushi] = useState<boolean>(false);
  const [isWithdrawingGSushi, setIsWithdrawingGSushi] = useState<boolean>(
    false
  );
  const [isGettingSushiFarmStats, setIsGettingSushiFarmStats] = useState<
    boolean
  >(false);

  const [
    gSushiOverSushiRatio,
    setGSushiOverSushiRatio,
  ] = useState<null | ethers.BigNumber>(null);

  const [lastHarvest, setLastHarvest] = useState<null | ethers.BigNumber>(null);

  const getSushiFarmStats = async () => {
    const { SushiFarm, Masterchef, SushiToken } = contracts;

    setIsGettingSushiFarmStats(true);

    const [ratio, time, pending, user, sushiBal] = await Promise.all([
      SushiFarm.getGSushiOverSushiRatio(),
      SushiFarm.lastHarvest(),
      // Pool ID is 12
      Masterchef.pendingSushi(12, SushiFarm.address),
      // Get user info
      Masterchef.userInfo(12, SushiFarm.address),
      // Sushi Balance
      SushiToken.balanceOf(SushiFarm.address)
    ]);

    setTotalLockedGSushi(user[0]);
    setHarvestableAmount(pending.add(sushiBal));
    setLastHarvest(time);
    setGSushiOverSushiRatio(ratio);

    setIsGettingSushiFarmStats(false);
  };

  const depositSushi = async (depositAmountWei: ethers.BigNumber) => {
    const { SushiFarm, SushiToken } = contracts;
    setIsDepositingSushi(true);
    try {
      const approvedBal = await SushiToken.allowance(
        ethAddress,
        SushiFarm.address
      );

      if (approvedBal.lt(depositAmountWei)) {
        setToast({
          text: "Approving contract!",
        });

        const approveTx = await SushiToken["approve(address,uint256)"](
          SushiFarm.address,
          ethers.constants.MaxUint256
        );
        await approveTx.wait();

        setToast({
          text: "Approved contract!",
          type: "success",
        });
      }

      const tx = await SushiFarm.deposit(depositAmountWei, {
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

      getSushiStats();
      getGSushiStats();
      getSushiFarmStats();
    } catch (e) {
      setToast({
        text: "Deposit failed!",
        type: "error",
      });
    }
    setIsDepositingSushi(false);
  };

  const withdrawGSushi = async (withdrawAmountWei: ethers.BigNumber) => {
    const { SushiFarm, GrazingSushiToken } = contracts;
    setIsWithdrawingGSushi(true);
    try {
      const approvedBal = await GrazingSushiToken.allowance(
        ethAddress,
        SushiFarm.address
      );

      if (approvedBal.lt(withdrawAmountWei)) {
        setToast({
          text: "Approving contract!",
        });

        const approveTx = await GrazingSushiToken["approve(address,uint256)"](
          SushiFarm.address,
          ethers.constants.MaxUint256
        );
        await approveTx.wait();

        setToast({
          text: "Approved contract!",
          type: "success",
        });
      }

      const tx = await SushiFarm.withdraw(withdrawAmountWei, {
        gasLimit: 600000,
      });

      setToast({
        text: "Withdraw pending!",
      });

      await tx.wait();

      getSushiStats();
      getGSushiStats();
      getSushiFarmStats();

      setToast({
        text: "Withdraw successful!",
        type: "success",
      });
    } catch (e) {
      setToast({
        text: "Withdraw failed!",
        type: "error",
      });
    }
    setIsWithdrawingGSushi(false);
  };

  const harvest = async () => {
    const { SushiFarm, GrazingSushiToken } = contracts;
    setIsHavesting(true);
    try {
      const tx = await SushiFarm.harvest();
      setToast({
        text: "Harvesting pending!",
      });
      await tx.wait();

      getSushiStats();
      getGSushiStats();
      getSushiFarmStats();

      setToast({
        text: "Harvesting successful!",
        type: "success",
      });
    } catch (e) { }
    setIsHavesting(false);
  };

  useEffect(() => {
    if (!connected) return;
    if (!signer) return;
    if (!contracts) return;

    getSushiFarmStats();
  }, [signer, contracts, connected]);

  return {
    gSushiOverSushiRatio,
    isGettingSushiFarmStats,
    depositSushi,
    isDepositingSushi,
    withdrawGSushi,
    isWithdrawingGSushi,
    harvest,
    isHarvesting,
    lastHarvest,
    harvestableAmount,
    totalLockedGSushi,
  };
}

export default createContainer(useSushiFarm);
