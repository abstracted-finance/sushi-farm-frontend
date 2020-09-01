import { createContainer } from "unstated-next";
import { useState } from "react";
export enum Vaults {
  None,
  GSushi,
  DSNX,
}

function useSelectedVaults() {
  const [selectedVault, setSelectedVault] = useState<Vaults>(Vaults.None);

  return {
    selectedVault,
    setSelectedVault,
  };
}

export default createContainer(useSelectedVaults);
