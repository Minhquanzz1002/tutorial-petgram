// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Pet is ERC721 {
    constructor() public ERC721("Pet", "PET") {}

    event PetNFTCreated(
        uint256 tokenId,
        string imageURL,
        uint256 date,
        address payable from
    );

    function mintPetNFT(string memory _tokenURI) external {

        uint256 _tokenId = totalSupply().add(1);
        _safeMint(msg.sender, _tokenId);            
        _setTokenURI(_tokenId, _tokenURI);          // set the tokenURI for tokenId
        emit PetNFTCreated(_tokenId, _tokenURI, now, msg.sender);
    }
}
