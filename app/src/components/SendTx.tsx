import { Proof } from "circuits";
import { useRecord } from "../hooks/useContract";

function SendTx({
  address,
  publicSignals,
  proof,
}: {
  address: string;
  publicSignals?: [bigint, bigint, bigint];
  proof?: Proof;
}) {
  const { txState, record } = useRecord(address);
  return (
    <div>
      <p>Tx state: {txState}</p>
      <p>{!!publicSignals}</p>
      <p>{!!proof}</p>
      <p>{!!record}</p>
      <button
        disabled={!publicSignals || !proof || !record}
        onClick={() => {
          if (!publicSignals) alert("Public signals are not ready");
          else if (!proof) alert("ZKP is not ready");
          else if (!record) alert("Wallet is not connected");
          else {
            record({
              publicSignals,
              proof,
            });
          }
        }}
      >
        Send zkp transaction
      </button>
    </div>
  );
}

export default SendTx;
