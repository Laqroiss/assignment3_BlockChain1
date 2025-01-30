// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Crowdfunding {
    struct Campaign {
        address owner;
        string title;
        string description;
        uint goal;
        uint amountCollected;
        bool completed;
    }

    mapping(uint => Campaign) public campaigns;
    uint public campaignCount;

    event CampaignCreated(uint id, address owner, string title, uint goal);
    event DonationReceived(uint id, address donor, uint amount);

    modifier onlyOwner(uint _id) {
        require(msg.sender == campaigns[_id].owner, "Not campaign owner");
        _;
    }

    function createCampaign(string memory _title, string memory _description, uint _goal) public {
        require(_goal > 0, "Goal must be greater than zero");

        campaigns[campaignCount] = Campaign(msg.sender, _title, _description, _goal, 0, false);
        emit CampaignCreated(campaignCount, msg.sender, _title, _goal);
        campaignCount++;
    }

    function donateToCampaign(uint _id) public payable {
        require(msg.value > 0, "Donation must be greater than zero");
        require(_id < campaignCount, "Invalid campaign ID");

        Campaign storage campaign = campaigns[_id];
        campaign.amountCollected += msg.value;

        emit DonationReceived(_id, msg.sender, msg.value);
    }

    function withdrawFunds(uint _id) public onlyOwner(_id) {
        Campaign storage campaign = campaigns[_id];
        require(campaign.amountCollected >= campaign.goal, "Goal not reached");
        require(!campaign.completed, "Already withdrawn");

        campaign.completed = true;
        payable(campaign.owner).transfer(campaign.amountCollected);
    }

    function getCampaign(uint _id) public view returns (Campaign memory) {
        require(_id < campaignCount, "Invalid campaign ID");
        return campaigns[_id];
    }
}
