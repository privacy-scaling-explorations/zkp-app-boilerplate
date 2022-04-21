import { Verifier__factory, ZkApp__factory } from "contracts";
import { useEthers, useLocalStorage } from "@usedapp/core";
import { BytesLike, solidityKeccak256 } from "ethers/lib/utils";
import { useEffect } from "react";

export const key = (bytecode: BytesLike, chainId?: number) =>
  `${solidityKeccak256(["bytes"], [bytecode])}:${chainId}`;

function Deploy({ onResult }: { onResult: (deployed: string) => void }) {
  const { library, chainId } = useEthers();

  const [zkApp, storeZkApp] = useLocalStorage(
    key(ZkApp__factory.bytecode, chainId)
  );
  const [verifier, storeVerifier] = useLocalStorage(
    key(Verifier__factory.bytecode, chainId)
  );

  useEffect(() => {
    if (zkApp) onResult(zkApp);
  }, [zkApp]);

  return (
    <div>
      {verifier ? (
        `Verifier: ${verifier}`
      ) : (
        <button
          disabled={!library}
          onClick={async () => {
            if (!library) throw Error("not connected");
            const signer = library.getSigner();
            new Verifier__factory(signer)
              .deploy()
              .then((verifier) => storeVerifier(verifier.address));
          }}
        >
          Deploy verifier
        </button>
      )}
      <br/>
      {zkApp ? (
        `Deployed: ${zkApp}`
      ) : (
        <button
          disabled={!library || !verifier}
          onClick={async () => {
            if (!library) throw Error("not connected");
            console.log('verifier', verifier)
            const signer = library.getSigner();
            new ZkApp__factory(signer)
              .deploy(verifier)
              .then((zkApp) =>
                zkApp.deployed().then(() => storeZkApp(zkApp.address))
              );
          }}
        >
          Deploy zk app contract
        </button>
      )}
    </div>
  );
}

export default Deploy;
