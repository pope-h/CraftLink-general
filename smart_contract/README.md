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
https://sepolia.etherscan.io/address/0x02F91e83CC4c77A7cB64b75FAb8D958FD1cD3fFd

Token deployed at: 0x0984bf8be54df5Ded9D5052Dc32E3BA7F46f5908
https://sepolia.etherscan.io/address/0x68E566635dF3DaAc45b60563701f56352968D276

PaymentProcessor deployed at:
https://sepolia.etherscan.io/address/0x67CDDef5137bd447693Ea3BA95eeF64636d688bC

GigMarketplace deployed at: 0xB0A40A36ae5A49e2ab5e66e7853FcE3fA1422871
https://sepolia.etherscan.io/address/0x9CAd694a0966Aca238ee1E781b3dD05f0C82648F

ReviewSystem deployed at: 0x195722BdbF7781a481A200d341e55743762A3E6d
https://sepolia.etherscan.io/address/0x669C43D69A9A76C2F257321780E93aCa060cCf84

ChatSystem deployed at: 0xe891d7287620b355E8601C5960265F97a5363390
https://sepolia.etherscan.io/address/0x8F8e91A0aD1f5A0547074b138C10e60e5633d447