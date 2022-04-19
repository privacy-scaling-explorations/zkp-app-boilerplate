import { Verifier__factory, ZkApp__factory } from "contracts";
import { useEthers, useLocalStorage } from "@usedapp/core";
import { solidityKeccak256 } from "ethers/lib/utils";
import { useEffect } from "react";

export const contractKey = (chainId?: number) =>
  `zkp-app-boilerplate:${solidityKeccak256(
    ["bytes", "bytes"],
    [ZkApp__factory.bytecode, Verifier__factory.bytecode]
  )}:${chainId}`;

function Deploy({ onResult }: { onResult: (deployed: string) => void }) {
  const { library, chainId } = useEthers();

  const [deployed, storeDeployed] = useLocalStorage(contractKey(chainId));
  useEffect(() => {
    if (deployed) onResult(deployed);
  }, [deployed]);
  return (
    <div>
      {deployed ? (
        `Deployed: ${deployed}`
      ) : (
        <button
          disabled={!library}
          onClick={async () => {
            if (!library) throw Error("not connected");
            const signer = library.getSigner();
            new Verifier__factory(signer)
              .deploy()
              .then((verifier) =>
                new ZkApp__factory(signer)
                  .deploy(verifier.address)
                  .then((zkApp) =>
                    zkApp.deployed().then(() => storeDeployed(zkApp.address))
                  )
              );
          }}
        >
          Deploy
        </button>
      )}
    </div>
  );
}

export default Deploy;
