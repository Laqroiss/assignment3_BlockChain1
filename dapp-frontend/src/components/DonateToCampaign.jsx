import { useState } from "react";

const DonateToCampaign = ({ contract }) => {
  const [campaignId, setCampaignId] = useState("");
  const [donationAmount, setDonationAmount] = useState("");

  const donate = async () => {
    if (!contract) return;

    try {
      const tx = await contract.donateToCampaign(campaignId, {
        value: ethers.utils.parseEther(donationAmount),
      });
      await tx.wait();
      alert("Donation successful!");
    } catch (error) {
      console.error("Error donating:", error);
      alert("Failed to donate.");
    }
  };

  return (
    <div>
      <h2>Donate to Campaign</h2>
      <input
        type="number"
        placeholder="Campaign ID"
        value={campaignId}
        onChange={(e) => setCampaignId(e.target.value)}
        className="mt-2 p-2 border border-gray-400 rounded"
      />
      <input
        type="number"
        placeholder="Amount (ETH)"
        value={donationAmount}
        onChange={(e) => setDonationAmount(e.target.value)}
        className="mt-2 p-2 border border-gray-400 rounded"
      />
      <button
        onClick={donate}
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
      >
        Donate
      </button>
    </div>
  );
};

export default DonateToCampaign;
