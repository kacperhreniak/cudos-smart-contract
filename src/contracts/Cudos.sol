// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

contract Cudos {
    
    struct User {
        bool exist;
        string nickname;
        Item[] items;
    }
    
    struct Item {
        address donorAddress;
        string message;
    }
    
    address public owner;
    
    mapping(address => User) users;

    constructor() {
        owner = msg.sender;
    }
    
    function createUser(string memory _name) public {
        require(users[msg.sender].exist == false, "User already exists");
        User storage newUser = users[msg.sender];    
        newUser.nickname = _name;
        newUser.exist = true;
    }
    
    // You don't have to have account to add kudos.. hm it's not good!
    function addKudos(address _taker, string memory _message) public {
        require(msg.sender != _taker, "Oh, cmon! Give it to teammates!");
        require(users[_taker].exist == true, "User does not exist");
        
        Item memory item = Item({
            donorAddress: msg.sender,
            message: _message
        });
        users[_taker].items.push(item);
    }

    function getUser(address _userAddress) view public returns(string memory, Item[] memory) {
        require(users[_userAddress].exist == true, "User does not exist");
        
        return (users[_userAddress].nickname, users[_userAddress].items);
    }
}
