## Foundry

**Foundry is a blazing fast, portable and modular toolkit for Ethereum application development written in Rust.**

Foundry consists of:

-   **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).
-   **Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.
-   **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.
-   **Chisel**: Fast, utilitarian, and verbose solidity REPL.

## Documentation

https://book.getfoundry.sh/

## Usage

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Format

```shell
$ forge fmt
```

### Gas Snapshots

```shell
$ forge snapshot
```

### Anvil

```shell
$ anvil
```

### Deploy

```shell
$ forge script script/Counter.s.sol:CounterScript --rpc-url <your_rpc_url> --private-key <your_private_key>
```

### Cast

```shell
$ cast <subcommand>
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```
Transactions saved to: /craftlink-general/smart_contract/broadcast/Deploy.s.sol/11155111/run-latest.json

## LATEST DEPLOYMENT

Registry deployed at: 0xa12a383A0fDC53b5010BAC329B8F51575D06fE8c 
https://sepolia.etherscan.io/address/0xD9a745470Fb850737D2c631E7688373d7C9a9237

Token deployed at: 0x0984bf8be54df5Ded9D5052Dc32E3BA7F46f5908 https://sepolia.etherscan.io/address/0xEE29E8A02eC04d8EcAC6286718fb250300935d4A
https://sepolia.etherscan.io/address/0xf03bddFA80283a8f9C2422De6Ee1bde278325d26

GigMarketplace deployed at: 0xB0A40A36ae5A49e2ab5e66e7853FcE3fA1422871 https://sepolia.etherscan.io/address/0xF1E583cA6682beAdE0E79708fb8d86C218AB252A

ReviewSystem deployed at: 0x195722BdbF7781a481A200d341e55743762A3E6d https://sepolia.etherscan.io/address/0xF480Dc9eFFBF3F624a5Ed77b040e634934F27E21

ChatSystem deployed at: 0xe891d7287620b355E8601C5960265F97a5363390 https://sepolia.etherscan.io/address/0xe4c06D1a121635F32a7feC437B1CCB4C90FafC4d