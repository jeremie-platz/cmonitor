import { providers, Contract } from "ethers";
import Fuse from '../esm/Fuse/index'

const MAINNET_RPC = 'https://eth-mainnet.alchemyapi.io/v2/2Mt-6brbJvTA4w9cpiDtnbTo6qOoySnN'
const MAINNET_CHAINID = 1

const buildProvider = () => {
    return new providers.JsonRpcProvider(MAINNET_RPC)
}

export const buildFuseInterface = () => {
    let provider = buildProvider()
    return new Fuse(provider, MAINNET_CHAINID)
}

export const buildPoolOracleContract = (address: string, fuseInterface: Fuse) => {
    const abi = fuseInterface.oracleContracts.MasterPriceOracle.abi
    const contract = new Contract(address, abi, fuseInterface.provider)
    return contract
}

