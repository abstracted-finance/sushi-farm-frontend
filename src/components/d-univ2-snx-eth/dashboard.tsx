import {
  Button,
  Input,
  Text,
  Card,
  Row,
  Col,
  Spacer,
  Link,
} from "@zeit-ui/react";
import { ethers } from "ethers";
import { useState } from "react";

import useSnxEthLpToken from "../../containers/use-snx-eth-lp-token";
import useSnxEthLpFarm from "../../containers/use-snx-eth-lp-farm";
import useSnxEthLpDegenToken from "../../containers/use-snx-eth-lp-degen-token";
import { prettyString } from "../utils";

export const Dashboard = function () {
  const {
    isDepositing,
    deposit,
    withdraw,
    harvest,
    isHarvesting,
    isWithdrawing,
    degenSnxEthLpRatio,
    lockedSnxEthLp,
    harvestableAmount,
  } = useSnxEthLpFarm.useContainer();
  const {
    snxEthLpTokenBalance,
    usdPerSnxEthLpToken,
  } = useSnxEthLpToken.useContainer();
  const { degenSnxEthLpTokenBalance } = useSnxEthLpDegenToken.useContainer();

  const [depositAmount, setDepositAmount] = useState<string>("");
  const [withdrawAmount, setWithdrawAmount] = useState<string>("");

  let validDepositAmount;
  try {
    ethers.utils.parseUnits(depositAmount, 18);
    validDepositAmount = true;
  } catch (e) {
    validDepositAmount = false;
  }

  let validWithdrawAmount;
  try {
    ethers.utils.parseUnits(withdrawAmount, 18);
    validWithdrawAmount = true;
  } catch (e) {
    validWithdrawAmount = false;
  }

  const harvestableAmountStr = harvestableAmount
    ? prettyString(ethers.utils.formatUnits(harvestableAmount, 18))
    : "...";

  const harvesterRewardsAmountStr = harvestableAmount
    ? prettyString(
        ethers.utils.formatUnits(harvestableAmount.mul(25).div(1000), 18)
      )
    : "...";

  const lockedSnxEthLpStr = lockedSnxEthLp
    ? prettyString(ethers.utils.formatUnits(lockedSnxEthLp, 18))
    : "...";

  const degenSnxEthLpRatioStr = degenSnxEthLpRatio
    ? prettyString(ethers.utils.formatUnits(degenSnxEthLpRatio, 18), 4)
    : "...";

  const snxEthLpTokenBalanceStr = snxEthLpTokenBalance
    ? prettyString(ethers.utils.formatUnits(snxEthLpTokenBalance, 18))
    : "...";

  const degenSnxEthLpTokenBalanceStr = degenSnxEthLpTokenBalance
    ? prettyString(ethers.utils.formatUnits(degenSnxEthLpTokenBalance, 18))
    : "...";

  const usdPerSnxEthLpTokenStr = usdPerSnxEthLpToken
    ? prettyString(ethers.utils.formatUnits(usdPerSnxEthLpToken, 18))
    : "...";

  const totalUsdLockedStr =
    usdPerSnxEthLpToken && lockedSnxEthLp
      ? prettyString(
          ethers.utils.formatUnits(
            lockedSnxEthLp
              .mul(usdPerSnxEthLpToken)
              .div(ethers.utils.parseUnits("1", 18)),
            18
          )
        )
      : "...";

  return (
    <>
      <Row gap={0.33} style={{ textAlign: "center" }}>
        <Col span={8}>
          <Card>
            <Text h4>SNX-ETH UNI-V2 Price</Text>
            <Text type="secondary">{usdPerSnxEthLpTokenStr} USD</Text>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Text h4>Total SNX-ETH UNI-V2 Locked</Text>
            <Text type="secondary">{lockedSnxEthLpStr}</Text>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Text h4>Total USD Locked</Text>
            <Text type="secondary">{totalUsdLockedStr} USD</Text>
          </Card>
        </Col>
      </Row>

      <Spacer y={1} />

      <Row gap={0.33}>
        <Col>
          <Card>
            <Text h4>Harvest</Text>
            <Text type="secondary">
              {harvestableAmountStr} SNX-ETH LP will be harvested for those who
              deposit. Only {harvesterRewardsAmountStr} SNX-ETH LP will be
              rewarded to the caller (and developer).
            </Text>
            <Button
              onClick={() => {
                harvest();
              }}
              loading={isHarvesting}
              type="secondary"
              style={{ width: "100%" }}
            >
              Harvest
            </Button>
          </Card>
        </Col>
      </Row>

      <Spacer y={1} />

      <Row gap={0.33} style={{ textAlign: "center" }}>
        <Col span={8}>
          <Card>
            <Text h4>SNX-ETH UNI-V2</Text>
            <Text type="secondary">Balance: {snxEthLpTokenBalanceStr}</Text>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Text h4>Ratio</Text>
            <Text type="secondary">
              1 Degen SNX-ETH = {degenSnxEthLpRatioStr} SNX-ETH
            </Text>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Text h4>Degen SNX-ETH UNI-V2</Text>
            <Text type="secondary">
              Balance: {degenSnxEthLpTokenBalanceStr}
            </Text>
          </Card>
        </Col>
      </Row>

      <Spacer y={1} />

      <Row gap={0.33}>
        <Col span={12}>
          <Card>
            <Text h4>Deposit</Text>
            <Text type="secondary">
              SNX-ETH -{">"} Degen SNX-ETH.{" "}
              <Link
                onClick={(e) => {
                  e.preventDefault();
                  setDepositAmount(
                    ethers.utils.formatUnits(
                      snxEthLpTokenBalance || ethers.constants.Zero,
                      18
                    )
                  );
                }}
                color
              >
                (Max)
              </Link>
            </Text>
            <Input
              onChange={(e) => setDepositAmount(e.target.value)}
              value={depositAmount}
              placeholder="SUSHI amount"
              width="100%"
            />
            <Spacer y={0.5} />
            <Button
              onClick={() => {
                deposit(ethers.utils.parseUnits(depositAmount, 18));
              }}
              loading={isDepositing}
              disabled={!validDepositAmount}
              style={{ width: "100%" }}
              type="secondary"
              auto
            >
              Deposit
            </Button>
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Text h4>Withdraw</Text>
            <Text type="secondary">
              Degen SNX-ETH -{">"} SNX-ETH.{" "}
              <Link
                onClick={(e) => {
                  e.preventDefault();
                  setWithdrawAmount(
                    ethers.utils.formatUnits(
                      degenSnxEthLpTokenBalance || ethers.constants.Zero,
                      18
                    )
                  );
                }}
                color
              >
                (Max)
              </Link>
            </Text>
            <Input
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="SUSHI amount"
              width="100%"
            />
            <Spacer y={0.5} />
            <Button
              onClick={() => {
                withdraw(ethers.utils.parseUnits(withdrawAmount, 18));
              }}
              loading={isWithdrawing}
              disabled={!validWithdrawAmount}
              style={{ width: "100%" }}
              type="secondary"
              auto
            >
              Withdraw
            </Button>
          </Card>
        </Col>
      </Row>
    </>
  );
};
