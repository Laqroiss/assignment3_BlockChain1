import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../config";

const useContract = (signer) => {
  const [contract, setContract] = useState(null);

  useEffect(() => {
    if (signer) {
      const crowdfundingContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      setContract(crowdfundingContract);
    }
  }, [signer]);

  return contract;
};

export default useContract;
