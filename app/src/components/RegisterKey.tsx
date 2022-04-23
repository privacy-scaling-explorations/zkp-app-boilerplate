import { useRegisterKey } from "../hooks/useContract";

function RegisterKey({
  address,
  pubKey,
}: {
  address: string;
  pubKey?: [bigint, bigint];
}) {
  const { txState, registerKey } = useRegisterKey(address);
  return (
    <div>
      <p>Tx state: {txState}</p>
      <button
        disabled={!registerKey || !pubKey}
        onClick={() => {
          if (!pubKey) alert("Pub key is not prepared");
          else if (!registerKey) alert("Wallet is not connected");
          else {
            registerKey({
              pubKey,
            });
          }
        }}
      >
        Register pubkey {pubKey}
      </button>
    </div>
  );
}

export default RegisterKey;
