import { Main } from "../../components/main";

import {
  default as useSelectedVaults,
  Vaults,
} from "../../containers/use-selected-vaults";

const Index = () => {
  const { selectedVault, setSelectedVault } = useSelectedVaults.useContainer();
  setSelectedVault(Vaults.DSNX);

  return <Main />;
};

export default Index;
