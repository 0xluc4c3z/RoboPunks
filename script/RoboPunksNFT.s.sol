// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console2} from "forge-std/Script.sol";
import "../src/RoboPunksNFT.sol";

contract RoboPunksNFTScript is Script {
    function setUp() public {}

    function run() public {
        uint256 privateKey = vm.envUint("DEV_PRIVATE_KEY");
        address account = vm.addr(privateKey);

        vm.startBroadcast(privateKey);
        // deploy contract
        RoboPunksNFT roboPunksNFT = new RoboPunksNFT("RoboPunksNFT", "RB", 0.5 ether, 10, 2);

        vm.stopBroadcast();
    }
}
