import { Contract } from "ethers";
import UniswapV3TwapPriceOracleV2ABI from '../abi/oracle/UniswapV3TwapPriceOracleV2.json'
import UniswapV3TwapPriceOracleABI from '../abi/oracle/UniswapV3TwapPriceOracle.json'
import UniswapV3FactoryABI from '../abi/factory/UniswapV3Factory.json'
import { Fuse } from "../esm";

export const buildOracleContract = (address, fuseInterface?: Fuse) => {
    return new Contract(address, UniswapV3TwapPriceOracleABI, fuseInterface.provider)
}

export const buildOracleV2Contract = (address, fuseInterface?: Fuse) => {
    return new Contract(address, UniswapV3TwapPriceOracleV2ABI, fuseInterface.provider)
}

export const buildFactoryContract = (fuseInterface?: Fuse) => {
    const address = '0x1F98431c8aD98523631AE4a59f267346ea31F984'
    return new Contract(address, UniswapV3FactoryABI, fuseInterface.provider)
}