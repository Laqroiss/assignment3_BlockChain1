import { useState } from "react";
import { ethers } from "ethers";

const CreateCampaign = ({ signer, contract }) => {
  const [campaignName, setCampaignName] = useState("");
  const [campaignDescription, setCampaignDescription] = useState(""); 
  const [campaignAmount, setCampaignAmount] = useState(""); 

  const createCampaign = async () => {
    try {
      console.log(`Creating campaign with: ${campaignName} ${campaignDescription} ${campaignAmount}`);

      if (!campaignName || !campaignDescription || !campaignAmount) {
        alert("Please fill all fields.");
        return;
      }

      const amount = parseFloat(campaignAmount);
      if (isNaN(amount) || amount <= 0) {
        alert("Invalid campaign amount. Please enter a valid number.");
        return;
      }

      const amountInEther = ethers.parseEther(amount.toString());
      console.log("Amount in Ether:", amountInEther);

      if (!contract || !signer) {
        console.error("Contract or signer is not initialized");
        return;
      }

      const tx = await contract.createCampaign(
        campaignName,
        campaignDescription,
        amountInEther,
        {
          gasLimit: 500000,
        }
      );
      

      console.log("Transaction sent:", tx);

      const receipt = await tx.wait();
      console.log("Transaction mined:", receipt);

      alert("Campaign created successfully!");
    } catch (error) {
      console.error("Error creating campaign:", error);
      alert("Error creating campaign. Please try again.");
    }
  };

  return (
    <div>
      <h1>Create Campaign</h1>
      <input
        type="text"
        placeholder="Campaign Name"
        value={campaignName}
        onChange={(e) => setCampaignName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Campaign Description"
        value={campaignDescription}
        onChange={(e) => setCampaignDescription(e.target.value)}
      />
      <input
        type="text"
        placeholder="Goal Amount (ETH)"
        value={campaignAmount}
        onChange={(e) => setCampaignAmount(e.target.value)}
      />
      <button onClick={createCampaign}>Create Campaign</button>
    </div>
  );
};

export default CreateCampaign;
