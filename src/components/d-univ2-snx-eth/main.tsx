import { Page, Row, Col, Text, Button, Link } from "@zeit-ui/react";

import { Dashboard } from "./dashboard";

import useWeb3 from "../../containers/use-web3";
import {
  default as useSelectedVaults,
  Vaults,
} from "../../containers/use-selected-vaults";

export const DSNX = () => {
  const { connected } = useWeb3.useContainer();
  const { setSelectedVault } = useSelectedVaults.useContainer();

  return (
    <Page>
      <Row>
        <Col style={{ textAlign: "right" }}>
          <Button
            type="secondary"
            onClick={() => setSelectedVault(Vaults.None)}
          >
            Back
          </Button>
        </Col>
      </Row>
      <Row>
        <Col span={6}>
          <img src="./snake.png" width={200} height={200} />
        </Col>
        <Col span={18}>
          <Text h2>SNX-ETH UNI-V2 Farmer</Text>
          <Text p type="secondary">
            This is a DEGEN FARMING VAULT. Yields go back into the farm. Deposit
            your SNX-ETH UNI-V2, earn Degen SNX-ETH UNI-V2.{" "}
            <Link
              color
              href="https://github.com/abstracted-finance/sushi-farm/tree/snx-eth-sushi-lp-farm"
            >
              Read more here.
            </Link>
            {" "}2.5% fee to caller, 2.5% fee to developer.
          </Text>
          <Text p type="error">
            Degen SNX-ETH UNI-V2 automatically farms SUSHI and redistributes
            earnings back into SNX-ETH UNI-V2. Contracts unaudited, enter at
            your own risk.
          </Text>
        </Col>
      </Row>

      {connected && <Dashboard />}
    </Page>
  );
};
