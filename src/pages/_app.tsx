import Head from "next/head";
import { AppProps } from "next/app";
import { useState, useEffect } from "react";
import { CssBaseline, ZeitProvider, useTheme } from "@zeit-ui/react";

import Web3Container from "../containers/use-web3";
import ContractsContainer from "../containers/use-contracts";
import SushiTokenContainer from "../containers/use-sushi-token";
import GrazingSushiTokenContainer from "../containers/use-grazing-sushi-token";
import SushiFarmContainer from "../containers/use-sushi-farm";

function App({ Component, pageProps }: AppProps) {
  const theme = useTheme();
  const [customTheme, setCustomTheme] = useState(theme);
  const themeChangeHandler = (theme) => {
    setCustomTheme(theme);
  };

  useEffect(() => {
    const theme = window.localStorage.getItem("theme");
    if (theme !== "dark") return;
    themeChangeHandler({ type: "dark" });
  }, []);

  // Cleans DOM
  useEffect(() => {
    document.documentElement.removeAttribute("style");
    document.body.removeAttribute("style");
  }, []);

  return (
    <ZeitProvider theme={customTheme}>
      <CssBaseline>
        <Web3Container.Provider>
          <ContractsContainer.Provider>
            <SushiTokenContainer.Provider>
              <GrazingSushiTokenContainer.Provider>
                <SushiFarmContainer.Provider>
                  <Head>
                    <title>Sushi Farm</title>
                    <meta
                      name="description"
                      content="Automate the farming of your $SUSHI. Get gSushi, next generation $SUSHI"
                    />
                    <link rel="shortcut icon" href="/favicon.ico" />
                    <meta
                      name="viewport"
                      content="width=device-width, initial-scale=1.0"
                    />
                  </Head>

                  <Component {...pageProps} />
                </SushiFarmContainer.Provider>
              </GrazingSushiTokenContainer.Provider>
            </SushiTokenContainer.Provider>
          </ContractsContainer.Provider>
        </Web3Container.Provider>
      </CssBaseline>
    </ZeitProvider>
  );
}

export default App;
