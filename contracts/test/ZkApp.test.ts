import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import {
  Verifier,
  Verifier__factory,
  ZkApp,
  ZkApp__factory,
} from "../typechain";
import { ZKPClient, EdDSA } from "circuits";
import { BigNumber } from "ethers";
import fs from "fs";
import path from "path";

describe("Test ZKP contract", function () {
  let verifier: Verifier;
  let zkApp: ZkApp;
  let deployer: SignerWithAddress;
  let client: ZKPClient;
  let accounts: [EdDSA, EdDSA, EdDSA];
  this.beforeEach(async () => {
    [deployer] = await ethers.getSigners();
    verifier = await new Verifier__factory(deployer).deploy();
    accounts = await Promise.all([
      new EdDSA("0x1111").init(),
      new EdDSA("0x2222").init(),
      new EdDSA("0x3333").init(),
    ]);
    zkApp = await new ZkApp__factory(deployer).deploy(verifier.address);
    client = await new ZKPClient().init(
      fs.readFileSync(
        path.join(__dirname, "../../circuits/zk/circuits/main_js/main.wasm")
      ),
      fs.readFileSync(path.join(__dirname, "../../circuits/zk/zkeys/main.zkey"))
    );
  });
  it("Should able to create a zkp and verify them", async function () {
    const message = BigNumber.from("0xabcd");
    const signatures = await Promise.all(
      accounts.map((acc) => acc.sign(message))
    );
    const F = accounts[0].babyjub.F;
    const proof = await client.prove({
      M: message.toBigInt(),
      Ax: accounts.map((acc) => acc.scalarPubKey[0]),
      Ay: accounts.map((acc) => acc.scalarPubKey[1]),
      S: signatures.map((sig) => sig.S),
      R8x: signatures.map((sig) => F.toObject(sig.R8[0])),
      R8y: signatures.map((sig) => F.toObject(sig.R8[1])),
    });
    await zkApp.registerKey(accounts[0].scalarPubKey);
    await zkApp.registerKey(accounts[1].scalarPubKey);
    await zkApp.registerKey(accounts[2].scalarPubKey);
    expect(await zkApp.totalSignedMessages()).to.eq(0);
    await zkApp.recordSignedMessage(message, proof);
    expect(await zkApp.totalSignedMessages()).to.eq(1);
  });
});
