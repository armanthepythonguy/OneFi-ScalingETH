
# OneFi
<img width="157" alt="Screenshot 2023-03-26 at 7 03 13 PM" src="https://user-images.githubusercontent.com/66505181/227857451-d5cb1681-5dcb-4aaa-97dd-c084e11991fa.png">

This project aims to build an L2 solution, that has all the features Defi platforms want. Thus we built OPLink, a custom L2-based solution made with OpStack. It has all the features of oracles integrated into the Optimism chain itself so no need to rely on third-party oracle networks. Also, if you want to do cross-chain transactions over in OpLink, we support it to Taiko and Scroll using Hyperlane Protocol. CryptoCase is one of the use cases where the smart contract searches for chains with the lowest gas fees and lowest price impact on the Dex and then takes the trade on the selected chain. One more is Algo-Fi, using which you can do algorithmic trading on-chain by using the automation and the price feed feature of OpLink.
<img width="1440" alt="Screenshot 2023-03-26 at 7 03 39 PM" src="https://user-images.githubusercontent.com/66505181/227857477-a0ad9381-204b-4c4f-98bb-7dad63b37dcd.png">
<img width="1440" alt="Screenshot 2023-03-26 at 7 03 44 PM" src="https://user-images.githubusercontent.com/66505181/227857490-e8bad1d0-67db-4604-90f1-c93106a459b5.png">
<img width="1440" alt="Screenshot 2023-03-26 at 7 03 52 PM" src="https://user-images.githubusercontent.com/66505181/227857498-cbf943f2-70ab-48f5-a5db-30353ffa7f3c.png">


## File Structure

Below is the file structure of the project which may be useful for judging :-

`OpLink :- Contains all the important files needed for the L2 chain to work`

`Hyperlane :- Contains all the important files needed for deployment of Hyperlane protocol in Taiko and Scroll`

`Frontend :- Contains all the important files needed for next-js frontend to work`




## OpLink

Here are the important files you may look into :- 

```bash
  Over in /oplink/oplink-optimism/op-node/rollup/derive
  There you will find important codes which was used to add
  oracles like features to the chain 
```
```bash
  Over in /oplink/oplink-optimism/packages/contracts-bedrock/contracts/oplink-extra
  There you will find important smart contract codes which was used to add
  oracles like features to the chain 
```
    
## Hyperlane

Here are the important files you may look into :- 

```bash
  Over in /hyperlane/hyperlane-deploy/config
  There you will find important configurations used to deploy Hyperlane on Scroll and Taiko
```

```bash
  Over in /hyperlane/hyperlane-monorepo/rust
  There you will find important .env files which were used to run validators and relayers for Scroll and Taiko
```
