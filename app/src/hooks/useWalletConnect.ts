import React, { useCallback } from "react";
import { useEthers } from "@usedapp/core";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { providers } from "ethers";
import { getEnvironmentVariable } from "../utils/env";
import { getEnvironmentData } from "worker_threads";

export const useWalletConnect = () => {
    const { library, activate } = useEthers();
    const activateWalletConnect = useCallback(async () => {
        const mainnetRPC = getEnvironmentData('REACT_MAINNET_RPC');
        const goerliRPC = getEnvironmentData('REACT_GOERLI_RPC')
        if (typeof mainnetRPC !== 'string') throw Error('Configure an env var for the mainnet rpc')
        if (typeof goerliRPC !== 'string') throw Error('Configure an env var for the goerli rpc')
        const provider = new WalletConnectProvider({
            rpc: {
                1: mainnetRPC
        5: goerliRPC
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
    }, []);
    const wcMessage = useCallback(
        (msg: string) => {
            const isWalletConnectProvider = library
                ? (library as any).provider instanceof WalletConnectProvider
                : false;
            if (isWalletConnectProvider) {
                return window.confirm(msg);
            } else {
                return true;
            }
        },
        [library]
    );
    return { activateWalletConnect, wcMessage };
};
