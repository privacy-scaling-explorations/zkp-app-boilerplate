//SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity >=0.8.0;

// Please note that you should adjust the length of the inputs
interface IVerifier {
    function verifyProof(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[7] memory input
    ) external view returns (bool r);
}

contract ZkApp {
    struct Proof {
        uint256[2] a;
        uint256[2][2] b;
        uint256[2] c;
    }

    address public immutable verifier;
    uint256[2][] public pubKeys;
    uint256[] public signedMessages;

    constructor(address verifier_) {
        verifier = verifier_;
    }

    function registerKey(uint256[2] memory key) public {
        require(pubKeys.length < 3, "Multisig for 3");
        pubKeys.push(key);
    }

    /**
     * @dev This is the sample function
     */
    function recordSignedMessage(uint256 message, Proof memory proof)
        public
    {
        require(pubKeys.length == 3, "Key registration is not done yet.");
        uint256[7] memory publicSignals;
        publicSignals[0] = message;
        publicSignals[1] = pubKeys[0][0];
        publicSignals[2] = pubKeys[1][0];
        publicSignals[3] = pubKeys[2][0];
        publicSignals[4] = pubKeys[0][1];
        publicSignals[5] = pubKeys[1][1];
        publicSignals[6] = pubKeys[2][1];
        require(verify(publicSignals, proof), "SNARK verification failed");
        signedMessages.push(message);
    }

    /**
     * Please adjust the IVerifier.sol and the array length of publicSignals
     */
    function verify(uint256[7] memory publicSignals, Proof memory proof)
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

    function totalSignedMessages() public view returns (uint256) {
        return signedMessages.length;
    }
}
