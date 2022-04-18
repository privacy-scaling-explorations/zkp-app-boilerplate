pragma circom 2.0.0;
include "../../node_modules/circomlib/circuits/eddsaposeidon.circom";

template Sample() {
    // public
    signal input M;
    signal input Ax;
    signal input Ay;
    // private
    signal input S;
    signal input R8x;
    signal input R8y;

    component verifier = EdDSAPoseidonVerifier();

    verifier.enabled <== 1;
    verifier.Ax <== Ax;
    verifier.Ay <== Ay;
    verifier.S <== S;
    verifier.R8x <== R8x;
    verifier.R8y <== R8y;
    verifier.M <== M;
}

component main { public [M, Ax, Ay] } = Sample();
