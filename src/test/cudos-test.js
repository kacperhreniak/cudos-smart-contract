const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Cudos contract", async () => {
  // addresses
  let owner;
  let firstUser;
  let secondUser;
  
  // contract
  let testingContract;

  beforeEach(async () => {
      [owner, firstUser, secondUser] = await ethers.getSigners();
      const CudsoContract = await ethers.getContractFactory("Cudos");
      testingContract = await CudsoContract.deploy();  
  });

  describe("Deployment", () => {
    it("Should assign creator of the contract as the owner", async function () {
      // given + when
      const response = await testingContract.owner();

      // then
      expect(response).to.equal(owner.address);
    });

    it("should create empty list of users", () => {
      // TODO
    })
  });

  describe("Creating users", () => {
    it("should create new user", async () => {
      // given
      const nickname = "John Wick";
      
      // when
      await testingContract.connect(firstUser).createUser(nickname);

      // then 

    });

    it("should not create new user when user with this address exists", async () => {
      // given
      const nickname = "John Wick";
      
      // when
      await testingContract.connect(firstUser).createUser(nickname);
      
      // then
      await expect(testingContract.connect(firstUser).createUser(nickname)).to.be.revertedWith("User already exists");
    });
  });

  describe("Getting user from the contract", () => {
    const nickname = "John Wick";

    beforeEach(async () => {
      await testingContract.connect(firstUser).createUser(nickname);
    });

    it("should return mine account", async () => {
      // given + when
      const [actualNickname, actualItems] = await testingContract.connect(firstUser).getUser(firstUser.address);

      // then
      expect(actualNickname).to.equal(nickname);
      expect(actualItems).to.be.empty;
    });

    it("should return not mine but specific existing account", async () => {
      // given + when
      const [actualNickname, actualItems] = await testingContract.connect(secondUser).getUser(firstUser.address);

      // then
      expect(actualNickname).to.equal(nickname);
      expect(actualItems).to.be.empty;
    });

    it("should not return account when not exist inside contract", async () =>{
      // then
      await expect(
        testingContract.connect(secondUser).getUser(secondUser.address)
      ).to.revertedWith("User does not exist");
    });
  });

  describe("Adding Kudos to the account", () => {
    const kudos = "Thx, you're awesome!";

    beforeEach(async () => {
      const nickname = "John Wick";

      await testingContract.connect(firstUser).createUser(nickname);
    });

    it("should throw error when adding kudos for myself", async () => {
      // give + when
      const addKudos = async () => {
        await testingContract.connect(firstUser).addKudos(firstUser.address, kudos);
      }

      // then
      await expect(addKudos()).to.revertedWith("Oh, cmon! Give it to teammates!");
    });

    it("should throw error when taker user not exist", async () => {
      // when
      const addKudos = async () => {
        await testingContract.connect(firstUser).addKudos(secondUser.address, kudos);
      }

      // then
      await expect(addKudos()).to.revertedWith("User does not exist");
    });
  });

  describe("Use cases", () => {
    it("should create account, add kudos, and return it", async () => {
      // add user
      const nickname = "John Wick";
      await testingContract.connect(firstUser).createUser(nickname);

      // get kudos
      const kudosMessage = "Thx, for this app";
      await testingContract.connect(secondUser).addKudos(firstUser.address, kudosMessage);

      // receive account
      const [actualNickname, actualItems] = await testingContract.connect(secondUser).getUser(firstUser.address);
      const expectedItems = [[secondUser.address, kudosMessage]];

      expect(actualNickname).to.equal(nickname);
      expect(actualItems).to.eql(expectedItems);
    });
  });
});
