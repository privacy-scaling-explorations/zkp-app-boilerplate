import { useEffect, useState } from "react";
import { ZKPClient } from "circuits";

let cache: ZKPClient | undefined;

function useCircuit(): {
  client?: ZKPClient;
} {
  const [client, setClient] = useState<ZKPClient>();

  useEffect(() => {
    if (!cache) {
      Promise.all([
        fetch(`${process.env.PUBLIC_URL}/main.wasm`).then((res) =>
          res.arrayBuffer()
        ),
        fetch(`${process.env.PUBLIC_URL}/main.zkey`).then((res) =>
          res.arrayBuffer()
        ),
      ]).then(([wasm, zkey]) => {
        new ZKPClient()
          .init(Buffer.from(wasm), Buffer.from(zkey))
          .then((_client) => {
            if (!cache) {
              cache = _client;
            }
            setClient(_client);
          });
      });
    } else {
      setClient(cache);
    }
  }, []);

  return { client };
}

export default useCircuit;
