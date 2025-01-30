import { useState } from "react";

const CreateCampaign = ({ contract }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState("");

  const createCampaign = async () => {
    if (!contract) return;
  
    try {
      // Check parameters before sending to contract
      console.log("Creating campaign with:", title, description, goal);
  
      // Ensure the goal is parsed correctly to Wei
      const parsedGoal = ethers.utils.parseEther(goal);
      console.log("Parsed goal:", parsedGoal);
  
      // Calling the contract
      const tx = await contract.createCampaign(title, description, parsedGoal);
      await tx.wait();
      alert("Campaign created successfully!");
    } catch (error) {
      console.error("Error creating campaign:", error);
      alert("Failed to create campaign.");
    }
  };
  

  return (
    <div>
      <h2>Create New Campaign</h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="mt-2 p-2 border border-gray-400 rounded"
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="mt-2 p-2 border border-gray-400 rounded"
      />
      <input
        type="number"
        placeholder="Goal (ETH)"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        className="mt-2 p-2 border border-gray-400 rounded"
      />
      <button
        onClick={createCampaign}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Create Campaign
      </button>
    </div>
  );
};

export default CreateCampaign;
