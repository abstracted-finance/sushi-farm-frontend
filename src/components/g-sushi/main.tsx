import { Page, Row, Col, Text, Button, Link } from "@zeit-ui/react";
import { useRouter } from "next/router";

import { Dashboard } from "./dashboard";

import useWeb3 from "../../containers/use-web3";
import {
  default as useSelectedVaults,
  Vaults,
} from "../../containers/use-selected-vaults";

export const GSushi = () => {
  const router = useRouter();
  const { connected } = useWeb3.useContainer();
  const { setSelectedVault } = useSelectedVaults.useContainer();

  return (
    <Page>
      <Row>
        <Col style={{ textAlign: "right" }}>
          <Button
            type="secondary"
            onClick={async () => {
              await router.push("/");
              setSelectedVault(Vaults.None);
            }}
          >
            Back
          </Button>
        </Col>
      </Row>
      <Row>
        <Col span={6}>
          <img src="/sushi-cow.png" width={200} height={200} />
        </Col>
        <Col span={18}>
          <Text h2>Sushi Farmer</Text>
          <Text p type="secondary">
            This is a DEGEN FARMING VAULT. Yields go back into the farm.{" "}
            <Link
              color
              href="https://twitter.com/ka_toos/status/1299961802877366280"
            >
              This is a dumb strategy.
            </Link>{" "}
            Deposit your $SUSHI, earn gSushi (auto grazing SUSHI).{" "}
            <Link color href="https://github.com/abstracted-finance/sushi-farm">
              Read more here.
            </Link>
          </Text>
          <Text p type="error">
            Holding gSushi means being exposed to impermanent loss on Uniswap's
            SUSHI/ETH pool. Contracts unaudited, enter at your own risk.
          </Text>
        </Col>
      </Row>

      {connected && <Dashboard />}
    </Page>
  );
};
