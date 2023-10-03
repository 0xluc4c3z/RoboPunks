// SPDX-License-Identifier: MIT

/*
================Easter Egg================

Riddle 1:
There are many robots in this world, so they must share rooms, 
at night they group together in the center of the room and go into sleep mode, 
it helps them to recharge. There are two robots in front of another pair of robots, 
there are two robots behind another pair of robots, 
there are two robots next to another two robots. 

How many robots share the room?


*/
pragma solidity ^0.8.19;

import "openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";
import "openzeppelin-contracts/contracts/utils/Counters.sol";
import "openzeppelin-contracts/contracts/access/Ownable.sol";
import "openzeppelin-contracts/contracts/utils/cryptography/MerkleProof.sol";

/**
 * @title RoboPunksNFT
 * @author Neura
 * @notice Robots entered into the NFTs...
 *         If you can decipher the riddle, feel free to enter your answer in answerRiddle1(), you will get a reward ;)
*/
contract RoboPunksNFT is ERC721, Ownable {
    using Strings for uint256;
    using Counters for Counters.Counter;

    Counters.Counter private supply;

    string internal uri;

    string internal uriSuffix = ".json";

    string internal hiddenMetadataUri;

    uint256 public cost;

    uint256 public maxSupply;

    uint256 public maxMintAmountPerTx;

    bool public paused = true;

    bool public revealed = false;

    bool public presale = false;

    bytes32 internal merkleRoot;

    address public feeReceiver;

    address public riddle1Winner;

    address public riddle2Winner;

    mapping(address => bool) public whitelistClaimed;

    mapping(address => uint) public walletMints;

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _cost,
        uint256 _maxSupply,
        uint256 _maxMintAmountPerTrx
    ) ERC721(_name, _symbol) {
        cost = _cost;
        maxSupply = _maxSupply;
        maxMintAmountPerTx = _maxMintAmountPerTrx;
    }

    modifier mintCompliance(uint256 _mintAmount) {
        require(
            _mintAmount > 0 && _mintAmount <= maxMintAmountPerTx,
            "Invalid mint amount!"
        );
        require(
            supply.current() + _mintAmount <= maxSupply,
            "Max supply exceeded!"
        );
        _;
    }

    /** 
     * @notice Function that displays the number of nfts minted.
     * @dev Use "Counter" from OZ to get the last mined id.
    */
    function totalSupply() external view returns (uint256) {
        return supply.current();
    }

    /** 
     * @notice Function used to mint nfts.
     * @param _mintAmount the amount of nfts you want to mint 
    */
    function mint(uint256 _mintAmount)
    external
    payable
    mintCompliance(_mintAmount)
    {
        require(!paused, "Mint have not started yet");
        require(msg.value >= cost * _mintAmount, "Insufficient funds!");
        require(walletMints[msg.sender] + _mintAmount <= maxMintAmountPerTx, "Maximum mints per wallet limit exceeded");
        walletMints[msg.sender] = walletMints[msg.sender] + _mintAmount;
        _mintLoop(msg.sender, _mintAmount);
    }

    /** 
     * @notice Function used to mint nfts for existing users in whitelist.
     * @param _mintAmount the amount of nfts you want to mint.
     * @param _merkleProof the signarure for the whitelist.
    */
    function whitelistMint(uint256 _mintAmount, bytes32[] calldata _merkleProof)
    external
    payable
    mintCompliance(_mintAmount)
    {
        require(presale, "Presale is not active.");

        address claimer = msg.sender;
        

        require(!whitelistClaimed[claimer], "Address has already claimed.");
        require(_mintAmount <= 4, "Max 4 per WL wallet.");
        if (_mintAmount > 1) {
            require(msg.value >= (cost * (_mintAmount - 1)), "Insufficient funds!");
        }
        bytes32 leaf = keccak256(abi.encode(msg.sender));
        require(
            MerkleProof.verify(_merkleProof, merkleRoot, leaf),
            "Invalid proof"
        );
        whitelistClaimed[claimer] = true;
        walletMints[claimer] = walletMints[claimer] + _mintAmount;
        _mintLoop(claimer, _mintAmount);
    }

    /** 
     * @notice Privileged function in which the owner can mint nfts to any user.
     * @param _mintAmount the amount of nfts you want to mint.
     * @param _receiver the address of the user that the owner wants to receive nfts.
    */
    function mintForAddress(uint256 _mintAmount, address _receiver)
    external
    mintCompliance(_mintAmount)
    onlyOwner
    {
        _mintLoop(_receiver, _mintAmount);
    }

    /** 
     * @notice Returns the amounts and the ids of nfts that have the specified address.
     * @param _owner the address of any user that you indicates.
    */
    function walletOfOwner(address _owner)
    external
    view
    returns (uint256[] memory)
    {
        uint256 ownerTokenCount = balanceOf(_owner);
        uint256[] memory ownedTokenIds = new uint256[](ownerTokenCount);
        uint256 currentTokenId = 1;
        uint256 ownedTokenIndex = 0;

        while (
            ownedTokenIndex < ownerTokenCount && currentTokenId <= maxSupply
        ) {
            address currentTokenOwner = ownerOf(currentTokenId);

            if (currentTokenOwner == _owner) {
                ownedTokenIds[ownedTokenIndex] = currentTokenId;

                ownedTokenIndex++;
            }

            currentTokenId++;
        }

        return ownedTokenIds;
    }

    /** 
     * @notice Return information about your minted nft.
     * @param _tokenId the id of your minted nft.
    */
    function tokenURI(uint256 _tokenId)
    public
    view
    virtual
    override
    returns (string memory)
    {
        require(
            _exists(_tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );

        if (revealed == false) {
            return hiddenMetadataUri;
        }

        string memory currentBaseURI = _baseURI();
        return
        bytes(currentBaseURI).length > 0
        ? string(
            abi.encodePacked(
                currentBaseURI,
                _tokenId.toString(),
                uriSuffix
            )
        )
        : "";
    }

    /** 
     * @notice Privileged function in which the owner can revele the information of nfts.
     * @param _state the state to which the owner wants to change.
    */
    function setRevealed(bool _state) external onlyOwner {
        revealed = _state;
    }

    /** 
     * @notice Privileged function in which the owner can set the cost of one nft.
     * @param _cost the cost to which the owner wants to change.
    */
    function setCost(uint256 _cost) external onlyOwner {
        cost = _cost;
    }

    /** 
     * @notice Privileged function in which the owner can set the max mint amount per transaction.
     * @param _maxMintAmountPerTx the max amount mint per transaction to which the owner wants to change.
    */
    function setMaxMintAmountPerTx(uint256 _maxMintAmountPerTx)
    external
    onlyOwner
    {
        maxMintAmountPerTx = _maxMintAmountPerTx;
    }

    /** 
     * @notice Privileged function in which the owner can set the hidden metadata uri.
     * @param _hiddenMetadataUri the information for the hidden metadata uri.
    */
    function setHiddenMetadataUri(string memory _hiddenMetadataUri)
    external
    onlyOwner
    {
        hiddenMetadataUri = _hiddenMetadataUri;
    }

    /** 
     * @notice Privileged function in which the owner can set the uri for nfts.
     * @param _uri the url of the uri.
    */
    function setUri(string memory _uri) external onlyOwner {
        uri = _uri;
    }

    /** 
     * @notice Privileged function in which the owner can set the UriSuffix.
     * @param _uriSuffix the uriSuffix for the uri.
    */
    function setUriSuffix(string memory _uriSuffix) external onlyOwner {
        uriSuffix = _uriSuffix;
    }

    /** 
     * @notice Privileged function in which the owner can set the state of this contract.
     * @param _state the state the owner wants to change.
    */
    function setPaused(bool _state) external onlyOwner {
        paused = _state;
    }

    /** 
     * @notice Privileged function in which the owner can activate the presale.
     * @param _bool the state the owner wants to change.
    */
    function setPresale(bool _bool) external onlyOwner {
        require(merkleRoot != bytes32(0), 'MerkleRoot not set');
        presale = _bool;
    }

    /** 
     * @notice Privileged function in which the owner can set merkle root.
     * @param _newMerkleRoot the merkle root for the whitelist.
    */
    function setMerkleRoot(bytes32 _newMerkleRoot) external onlyOwner {
        merkleRoot = _newMerkleRoot;
    }

    /** 
     * @notice Privileged function in which the owner can withdraw the received fee.
    */
    function withdraw() external onlyOwner {
        require(feeReceiver != address(0), 'Fee receiver unset');
        (bool os, ) = payable(feeReceiver).call{value: address(this).balance}("");
        require(os);
    }

    /** 
     * @notice Internal function that mints an amount to a user.
     * @param _receiver the address of the user who is to receive the nfts
     * @param _mintAmount the number of nfts to be mint
    */
    function _mintLoop(address _receiver, uint256 _mintAmount) internal {
        for (uint256 i = 0; i < _mintAmount; i++) {
            supply.increment();
            _safeMint(_receiver, supply.current());
        }
    }

    /** 
     * @notice Function that sets where the fee earned will be sent to.
     * @param _receiver the address that will receive the fee.
    */
    function setWithdrawReceiver(address _receiver) external onlyOwner {
        feeReceiver = _receiver;
    }

    /** 
     * @notice Function to view the number of nfts of a user.
     * @param _address tthe user's address.
    */
    function getMintedAmount(address _address) external view returns (uint256) {
        return walletMints[_address];
    }

    /** 
     * @notice Function to check if you are on the whitelist.
     * @param _address the user's address.
     * @param _merkleProof the necessary proof.
    */
    function isWl(address _address, bytes32[] calldata _merkleProof) external view returns (bool) {
        bytes32 leaf = keccak256(bytes.concat(keccak256(abi.encode(_address))));
        if (MerkleProof.verify(_merkleProof, merkleRoot, leaf)) return true; else return false;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return uri;
    }

    /** 
     * @notice Riddle which allows you to win a nft.
     * @param word the word that believes as an answer.
    */
    function answerRiddle1(string memory word) external {
        bytes32 answer = 0x0b701c8a16939e2de83ebd55cb55edda407e2dac6fae7c0c627f822effef004f;
        require(!paused, 'It is too early for an answer');
        require(riddle1Winner == address(0), 'Riddle has been already answered');
        require(sha256(abi.encodePacked(word)) == answer,'Wrong answer');
        riddle1Winner = msg.sender;
        supply.increment();
        _safeMint(msg.sender, supply.current());
    }

    receive() external payable {}
}
