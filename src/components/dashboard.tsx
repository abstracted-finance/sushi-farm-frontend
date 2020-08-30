import {
  Card,
  Input,
  Row,
  Col,
  Text,
  Button,
  Spacer,
  Link,
} from "@zeit-ui/react";
import { useState } from "react";
import { ethers } from "ethers";

import useSushiToken from "../containers/use-sushi-token";
import useGrazingSushiToken from "../containers/use-grazing-sushi-token";
import useSushiFarm from "../containers/use-sushi-farm";

import { prettyString } from "./utils";

export const Dashboard = () => {
  const { isGettingSushiBalance, sushiBalance, usdPerSushi } = useSushiToken.useContainer();
  const {
    isGettingGSushiBalance,
    gSushiBalance,
  } = useGrazingSushiToken.useContainer();
  const {
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
  } = useSushiFarm.useContainer();

  const sushiBalStr = ethers.utils.formatUnits(
    sushiBalance || ethers.constants.Zero,
    18
  );
  const gSushiBalStr = ethers.utils.formatUnits(
    gSushiBalance || ethers.constants.Zero,
    18
  );
  const gSushiOverSushiRatioStr = ethers.utils.formatUnits(
    gSushiOverSushiRatio || ethers.constants.Zero,
    18
  );

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

  const now = parseInt((Date.now() / 1000).toString());
  const harvestDelta =
    now - (parseInt((lastHarvest || 0).toString()) + 60 * 60);
  let canHarvest;
  let canHarvestIn = 0;
  let canHarvestInStr = "";
  if (!lastHarvest) {
    canHarvest = false;
  } else if (lastHarvest && lastHarvest.eq(ethers.constants.Zero)) {
    canHarvest = true;
  } else {
    if (harvestDelta > 0) {
      canHarvest = true;
    }
    if (harvestDelta < 0) {
      canHarvest = false;
      canHarvestIn = parseFloat((Math.abs(harvestDelta) / 60).toString());

      const temp = canHarvestIn.toFixed(2);
      canHarvestInStr = `${temp.split(".")[0]} minutes ${(
        (parseFloat(temp.split(".")[1]) * 60) /
        100
      ).toFixed(0)} seconds`;
    }
  }

  const harvestableAmountStr = ethers.utils.formatUnits(
    harvestableAmount || ethers.constants.Zero,
    18
  );

  // 5% rewards
  const harvesterRewardAmount = (harvestableAmount || ethers.constants.Zero)
    .mul(ethers.BigNumber.from("5"))
    .div(ethers.BigNumber.from("100"));
  const harvesterRewardAmountStr = ethers.utils.formatUnits(
    harvesterRewardAmount,
    18
  );

  let totalLockedStr = "...";
  if (totalLockedGSushi && gSushiOverSushiRatio) {
    totalLockedStr = ethers.utils.formatUnits(
      totalLockedGSushi
        .mul(gSushiOverSushiRatio)
        .div(ethers.utils.parseUnits("1", 18)),
      18
    );
  }

  // TLV in Sushi in USD
  let tlvSushiUSDStr = '...'
  if (usdPerSushi && totalLockedStr !== '...') {
    tlvSushiUSDStr = (parseFloat(usdPerSushi.toString()) * parseFloat(totalLockedStr)).toFixed(2) + ' USD'
  }

  return (
    <>
      <Row gap={0.33}>
        <Col span={8} style={{ textAlign: "center" }}>
          <Card>
            <Text h4>SUSHI Price</Text>
            <Text type="secondary">
              {!usdPerSushi && '...'}
              {usdPerSushi && `${usdPerSushi.toFixed(2)} USD`}
            </Text>
          </Card>
        </Col>
        <Col span={8} style={{ textAlign: "center" }}>
          <Card>
            <Text h4>Total SUSHI Locked</Text>
            <Text type="secondary">
              {!totalLockedGSushi && !gSushiOverSushiRatio && "..."}
              {totalLockedGSushi &&
                gSushiOverSushiRatio &&
                `${prettyString(totalLockedStr)} SUSHI`}
            </Text>
          </Card>
        </Col>
        <Col span={8} style={{ textAlign: "center" }}>
          <Card>
            <Text h4>Total USD Locked</Text>
            <Text type="secondary">
              {tlvSushiUSDStr}
            </Text>
          </Card>
        </Col>
      </Row>

      <Spacer y={1} />


      <Row gap={0.33}>
        <Col>
          <Card>
            <Text h4>Harvest</Text>
            <Text type="secondary">
              {harvestableAmount &&
                `${prettyString(
                  harvestableAmountStr
                )} SUSHI available for harvest. Caller gets ${prettyString(
                  harvesterRewardAmountStr
                )} SUSHI for GAS compensation.`}
            </Text>
            <Text type="secondary">
              {canHarvest && "Can harvest now!"}
              {!canHarvest && `Can harvest in ${canHarvestInStr}.`}
            </Text>
            <Button
              onClick={() => {
                harvest();
              }}
              loading={isHarvesting}
              disabled={!canHarvest}
              type="secondary"
              style={{ width: "100%" }}
            >
              Harvest
            </Button>
          </Card>
        </Col>
      </Row>

      <Spacer y={1} />

      <Row gap={0.33}>
        <Col span={8} style={{ textAlign: "center" }}>
          <Card>
            <Text h3>SUSHI Balance</Text>
            <Text type="secondary">
              {isGettingSushiBalance && "..."}
              {!isGettingSushiBalance && prettyString(sushiBalStr)}
            </Text>
          </Card>
        </Col>
        <Col span={8} style={{ textAlign: "center" }}>
          <Card>
            <Text h3>Ratio</Text>
            <Text type="secondary">
              1 gSushi = {isGettingSushiFarmStats && "..."}
              {!isGettingSushiFarmStats &&
                prettyString(gSushiOverSushiRatioStr)}{" "}
              SUSHI
            </Text>
          </Card>
        </Col>
        <Col span={8} style={{ textAlign: "center" }}>
          <Card>
            <Text h3>gSushi Balance</Text>
            <Text type="secondary">
              {isGettingGSushiBalance && "..."}
              {!isGettingGSushiBalance && prettyString(gSushiBalStr)}
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
              SUSHI -{">"} gSushi.{" "}
              <Link
                onClick={(e) => {
                  e.preventDefault();
                  setDepositAmount(
                    ethers.utils.formatUnits(
                      sushiBalance || ethers.constants.Zero,
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
                if (validDepositAmount) {
                  depositSushi(ethers.utils.parseUnits(depositAmount, 18));
                }
              }}
              loading={isDepositingSushi}
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
              gSushi -{">"} SUSHI.{" "}
              <Link
                onClick={(e) => {
                  e.preventDefault();
                  setWithdrawAmount(
                    ethers.utils.formatUnits(
                      gSushiBalance || ethers.constants.Zero,
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
                if (validWithdrawAmount) {
                  withdrawGSushi(ethers.utils.parseUnits(withdrawAmount, 18));
                }
              }}
              loading={isWithdrawingGSushi}
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
