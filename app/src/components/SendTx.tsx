import { Proof } from "circuits";
import { useRecordSignedmessage } from "../hooks/useContract";

function SendTx({
  address,
  publicSignals,
  proof,
}: {
  address: string;
  publicSignals?: [bigint];
  proof?: Proof;
}) {
  const { txState, recordSignedMessage } = useRecordSignedmessage(address);
  return (
    <div>
      <p>Tx state: {txState}</p>
      <p>{!!publicSignals}</p>
      <p>{!!proof}</p>
      <p>{!!recordSignedMessage}</p>
      <button
        disabled={!publicSignals || !proof || !recordSignedMessage}
        onClick={() => {
          if (!publicSignals) alert("Public signals are not ready");
          else if (!proof) alert("ZKP is not ready");
          else if (!recordSignedMessage) alert("Wallet is not connected");
          else {
            recordSignedMessage({
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
