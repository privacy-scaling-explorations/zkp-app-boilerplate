pragma circom 2.0.0;
include "../../node_modules/circomlib/circuits/eddsaposeidon.circom";

template Sample(n) {
    // public
    signal input M;
    signal input Ax[n];
    signal input Ay[n];
    // private
    signal input S[n];
    signal input R8x[n];
    signal input R8y[n];


    component verifier[n];
    for (var i = 0; i < n; i++) {
        verifier[i] = EdDSAPoseidonVerifier();
        verifier[i].enabled <== 1;
        verifier[i].Ax <== Ax[i];
        verifier[i].Ay <== Ay[i];
        verifier[i].S <== S[i];
        verifier[i].R8x <== R8x[i];
        verifier[i].R8y <== R8y[i];
        verifier[i].M <== M;
    }
    
}

component main { public [M, Ax, Ay] } = Sample(3);
