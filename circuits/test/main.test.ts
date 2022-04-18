/* eslint-disable node/no-missing-import */
/* eslint-disable camelcase */
import { expect } from "chai";
import { BigNumber } from "ethers";
// eslint-disable-next-line node/no-extraneous-import
import { ZKPClient, EdDSA } from "circuits";

describe("Test zkp circuit and scripts", function () {
  const privKey =
    "0xABCDEF12ABCDEF12ABCDEF12ABCDEF12ABCDEF12ABCDEF12ABCDEF12ABCDEF12";
  let client: ZKPClient;
  let eddsa: EdDSA;
  beforeEach(async () => {
    client = await new ZKPClient().init();
    eddsa = await new EdDSA(privKey).init();
  });
  it("Should able to prove and verify the zkp", async function () {
    const message = BigNumber.from(
      "0xABCDEF00ABCDEF00ABCDEF00ABCDEF00ABCDEF00ABCDEF00ABCDEF00ABCDEF00"
    );
    const signature = await eddsa.sign(message);
    expect(await eddsa.verify(message, signature, eddsa.pubKey)).to.eq(true);
    const proof = await client.prove({
      M: message.toBigInt(),
      Ax: eddsa.scalarPubKey[0],
      Ay: eddsa.scalarPubKey[1],
      S: signature.S,
      R8x: eddsa.babyjub.F.toObject(signature.R8[0]),
      R8y: eddsa.babyjub.F.toObject(signature.R8[1]),
    });
    expect(proof).not.to.eq(undefined);
  });
});
