//SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity >=0.8.0;

// Please note that you should adjust the length of the inputs
import {IVerifier} from "./interfaces/IVerifier.sol";

contract ZkApp {
    struct Proof {
        uint256[2] a;
        uint256[2][2] b;
        uint256[2] c;
    }

    address public immutable verifier;

    constructor(address verifier_) {
        verifier = verifier_;
    }

    /**
     * Please adjust the IVerifier.sol and
     */
    function verify(uint256[3] memory publicSignals, Proof memory proof)
        public
        view
        returns (bool)
    {
        bool result = IVerifier(verifier).verifyProof(
            proof.a,
            proof.b,
            proof.c,
            publicSignals
        );
        return result;
    }
}
