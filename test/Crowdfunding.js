const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Crowdfunding", function () {
    let Crowdfunding, crowdfunding, owner, donor, otherUser;

    beforeEach(async function () {
        [owner, donor, otherUser] = await ethers.getSigners();
        Crowdfunding = await ethers.getContractFactory("Crowdfunding");
        crowdfunding = await Crowdfunding.deploy();
    });
    

    it("should create a campaign correctly", async function () {
        const tx = await crowdfunding.createCampaign("Test Campaign", "Description", 100);
        await expect(tx).to.emit(crowdfunding, "CampaignCreated").withArgs(0, owner.address, "Test Campaign", 100);

        const campaign = await crowdfunding.getCampaign(0);
        expect(campaign.owner).to.equal(owner.address);
        expect(campaign.goal).to.equal(100);
        expect(campaign.amountCollected).to.equal(0);
        expect(campaign.completed).to.be.false;
    });

    it("should reject campaign creation with zero goal", async function () {
        await expect(crowdfunding.createCampaign("Bad Campaign", "No Goal", 0)).to.be.revertedWith("Goal must be greater than zero");
    });

    it("should allow donations and update campaign balance", async function () {
        await crowdfunding.createCampaign("Fundraiser", "Help Needed", 100);
        
        const tx = await crowdfunding.connect(donor).donateToCampaign(0, { value: ethers.parseEther("1") });
        await expect(tx).to.emit(crowdfunding, "DonationReceived").withArgs(0, donor.address, ethers.parseEther("1"));

        const campaign = await crowdfunding.getCampaign(0);
        expect(campaign.amountCollected).to.equal(ethers.parseEther("1"));
    });

    it("should reject invalid donations", async function () {
        await crowdfunding.createCampaign("Fundraiser", "Help Needed", 100);
        
        await expect(crowdfunding.connect(donor).donateToCampaign(0, { value: 0 })).to.be.revertedWith("Donation must be greater than zero");
        await expect(crowdfunding.connect(donor).donateToCampaign(99, { value: ethers.parseEther("1") })).to.be.revertedWith("Invalid campaign ID");
    });

    it("should allow the owner to withdraw funds when goal is reached", async function () {
        await crowdfunding.createCampaign("Success Campaign", "Goal Met", ethers.parseEther("1"));
        
        await crowdfunding.connect(donor).donateToCampaign(0, { value: ethers.parseEther("1") });

        await expect(crowdfunding.withdrawFunds(0)).to.changeEtherBalances(
            [owner, crowdfunding],
            [ethers.parseEther("1"), ethers.parseEther("-1")]
        );

        const campaign = await crowdfunding.getCampaign(0);
        expect(campaign.completed).to.be.true;
    });

    it("should prevent withdrawals before goal is met", async function () {
        await crowdfunding.createCampaign("Incomplete Campaign", "Not Funded", ethers.parseEther("2"));
        
        await crowdfunding.connect(donor).donateToCampaign(0, { value: ethers.parseEther("1") });

        await expect(crowdfunding.withdrawFunds(0)).to.be.revertedWith("Goal not reached");
    });

    it("should prevent non-owners from withdrawing", async function () {
        await crowdfunding.createCampaign("Restricted Campaign", "Only Owner", ethers.parseEther("1"));
        
        await crowdfunding.connect(donor).donateToCampaign(0, { value: ethers.parseEther("1") });

        await expect(crowdfunding.connect(donor).withdrawFunds(0)).to.be.revertedWith("Not campaign owner");
    });

    it("should prevent double withdrawals", async function () {
        await crowdfunding.createCampaign("One-Time Campaign", "Withdraw Once", ethers.parseEther("1"));
        
        await crowdfunding.connect(donor).donateToCampaign(0, { value: ethers.parseEther("1") });

        await crowdfunding.withdrawFunds(0);

        await expect(crowdfunding.withdrawFunds(0)).to.be.revertedWith("Already withdrawn");
    });
});
