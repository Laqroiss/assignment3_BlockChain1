import { useState } from "react";
import { ethers } from "ethers";

const ConnectWallet = ({ setSigner }) => {
  const [walletAddress, setWalletAddress] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);

        // const network = await provider.getNetwork();
        // console.log("Connected to network:", network);

        // if (network.chainId === 31337) {
        //   console.log("ENS resolution skipped on local network (chainId: 1337).");
        // } else {
        //   try {
        //     const ensAddress = await provider.resolveName("example.eth");
        //     console.log("Resolved ENS address:", ensAddress);
        //   } catch (ensError) {
        //     console.log("ENS resolution failed:", ensError);
        //   }
        // }

        const signer = await provider.getSigner();
        console.log(signer);
        setSigner(signer);
        const address = await signer.getAddress();
        setWalletAddress(address);

        console.log("Wallet connected:", address);
      } catch (error) {
        console.error("Wallet connection failed:", error);
      }
    } else {
      alert("Please install MetaMask.");
    }
  };

  return (
    <div>
      {walletAddress ? (
        <p>Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</p>
      ) : (
        <button onClick={connectWallet} className="px-4 py-2 bg-blue-600 text-white rounded">
          Connect Wallet
        </button>
      )}
    </div>
  );
};

export default ConnectWallet;
