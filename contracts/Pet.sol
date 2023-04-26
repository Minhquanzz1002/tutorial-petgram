// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Pet is ERC721 {

    mapping (string => uint256) internal tokenURIs;

    constructor() public ERC721("Pet", "PET") {}

    event PetNFTCreated(
        uint256 tokenId,
        string imageURL,
        uint256 date,
        address payable from
    );

    modifier _checkTokenURI(string memory _tokenURI) {
        require(checkTokenURI(_tokenURI), "Token URI already exists.");
        _;
    }

    function checkTokenURI(string memory _tokenURI) public view returns (bool) {
        if (tokenURIs[_tokenURI] != 0){
            return false;
        }
        return true;
    }

    function mintPetNFT(string memory _tokenURI) external _checkTokenURI(_tokenURI) {

        uint256 _tokenId = totalSupply().add(1);
        _safeMint(msg.sender, _tokenId);            
        _setTokenURI(_tokenId, _tokenURI);          // set the tokenURI for tokenId
        tokenURIs[_tokenURI] = _tokenId;
        emit PetNFTCreated(_tokenId, _tokenURI, now, msg.sender);
    }
}
