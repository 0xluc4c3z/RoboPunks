// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import {RoboPunksNFT} from "../src/RoboPunksNFT.sol";

contract RoboPunkNFTTest is Test {
    RoboPunksNFT public roboPunksNFT;
    
    address user1 = address(0x01);
    address user2 = address(0x02);
    address feeReceiver = address(0x03);

    bytes32 merkleRoot = 0xf2e938dad432a3017c59b170e61d510c1419d216e92fbdd518c1c0ec71ab0451;
    bytes32[] merkleProof;

    // string word = "";

    function setUp() public {
        vm.deal(user1, 100 ether);
        vm.deal(user2, 100 ether);

        roboPunksNFT = new RoboPunksNFT("RoboPunksNFT", "RB", 0.5 ether, 10, 2);

        roboPunksNFT.setPaused(false);
        roboPunksNFT.setHiddenMetadataUri("ipfs://QmPQ8Wj4V4aFe8a3tGAbM6j9vK7tq6E4iuDZxer4xwPErM/undisclosed.json");
        roboPunksNFT.setUri("ipfs://QmfRhZ2A2aWy9nvw1UDfXRFKCaigPUe9Eaen8SnK2QSZLy/");
        roboPunksNFT.setMerkleRoot(merkleRoot);
        roboPunksNFT.setPresale(true);

        merkleProof.push(0xe5f6a7c74a117aa03110c71e3dd617d19e804c625e77d2c0b1e5384af6a5049c);
        merkleProof.push(0xff2d0d8afba7a1919daa6a715c41e10ddda9f4a5e5efea8160230e0f8f06ab85);
    }

    // function testwhiteListMint() public {
    //     vm.startPrank(user1);
    //     roboPunksNFT.whitelistMint{ value: 0.5 ether }(2, merkleProof);
    // }

    function testMint() public {
        vm.startPrank(user1);
        roboPunksNFT.mint{ value: 1 ether }(2);
        
        assertEq(roboPunksNFT.balanceOf(user1), 2);

        vm.stopPrank();
    }   

    function testTokenUri() public {
        testMint();

        assertEq(roboPunksNFT.tokenURI(1), "ipfs://QmPQ8Wj4V4aFe8a3tGAbM6j9vK7tq6E4iuDZxer4xwPErM/undisclosed.json");

        roboPunksNFT.setRevealed(true);

        assertEq(roboPunksNFT.tokenURI(1), "ipfs://QmfRhZ2A2aWy9nvw1UDfXRFKCaigPUe9Eaen8SnK2QSZLy/1.json");
    }

    function testMintForAddress() public {
        roboPunksNFT.mintForAddress(2, user2);

        assertEq(roboPunksNFT.balanceOf(user2), 2);
    }

    function testWithdraw() public {
        testMint();

        roboPunksNFT.setWithdrawReceiver(feeReceiver);

        roboPunksNFT.withdraw();

        assertEq(feeReceiver.balance, 1 ether);
    }

    // function testMintAnswer() public {
    //     vm.startPrank(user1);

    //     roboPunksNFT.answerRiddle1(word);

    //     assertEq(roboPunksNFT.balanceOf(user1), 1);
    // }
}
