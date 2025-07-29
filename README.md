# FlashMint

A simple tap-to-mint NFT game on Base

## How to Play

- Mint a free NFT every 4 hours
- NFTs level up based on your daily streak
- Skip the wait by tapping Boost (cost: 0.5 USDC)
- Each mint triggers a Flash Card post on your Farcaster feed

## Screenshots

<img width="310" height="777" alt="image" src="https://github.com/user-attachments/assets/4e2b8580-efd7-4393-9c15-aec8d55c9773" />

## Featuring
- One-tap easy minting  
- Evolving NFTs with rewarding streaks  
- Auto-sharing via Farcaster  
- Optional paid boosts

## Tech Stack

- Frontend: React, Tailwind, Base MiniKit  
- Backend: Next.js API routes, Redis (Upstash)  
- Smart contracts: Solidity, ERC-721A on Base L2  
- Integration: Neynar SDK for Farcaster  
- Analytics: PostHog  

## Getting Started

1. Clone the repo  
2. Configure `.env`  
3. Run `npm install`  
4. Start server with `npm run dev`  
5. Deploy (recommend Vercel)  

## Notes

- Gas savings via ERC-721A batching  
- Share your streaks & invite friends!

## Roadmap

- More NFT skins & streak rewards
- Squad & leaderboard support
- NFT marketplace links

## Tips

- Keep streaks alive for cooler NFTs
- Boost smartly to maximize streaks
- Share regularly for more friends & eyes

## FAQs

- Is minting free? Yes
- Does boost cost real money? Yes, 0.5 USDC (on Base)
- Are there minting limits? Yes, 50,000 per day max

Built with ❤️ on Base L2 – Powered by Farcaster

Questions? Reach out on [X](https://x.com/dineshcodes)
