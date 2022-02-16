import { BigNumber, Contract } from "ethers";
import UniswapV3TwapPriceOracleV2ABI from '../abi/oracle/UniswapV3TwapPriceOracleV2.json'
import UniswapV3TwapPriceOracleABI from '../abi/oracle/UniswapV3TwapPriceOracle.json'
import UniswapV3FactoryABI from '../abi/factory/UniswapV3Factory.json'
import UniswapV3PoolAbi from '../abi/pool/UniswapV3Pool.json'
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

export const buildV3PoolContract = (address, fuseInterface?: Fuse) => {
    return new Contract(address, UniswapV3PoolAbi, fuseInterface.provider)
}

export const poolHasFullRangeLiquidity = async (contract: Contract) => {
    const MAX_TICK_VALUE = 887272
    const poolTickSpacing: number = await contract.tickSpacing()
    const MAX_POOL_TICK_VALUE = Math.floor(MAX_TICK_VALUE / poolTickSpacing) * poolTickSpacing

    let [minTickLiquidityGross, maxTickLiquidityGross]: [BigNumber, BigNumber] = await Promise.all([
        contract.ticks(-MAX_POOL_TICK_VALUE).then( data => data.liquidityGross),
        contract.ticks(MAX_POOL_TICK_VALUE).then(data => data.liquidityGross),
    ])
    return minTickLiquidityGross.gt(0) && maxTickLiquidityGross.gt(0)
}