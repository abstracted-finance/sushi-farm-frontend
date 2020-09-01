import { Main } from "../../components/main";

import {
  default as useSelectedVaults,
  Vaults,
} from "../../containers/use-selected-vaults";

const Index = () => {
  const { setSelectedVault } = useSelectedVaults.useContainer();
  setSelectedVault(Vaults.GSushi);

  return <Main />;
};

export default Index;
