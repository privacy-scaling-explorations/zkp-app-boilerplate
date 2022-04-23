/* eslint-disable node/no-missing-import */
/* eslint-disable camelcase */
import { expect } from "chai";
import { BigNumber } from "ethers";
// eslint-disable-next-line node/no-extraneous-import
import { ZKPClient, EdDSA } from "circuits";
import fs from "fs";
import path from "path";

describe("Test zkp circuit and scripts", function () {
  const privKey =
    "0xABCDEF12ABCDEF12ABCDEF12ABCDEF12ABCDEF12ABCDEF12ABCDEF12ABCDEF12";
  let client: ZKPClient;
  let accounts: [EdDSA, EdDSA, EdDSA];
  beforeEach(async () => {
    const wasm = fs.readFileSync(
      path.join(__dirname, "../../circuits/zk/circuits/main_js/main.wasm")
    );
    const zkey = fs.readFileSync(
      path.join(__dirname, "../../circuits/zk/zkeys/main.zkey")
    );
    client = await new ZKPClient().init(wasm, zkey);
    accounts = await Promise.all([
      new EdDSA("0x1111").init(),
      new EdDSA("0x2222").init(),
      new EdDSA("0x3333").init(),
    ]);
  });
  it("Should able to prove and verify the zkp", async function () {
    const message = BigNumber.from(
      "0xABCDEF00ABCDEF00ABCDEF00ABCDEF00ABCDEF00ABCDEF00ABCDEF00ABCDEF00"
    );
    const signatures = await Promise.all(
      accounts.map((acc) => acc.sign(message))
    );
    const result = await Promise.all(
      accounts.map((acc, i) => acc.verify(message, signatures[i], acc.pubKey))
    );
    result.map((res) => expect(res).to.eq(true));
    const F = accounts[0].babyjub.F;
    const proof = await client.prove({
      M: message.toBigInt(),
      Ax: accounts.map((acc) => acc.scalarPubKey[0]),
      Ay: accounts.map((acc) => acc.scalarPubKey[1]),
      S: signatures.map((sig) => sig.S),
      R8x: signatures.map((sig) => F.toObject(sig.R8[0])),
      R8y: signatures.map((sig) => F.toObject(sig.R8[1])),
    });
    expect(proof).not.to.eq(undefined);
  });
});
