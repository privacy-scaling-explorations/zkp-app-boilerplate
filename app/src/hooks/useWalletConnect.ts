import { useCallback } from "react";
import { ChainId, useEthers } from "@usedapp/core";
import WalletConnectProvider from "@walletconnect/web3-provider";

export const useWalletConnect = () => {
  const { activate } = useEthers();
  const activateWalletConnect = useCallback(async () => {
    const provider = new WalletConnectProvider({
      rpc: {
        [ChainId.Hardhat]: "http://localhost:8545",
      },
      qrcode: true,
    });
    try {
      const _wc = await provider.enable();
      console.log("enabled", _wc);
      await activate(provider);
    } catch (e) {
      console.log("Couldn't connect to the walletconnect connector");
      console.error(e);
    }
  }, [activate]);
  return { activateWalletConnect };
};
