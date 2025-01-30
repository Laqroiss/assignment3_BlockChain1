import { useState } from "react";
import ConnectWallet from "./components/ConnectWallet";
import useContract from "./hooks/useContract";
import CreateCampaign from "./components/CreateCampaign";
import DonateToCampaign from "./components/DonateToCampaign";

function App() {
  const [signer, setSigner] = useState(null);
  const contract = useContract(signer);

  return (
    <div className="p-5">
      <ConnectWallet setSigner={setSigner} />
      
      {contract && (
        <>
          <CreateCampaign contract={contract} />
          <DonateToCampaign contract={contract} />
        </>
      )}
    </div>
  );
}

export default App;
