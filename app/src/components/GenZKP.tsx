import { Proof } from "circuits";
import { EdDSASignature } from "circuits/src/eddsa";
import useCircuit from "../hooks/useCircuit";

function GenZKP({
  signatures,
  message,
  pubKeys,
  onResult,
}: {
  message: bigint;
  pubKeys?: [bigint, bigint][];
  signatures?: EdDSASignature[];
  onResult: (proof: Proof) => void;
}) {
  const { client } = useCircuit();
  return (
    <div>
      <button
        disabled={!client || !pubKeys || !signatures}
        onClick={async () => {
          if (!client) alert("Client is not ready");
          else if (!pubKeys) alert("EdDSA pubkey is not ready");
          else if (!signatures) alert("EdDSA signature is not ready");
          else {
            client
              .prove({
                M: message,
                Ax: pubKeys.map((key) => key[0]),
                Ay: pubKeys.map((key) => key[1]),
                S: signatures.map((s) => s.S),
                R8x: signatures.map((signature) =>
                  client.babyjub.F.toObject(signature.R8[0])
                ),
                R8y: signatures.map((signature) =>
                  client.babyjub.F.toObject(signature.R8[1])
                ),
              })
              .then(onResult);
          }
        }}
      >
        Create zkp
      </button>
    </div>
  );
}

export default GenZKP;
