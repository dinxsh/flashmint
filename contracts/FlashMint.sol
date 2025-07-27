// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "erc721a-upgradeable/contracts/ERC721AUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract FlashMint is Initializable, ERC721AUpgradeable, OwnableUpgradeable {
    enum Level { Bronze, Silver, Gold }

    struct UserData {
        uint256 streak;
        Level level;
    }

    mapping(address => UserData) public userData;
    mapping(uint256 => Level) public tokenLevel;

    string private baseURI;

    event Minted(address indexed user, uint256 tokenId, Level level, uint256 streak);

    function initialize(string memory _name, string memory _symbol, string memory _baseURI) public initializer {
        __ERC721A_init(_name, _symbol);
        __Ownable_init();
        baseURI = _baseURI;
    }

    function mint(address to, uint256 streak) external onlyOwner returns (uint256) {
        // Determine level based on streak
        Level level = Level.Bronze;
        if (streak >= 14) {
            level = Level.Gold;
        } else if (streak >= 7) {
            level = Level.Silver;
        }

        uint256 tokenId = _nextTokenId();
        _safeMint(to, 1);

        userData[to].streak = streak;
        userData[to].level = level;
        tokenLevel[tokenId] = level;

        emit Minted(to, tokenId, level, streak);
        return tokenId;
    }

    function setBaseURI(string memory _baseURI) external onlyOwner {
        baseURI = _baseURI;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    // Optional: function to upgrade token metadata if streak increases
    function upgradeToken(uint256 tokenId, uint256 newStreak) external onlyOwner {
        require(_exists(tokenId), "Token does not exist");
        Level newLevel = Level.Bronze;
        if (newStreak >= 14) {
            newLevel = Level.Gold;
        } else if (newStreak >= 7) {
            newLevel = Level.Silver;
        }
        tokenLevel[tokenId] = newLevel;
    }

    // Optional: view function to get token level as string
    function getTokenLevel(uint256 tokenId) public view returns (string memory) {
        Level level = tokenLevel[tokenId];
        if (level == Level.Bronze) return "Bronze";
        if (level == Level.Silver) return "Silver";
        if (level == Level.Gold) return "Gold";
        return "";
    }
} 