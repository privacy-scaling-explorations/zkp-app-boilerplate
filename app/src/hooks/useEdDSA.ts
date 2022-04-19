import { useEffect, useState } from "react";
import { EdDSA } from "circuits";

// Enter a valid infura key here to avoid being rate limited
// You can get a key for free at https://infura.io/register

let cache: EdDSA | undefined;

function useEdDSA(privKey?: string): {
  eddsa?: EdDSA;
  pubKey?: [bigint, bigint]
} {
  const [eddsa, setEdDSA] = useState<EdDSA>();

  useEffect(() => {
    if (!cache && !!privKey) {
      new EdDSA(privKey).init().then((_eddsa) => {
        if (!cache) {
          cache = _eddsa;
        }
        setEdDSA(_eddsa);
      });
    } else {
      setEdDSA(cache);
    }
  }, [privKey]);

  return { eddsa, pubKey: eddsa?.scalarPubKey };
}

export default useEdDSA;
