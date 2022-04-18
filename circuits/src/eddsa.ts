import { buildEddsa, buildBabyjub } from "circomlibjs";
import { arrayify } from "ethers/lib/utils";
import { BigNumber, BigNumberish } from "ethers";

export interface EdDSASignature {
  R8: [Uint8Array, Uint8Array];
  S: bigint;
}

export class EdDSA {
  private _eddsa: any;
  private _babyjub: any;
  private _prvKey?: Uint8Array;
  private _pubKey?: [Uint8Array, Uint8Array];

  get initialized() {
    return (
      this._eddsa !== undefined &&
      this._babyjub !== undefined &&
      this._prvKey !== undefined &&
      this._pubKey !== undefined
    );
  }

  get pubKey(): [Uint8Array, Uint8Array] {
    if (!this._pubKey) throw Error("Not initialized");
    return this._pubKey;
  }

  get babyjub(): any {
    if (!this._babyjub) throw Error("Not initialized");
    return this._babyjub;
  }

  get scalarPubKey(): [bigint, bigint] {
    if (!this._pubKey) throw Error("Not initialized");
    return [
      this._babyjub.F.toObject(this._pubKey[0]),
      this._babyjub.F.toObject(this._pubKey[1]),
    ];
  }

  constructor(privKey: string) {
    this._prvKey = arrayify(privKey);
  }

  async init() {
    if (this.initialized) return this;
    this._eddsa = await buildEddsa();
    this._babyjub = await buildBabyjub();
    this._pubKey = await this._eddsa.prv2pub(this._prvKey);
    return this;
  }

  async sign(message: BigNumberish): Promise<EdDSASignature> {
    const m = this._babyjub.F.e(BigNumber.from(message).toString());
    const signature = this._eddsa.signPoseidon(this._prvKey, m);
    if (!this.verify(m, signature, this.pubKey))
      throw Error("generated invalid eddsa signature");
    return signature;
  }

  async verify(
    message: BigNumberish,
    signature: EdDSASignature,
    pubKey: [Uint8Array, Uint8Array]
  ) {
    const m = this._babyjub.F.e(BigNumber.from(message).toString());
    return this._eddsa.verifyPoseidon(m, signature, pubKey);
  }
}
