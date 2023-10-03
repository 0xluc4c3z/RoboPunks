import React from "react";
import { Box, Button, Flex, Image, Link, Spacer } from '@chakra-ui/react';
import Facebook from "./assets/facebook_32x32.png";
import Email from "./assets/email_32x32.png";
import Twitter from "./assets/twitter_32x32.png";

const NavBar = ({ accounts, setAccounts, aboutSection, riddleSection, whitelistSection }) => {
  const isConnected = Boolean(accounts[0]);

  async function connectAccount() {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccounts(accounts);
    }
  }

  const scrollToAbout = () =>{
    window.scrollTo({
      behavior: 'smooth',
      top: 0
    });
  };

  const scrollToRiddle = () =>{
    riddleSection.current.scrollIntoView({behavior: 'smooth'});
  }

  const scrollToWhitelist = () =>{
    whitelistSection.current.scrollIntoView({behavior: 'smooth'});
  }

  return (
    <Flex justify="space-between" align="center" padding="10px" position="fixed" w="90%">

      <Flex justify="space-around" width="40%" padding="0 75px">
        <Link href="https://www.facebook.com">
          <Image src={Facebook} boxSize="42px" margin="0 15px"></Image>
        </Link>
        <Link href="https://www.twitter.com">
          <Image src={Twitter} boxSize="42px" margin="0 15px"></Image>
        </Link>
        <Link href="https://www.gmail.com">
          <Image src={Email} boxSize="42px" margin="0 15px"></Image>
        </Link>
      </Flex>

      <Flex
        justify="space-around"
        align="center"
        width="40%"
        padding="30px"
        >
        <Link 
          margin="0 15px" 
          onClick={scrollToAbout}
          _hover={{bg: "whitesmoke", color: "#121212"}}
          >
            About
        </Link>
        <Spacer />
        <Link 
          margin="0 15px"
          onClick={scrollToRiddle}
          _hover={{bg: "whitesmoke", color: "#121212"}}
          >
          Riddle</Link>
        <Spacer />
        <Link 
          margin="0 15px"
          onClick={scrollToWhitelist}
          _hover={{bg: "whitesmoke", color: "#121212"}}
          >
          Whitelist</Link>
        <Spacer />

        {isConnected ? (
          <Box margin="0 15px">Connected</Box>
        ) : (
          <Button 
          backgroundColor="#D6517D"
          borderRadius="5px"
          boxShadow="0px 2px 2px 1px #0F0F0F"
          color="white"
          cursor="pointer"
          fontFamily="inherit"
          padding="15px"
          margin="0 15px"
          onClick={connectAccount}
          >
            Connect
          </Button>
        )}
      </Flex>
    </Flex>
  );
};

export default NavBar;