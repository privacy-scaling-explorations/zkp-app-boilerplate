import { EdDSASignature } from "circuits/src/eddsa";
import useEdDSA from "../hooks/useEdDSA";
import { BigNumberish } from "ethers";

function SignEdDSA({
  privKey,
  message,
  onResult,
}: {
  message: BigNumberish;
  privKey?: string;
  onResult: (signature: EdDSASignature) => void;
}) {
  const { eddsa } = useEdDSA(privKey);
  return (
    <div>
      <button
        disabled={!eddsa}
        onClick={async () => {
          if (!eddsa) alert("EdDSA is not set");
          else {
            eddsa.sign(message).then(onResult);
          }
        }}
      >
        Create EdDSA sig
      </button>
    </div>
  );
}

export default SignEdDSA;
