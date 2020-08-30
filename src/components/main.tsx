import { Page, Row, Col, Text, Button, Link } from "@zeit-ui/react";

import { Dashboard } from "./dashboard";

import useWeb3 from "../containers/use-web3";

export const Main = () => {
  const { connect, isConnecting, connected } = useWeb3.useContainer();

  return (
    <Page>
      <Row>
        <Col span={6}>
          <img src="./sushi-cow.png" width={200} height={200} />
        </Col>
        <Col span={18}>
          <Text h2>Sushi Farmer</Text>
          <Text p type="secondary">
            Deposit your $SUSHI, earn gSushi (auto grazing SUSHI).{" "}
            <Link color href="https://github.com/abstracted-finance/sushi-farm">
              Read more here.
            </Link>
          </Text>
          <Text p type="error">
            Holding gSushi means being exposed to impermenant loss on Uniswap's SUSHI/ETH pool. Contracts
            unaudited, enter at your own risk.
          </Text>
        </Col>
      </Row>

      {!connected && (
        <Row>
          <Col style={{ textAlign: "center" }}>
            <Button onClick={connect} loading={isConnecting} type="secondary">
              Connect Metamask
            </Button>
          </Col>
        </Row>
      )}

      {connected && <Dashboard />}
    </Page>
  );
};
