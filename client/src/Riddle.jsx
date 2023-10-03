import React from "react";
import { Box, Button, Flex, Input, Text } from '@chakra-ui/react';
import { useState } from "react";
import { ethers } from "ethers";
import roboPunksNFT from "./roboPunksNFT.json";

const roboPunksNFTAddress = "0xc23a32c1A45e501bD0017dec0c87f9e68982A9D3";

const Riddle = ({ accounts, setAccounts, riddleSection }) => {
  const [value, setValue] = useState('');
  const [err, setErr] = useState('');

  const [mintAmount, setMintAmount] = useState(1);
  const isConnected = Boolean(accounts[0]);

  async function handleChange(e) {
    setValue(e.target.value);
  }

  async function handleMint() {
    if (window.ethereum) {
      // const provider = new ethers.providers.JsonRpcProvider("https://eth-goerli.g.alchemy.com/v2/ZqKQk0ErOuUqPr3ly-cWs5RDP8qva_EF");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      // let wallet = accounts[0];
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        roboPunksNFTAddress,
        roboPunksNFT,
        signer
      );
      try {
        const response = await contract.answerRiddle1(value);
        console.log("response: ", response);
      } catch (err) {
        setErr('Wrong answer');
        console.log("error: ", err);
      }
    }
  }

  return (
    <Flex 
      w="100%"
      h="900px"
      backgroundColor="#0b0e1e"
      justify="center"
      marginTop="100px"
      ref={riddleSection}>
        <Box width="720px" marginTop="150px">
        <Box width="720px">
          <Text fontSize="48px" textShadow="0 5px #000000">
              Riddle
          </Text>
          <Text
            marginBottom="60px"
            fontSize="30px"
            letterSpacing="5.5%"
            fontFamily="VT323"
            textShadow="0 3px #000000"
            color="#008fd4"
          >
            If you guess the riddle, you win a NFT.
          </Text>
          <Text
              fontSize="30px"
              letterSpacing="-5.5%"
              fontFamily="VT323"
              textShadow="0 2px 2px #000000"
            >
              "There are many robots in this world, so they must share rooms, 
              at night they group together in the center of the room and go into sleep mode, 
              it helps them to recharge. There are two robots in front of another pair of robots, 
              there are two robots behind another pair of robots, 
              there are two robots next to another two robots."
            </Text>
            <Text
              fontSize="30px"
              letterSpacing="-5.5%"
              fontFamily="VT323"
              textShadow="0 2px 2px #000000"
            >
              How many robots share the room?
            </Text>
            <Input
                fontFamily="inherit"
                width="200px"
                height="40px"
                // textAlign="center"
                paddingLeft="19px"
                marginTop="10px"
                type="text"
                value={value}
                onChange={handleChange}
            />
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
          margin="30"
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
        <Text
          fontSize="30px"
          letterSpacing="5.5%"
          fontFamily="VT323"
          textShadow="0 3px #000000"
          color="#FF5F5F"
        >
          {err}</Text>
        </Box>
    </Flex>
  );
};

export default Riddle;