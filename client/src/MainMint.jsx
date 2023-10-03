import { useState } from "react";
import { ethers } from "ethers";
import { Box, Button, Flex, Input, Text } from '@chakra-ui/react';
import roboPunksNFT from "./roboPunksNFT.json";

const roboPunksNFTAddress = "0xc23a32c1A45e501bD0017dec0c87f9e68982A9D3";

const MaintMint = ({ accounts, setAccounts }) => {
  const [mintAmount, setMintAmount] = useState(1);

  const [err, setErr] = useState('');
  const isConnected = Boolean(accounts[0]);

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
        const response = await contract.mint(BigInt(mintAmount), {value: ethers.utils.parseEther(String(mintAmount * 0.5))});
        console.log("response: ", response);
      } catch (err) {
        setErr(String(err.message).split('', 18));
        console.log("error: ", err);
      }
    }
  }

  const handleDecrement = () => {
    if(mintAmount <= 1) return;
    setMintAmount(mintAmount - 1);
  };

  const handleIncrement = () => {
    if(mintAmount >= 2) return;
    setMintAmount(mintAmount + 1);
  };

  return (
    <Flex justify="center" align="center" height="81vh" >
      <Box width="520px" marginTop="330px">
        <div>
          <Text
            fontSize="30px"
            letterSpacing="5.5%"
            fontFamily="VT323"
            textShadow="0 3px #000000"
            color="#FF5F5F"
          >
            {err}</Text>
          <Text fontSize="48px" textShadow="0 5px #000000">
            RoboPunksNFT
          </Text>
          <Text
            fontSize="30px"
            letterSpacing="-5.5%"
            fontFamily="VT323"
            textShadow="0 2px 2px #000000"
          >
            Its 2078. Can the RoboPunks NFT save humans from destructive 
            rampant NFT speculation? Mint Robopunks to find out.
          </Text>
        </div>

        {isConnected ? (
          <div>
            <Flex justify="center" align="center">
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
          </div>
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

export default MaintMint;