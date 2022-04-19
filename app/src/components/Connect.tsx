import { useEthers } from "@usedapp/core";
import { hexlify } from "ethers/lib/utils";
import { useEffect } from "react";
import { useWalletConnect } from "../hooks/useWalletConnect";

const switchNetwork = async (chainId: number) => {
  const { ethereum } = window as any;
  if (!ethereum) return;
  try {
    const result = await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: hexlify(chainId).replace("0x0", "0x") }],
    });
    console.log("result", result);
  } catch (switchError) {
    console.error(switchError);
  }
};
function Connect() {
  const { activateBrowserWallet, deactivate, chainId } = useEthers();
  const { activateWalletConnect } = useWalletConnect();
  return (
    <div>
      Chain ID: {chainId}<br/>
      {chainId ? (
        <>
          <button onClick={() => switchNetwork(4)}>Rinkeby</button>
          <button onClick={() => switchNetwork(5)}>Goerli</button>
          <button onClick={() => alert('Select localhost using metamask')}>Localhost</button>
          <br />
          <button onClick={deactivate}>
            Disconnect(works only for walletconnect)
          </button>
        </>
      ) : (
        <>
          <button onClick={activateBrowserWallet}>Connect metamask</button>
          <button onClick={activateWalletConnect}>Connect walletconnect</button>
        </>
      )}
      <br />
    </div>
  );
}

export default Connect;
