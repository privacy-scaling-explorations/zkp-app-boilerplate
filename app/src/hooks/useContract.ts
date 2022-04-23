import { useMemo, useCallback, useEffect, useState } from "react";
import { useEthers } from "@usedapp/core";
import { ZkApp__factory } from "contracts";
import { BigNumber, BigNumberish } from "ethers";

export const useZKApp = (address: string) => {
  const { account, library, chainId } = useEthers();
  const signer = account ? library?.getSigner(account) : undefined;
  return useMemo(() => {
    if (!library) return undefined;
    const _contract = ZkApp__factory.connect(address, library);
    return signer ? _contract.connect(signer) : _contract;
  }, [library, address, signer, chainId]);
};

/**
 * @dev This fetches data once the react component is rendered
 */
export const useVerifier = (address: string) => {
  const zkApp = useZKApp(address);
  const [verifier, setVerifier] = useState<string>();
  const { library, chainId } = useEthers();

  const fetchVerifierAddress = useCallback(async () => {
    if (!zkApp) return;
    const _verifier = await zkApp.verifier();
    setVerifier(_verifier);
  }, [zkApp]);

  useEffect(() => {
    fetchVerifierAddress();
  }, [address, library, chainId, fetchVerifierAddress]);

  return verifier;
};

/**
 * @dev This fetches data every block when the component is mounted
 */
export const useTotalSignedMessages = (address: string) => {
  const zkApp = useZKApp(address);
  const [totalRecords, setTotalRecords] = useState<BigNumber>();
  const { library, chainId } = useEthers();

  const fetchTotalSignedMessages = useCallback(async () => {
    if (!zkApp) return;
    const _totalRecords = await zkApp.totalSignedMessages();
    setTotalRecords(_totalRecords);
  }, [zkApp]);

  useEffect(() => {
    fetchTotalSignedMessages();
    library?.on("block", fetchTotalSignedMessages);
    return () => {
      library?.off("block", fetchTotalSignedMessages);
    };
  }, [address, library, chainId, fetchTotalSignedMessages]);

  return totalRecords;
};

export enum TxState {
  NONE = "NONE",
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
}

/**
 * @dev Contract interfaction example with ZKP
 */
export const useRecordSignedmessage = (address: string) => {
  const zkApp = useZKApp(address);
  const [txState, setTxState] = useState<TxState>(TxState.NONE);
  const { library, chainId, account } = useEthers();

  const recordSignedMessage = useCallback(
    async ({
      publicSignals,
      proof,
    }: {
      publicSignals: [BigNumberish];
      proof: {
        a: [BigNumberish, BigNumberish];
        b: [[BigNumberish, BigNumberish], [BigNumberish, BigNumberish]];
        c: [BigNumberish, BigNumberish];
      };
    }) => {
      if (!zkApp || !account) return;
      if (!library) return;
      const signer = library.getSigner(account);
      zkApp
        .connect(signer)
        .recordSignedMessage(publicSignals[0], proof)
        .then((tx) => {
          setTxState(TxState.PENDING);
          tx.wait()
            .then(() => setTxState(TxState.CONFIRMED))
            .catch(() => setTxState(TxState.FAILED));
        })
        .catch(() => setTxState(TxState.CANCELLED));
    },
    [library, chainId, account, zkApp]
  );
  return {
    txState,
    recordSignedMessage: account ? recordSignedMessage : undefined,
  };
};

export const useRegisterKey = (address: string) => {
  const zkApp = useZKApp(address);
  const [txState, setTxState] = useState<TxState>(TxState.NONE);
  const { library, chainId, account } = useEthers();

  const registerKey = useCallback(
    async ({ pubKey }: { pubKey: [BigNumberish, BigNumberish] }) => {
      if (!zkApp || !account) return;
      if (!library) return;
      const signer = library.getSigner(account);
      zkApp
        .connect(signer)
        .registerKey(pubKey)
        .then((tx) => {
          setTxState(TxState.PENDING);
          tx.wait()
            .then(() => setTxState(TxState.CONFIRMED))
            .catch(() => setTxState(TxState.FAILED));
        })
        .catch(() => setTxState(TxState.CANCELLED));
    },
    [library, chainId, account, zkApp]
  );
  return { txState, registerKey: account ? registerKey : undefined };
};
