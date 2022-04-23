import { Proof } from "circuits";
import { EdDSASignature } from "circuits/src/eddsa";
import { BigNumber } from "ethers";
import { useState } from "react";
import "./App.css";
import Connect from "./components/Connect";
import GenZKP from "./components/GenZKP";
import SendTx from "./components/SendTx";
import SignEdDSA from "./components/SignEdDSA";
import Viewer from "./components/Viewer";
import useEdDSA from "./hooks/useEdDSA";
import Deploy from "./components/Deploy";
import RegisterKey from "./components/RegisterKey";

// const address = process.env["REACT_APP_CONTRACT_ADDRESS"] as string;
// if (typeof address !== "string") throw Error("Configure contract address");
const msgToSign = BigNumber.from("0x1234").toBigInt();

function App() {
  const privKeys = ["0x1111", "0x2222", "0x3333"];
  const { pubKey: key1 } = useEdDSA(privKeys[0]);
  const { pubKey: key2 } = useEdDSA(privKeys[1]);
  const { pubKey: key3 } = useEdDSA(privKeys[2]);
  const pubKeys = !!key1 && !!key2 && !!key3 ? [key1, key2, key3] : undefined;
  const [eddsaSignature1, setEdDSASignature1] = useState<EdDSASignature>();
  const [eddsaSignature2, setEdDSASignature2] = useState<EdDSASignature>();
  const [eddsaSignature3, setEdDSASignature3] = useState<EdDSASignature>();
  const eddsaSignatures =
    !!eddsaSignature1 && !!eddsaSignature2 && !!eddsaSignature3
      ? [eddsaSignature1, eddsaSignature2, eddsaSignature3]
      : undefined;
  const [proof, setProof] = useState<Proof>();
  const [deployed, setDeployed] = useState<string>();
  return (
    <div className="App">
      <h1>ZKP App Boilerplate</h1>
      <h2>Step 1. Connect your wallet</h2>
      <Connect />
      <h2>Step 2. Deploy smart contracts</h2>
      <Deploy onResult={setDeployed} />
      <h2>Step 3. Check the data fetch from the smart contract</h2>
      {deployed ? <Viewer address={deployed} /> : <p>Not deployed</p>}
      <h2>Step 4. Register EdDSA keys</h2>
      {deployed ? (
        <>
          <RegisterKey address={deployed} pubKey={key1} />
          <RegisterKey address={deployed} pubKey={key2} />
          <RegisterKey address={deployed} pubKey={key3} />
        </>
      ) : (
        <p>Not deployed</p>
      )}
      <h2>Step 5. Prepare EdDSA signatures</h2>
      <SignEdDSA
        privKey={privKeys[0]}
        message={msgToSign}
        onResult={(result) => setEdDSASignature1(result)}
      />
      <p>{eddsaSignature1 ? 'signed': 'None'}</p>
      <SignEdDSA
        privKey={privKeys[1]}
        message={msgToSign}
        onResult={(result) => setEdDSASignature2(result)}
      />
      <p>{eddsaSignature2 ? 'signed': 'None'}</p>
      <SignEdDSA
        privKey={privKeys[2]}
        message={msgToSign}
        onResult={(result) => setEdDSASignature3(result)}
      />
      <p>{eddsaSignature3 ? 'signed': 'None'}</p>
      <h2>Step 6. Compute a zk proof</h2>
      <GenZKP
        message={msgToSign}
        pubKeys={pubKeys}
        signatures={eddsaSignatures}
        onResult={(result) => setProof(result)}
      />
      <h2>Step 7. Interact with smart contract using the generated proof</h2>
      {deployed ? (
        <SendTx address={deployed} publicSignals={[msgToSign]} proof={proof} />
      ) : (
        <p>Not deployed</p>
      )}
    </div>
  );
}

export default App;
