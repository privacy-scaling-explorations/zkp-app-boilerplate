import { Proof } from "circuits";
import { EdDSASignature } from "circuits/src/eddsa";
import useCircuit from "../hooks/useCircuit";

function GenZKP({
  signature,
  message,
  pubKey,
  onResult,
}: {
  message: bigint;
  pubKey?: [bigint, bigint];
  signature?: EdDSASignature;
  onResult: (proof: Proof) => void;
}) {
  const { client } = useCircuit();
  return (
    <div>
      <button
        disabled={!client || !pubKey || !signature}
        onClick={async () => {
          if (!client) alert("Client is not ready");
          else if (!pubKey) alert("EdDSA pubkey is not ready");
          else if (!signature) alert("EdDSA signature is not ready");
          else {
            client
              .prove({
                M: message,
                Ax: pubKey[0],
                Ay: pubKey[1],
                S: signature.S,
                R8x: client.babyjub.F.toObject(signature.R8[0]),
                R8y: client.babyjub.F.toObject(signature.R8[1]),
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
