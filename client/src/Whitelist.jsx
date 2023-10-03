import React from "react";
import { Box, Button, Flex, Input, Link, Container, Text } from '@chakra-ui/react';
import { useState } from "react";
import { ethers } from "ethers";
import roboPunksNFT from "./roboPunksNFT.json";


const roboPunksNFTAddress = "0xc23a32c1A45e501bD0017dec0c87f9e68982A9D3";

const Whitelist = ({ accounts, setAccounts, whitelistSection }) => {
  const [mintAmount, setMintAmount] = useState(1);
  const isConnected = Boolean(accounts[0]);

  async function handleMint() {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        roboPunksNFTAddress,
        roboPunksNFT.abi,
        signer
      );
      try {
        const response = await contract.mint(BigInt.from(mintAmount));
        console.log("response: ", response);
      } catch (err) {
        console.log("error: ", err);
      }
    }
  }

  const handleDecrement = () => {
    if(mintAmount <= 1) return;
    setMintAmount(mintAmount - 1);
  };

  const handleIncrement = () => {
    if(mintAmount >= 4) return;
    setMintAmount(mintAmount + 1);
  };

  return (
    <Flex 
      w="100%"
      h="920px"
      backgroundColor="#0b0e1e"
      justify="center"
      ref={whitelistSection}>
        <Box width="720px" marginTop="120px">
        <Box width="720px">
          <Text fontSize="48px" textShadow="0 5px #000000">
            Whitelist
          </Text>
          <Text
            marginBottom="60px"
            fontSize="30px"
            letterSpacing="5.5%"
            fontFamily="VT323"
            textShadow="0 3px #000000"
            color="#008fd4"
          >
            If you are privileged, enter the proof and you will be able to mint nfts. 
          </Text>
          <Input
                fontFamily="inherit"
                width="200px"
                height="40px"
                // textAlign="center"
                paddingLeft="19px"
                marginTop="10px"
                type="text"
                placeholder="proof"
            />
            <Flex justify="center" marginTop="20px">
            <Button
                backgroundColor="#008fd4"
                borderRadius="5px"
                boxShadow="0px 2px 2px 1px #0F0F0F"
                color="white"
                cursor="pointer"
                fontFamily="inherit"
                padding="15px"
                margin="10"
                onClick={handleDecrement}
              >
                {" "}
                -
              </Button>

              <Input
                readOnly
                fontFamily="inherit"
                width="100px"
                height="40px"
                textAlign="center"
                paddingLeft="19px"
                marginTop="10px"
                type="number"
                value={mintAmount}
              />

              <Button
                backgroundColor="#008fd4"
                borderRadius="5px"
                boxShadow="0px 2px 2px 1px #0F0F0F"
                color="white"
                cursor="pointer"
                fontFamily="inherit"
                padding="15px"
                margin="10"
                onClick={handleIncrement}
              >
                {" "}
                +
              </Button>
            </Flex>
        </Box>
        {isConnected ? ( 
          <Button
          backgroundColor="#008fd4"
          borderRadius="5px"
          boxShadow="0px 2px 2px 1px #0F0F0F"
          color="white"
          cursor="pointer"
          fontFamily="inherit"
          padding="15px"
          margin="10"
          onClick={handleMint}
        >
          Mint Now
        </Button>
        ) : (
          <Text
          marginTop="70px"
          fontSize="30px"
          letterSpacing="5.5%"
          fontFamily="VT323"
          textShadow="0 3px #000000"
          color="#FF5F5F"
        >
          Connect your wallet to mint.
        </Text>
        )}
      </Box>
    </Flex>
  );
};

export default Whitelist;