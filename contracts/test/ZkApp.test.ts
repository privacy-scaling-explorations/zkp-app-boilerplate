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
  let eddsa: EdDSA;
  this.beforeEach(async () => {
    [deployer] = await ethers.getSigners();
    verifier = await new Verifier__factory(deployer).deploy();
    eddsa = await new EdDSA(
      "0xABCDABCDABCDABCDABCDABCDABCDABCDABCDABCDABCDABCDABCDABCDABCD"
    ).init();
    zkApp = await new ZkApp__factory(deployer).deploy(verifier.address);
    client = await new ZKPClient().init(
      fs.readFileSync(
        path.join(__dirname, "../../circuits/zk/circuits/main_js/main.wasm")
      ),
      fs.readFileSync(path.join(__dirname, "../../circuits/zk/zkeys/main.zkey"))
    );
  });
  it("Should able to create a zkp and verify them", async function () {
    const msg = BigNumber.from("0xabcd");
    const signature = await eddsa.sign(msg);
    const proof = await client.prove({
      M: msg.toBigInt(),
      Ax: eddsa.scalarPubKey[0],
      Ay: eddsa.scalarPubKey[1],
      S: signature.S,
      R8x: eddsa.babyjub.F.toObject(signature.R8[0]),
      R8y: eddsa.babyjub.F.toObject(signature.R8[1]),
    });
    expect(
      await zkApp.verify(
        [msg, eddsa.scalarPubKey[0], eddsa.scalarPubKey[1]],
        proof
      )
    ).to.eq(true);
  });
});
