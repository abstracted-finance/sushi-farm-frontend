import {
  Page,
  Row,
  Col,
  Text,
  Button,
  Link,
  Image,
  Spacer,
  Card,
} from "@zeit-ui/react";
import { useRouter } from "next/router";

import {
  default as useSelectedVaults,
  Vaults,
} from "../containers/use-selected-vaults";
import useWeb3 from "../containers/use-web3";

import { GSushi } from "./g-sushi/main";
import { DSNX } from "./d-univ2-snx-eth/main";

export const Main = () => {
  const router = useRouter();
  const { connected, connect, isConnecting } = useWeb3.useContainer();
  const { setSelectedVault, selectedVault } = useSelectedVaults.useContainer();

  return (
    <Page>
      {!connected ||
        (selectedVault === Vaults.None && (
          <Row>
            <Col>
              <Text h2>DEGEN Sushi Farm</Text>
              <Text type="secondary">
                DEGENERATE vaults, powered by{" "}
                <Link color href="https://www.coingecko.com/en/coins/sushi">
                  $SUSHI
                </Link>
                .
              </Text>
              <Text type="error">
                Contracts unaudited, enter at your own risk.
              </Text>
            </Col>
          </Row>
        ))}

      {!connected && (
        <Row>
          <Col style={{ textAlign: "center" }}>
            <Button onClick={connect} loading={isConnecting} type="secondary">
              Connect Metamask
            </Button>
          </Col>
        </Row>
      )}

      <Row>
        <Col>
          <Card type="error">
            <Text h4>PLEASE EXIT VAULTS NOW</Text>
            <Text h6>
              The vaults are using Uniswap behind the scenes, the migration to
              sushiswap has a large potential to break the vaults
            </Text>
          </Card>
        </Col>
      </Row>

      <Spacer y={0.33} />

      {connected && selectedVault === Vaults.None && (
        <>
          <Row>
            <Col span={6}>
              <Text h2>Vaults</Text>
            </Col>
          </Row>
          <Row gap={0.33}>
            <Col span={12}>
              <Card>
                <Image width={200} height={200} src="/sushi-cow.png" />
                <Text h3>Grazing SUSHI</Text>
                <Text type="secondary">Deposit SUSHI, earn more SUSHI.</Text>
                <Button
                  onClick={() => {
                    setSelectedVault(Vaults.GSushi);
                    router.push("/farms/g-sushi");
                  }}
                  type="secondary"
                  style={{ width: "100%" }}
                >
                  Select
                </Button>
              </Card>
            </Col>
            <Col span={12}>
              <Card>
                <Image width={200} height={200} src="/snake.png" />
                <Text h3>Degen SNX-ETH UNI-V2</Text>
                <Text type="secondary">
                  Deposit SNX-ETH UNI-V2, earn more SNX-ETH UNI-V2
                </Text>
                <Button
                  onClick={() => {
                    setSelectedVault(Vaults.DSNX);
                    router.push("/farms/degen-snx-eth");
                  }}
                  type="secondary"
                  style={{ width: "100%" }}
                >
                  Select
                </Button>
              </Card>
            </Col>
          </Row>
        </>
      )}

      {connected && selectedVault === Vaults.GSushi && <GSushi />}

      {connected && selectedVault === Vaults.DSNX && <DSNX />}
    </Page>
  );
};
