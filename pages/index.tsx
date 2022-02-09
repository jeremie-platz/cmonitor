import styles from '../styles/Home.module.css'

import { useEffect, useState, useMemo } from 'react'
// @ts-ignore
import { getTotalPoolCount, getAllPoolsData } from '../lib/Graph.tsx';
// @ts-ignore
import { buildFuseInterface, buildPoolOracleContract } from '../lib/Fuse.tsx';
// @ts-ignore
import { buildOracleContract, buildOracleV2Contract, buildFactoryContract } from '../lib/UniswapV3'


import Pool from '../components/PoolContainer/PoolContainer'
import Loading from '../components/Loading/Loading'

const ORACLE_IDENTIFIER_TARGETS = [
  "UniswapV3TwapPriceOracle_Uniswap_3000",
  "UniswapV3TwapPriceOracle_Uniswap_10000",
  "UniswapV3TwapPriceOracleV2_Uniswap_500_USDC",
  "UniswapV3TwapPriceOracleV2_Uniswap_3000_USDC",
  "UniswapV3TwapPriceOracleV2_Uniswap_10000_USDC",
  "UniswapV3TwapPriceOracleV2"
]

export default function Home() {

  const fuseInterface = buildFuseInterface()
  const [poolCount, setPoolCount] = useState(0)
  const [poolsData, setPoolsData] = useState([])
  const [oracleData, setOracleData] = useState({})

  //TARGET FILTER
  const targetFilter = true

  useEffect(() => {
    console.log('Loading!')
    getTotalPoolCount().then(poolCount => {
      setPoolCount(poolCount)
    })
  }, []);

  useEffect(() => {
    if(poolCount === 0){
      return
    }
    getAllPoolsData(poolCount).then(data => {
      console.log('Pool data fetched')
      setPoolsData(data)
    })
  }, [poolCount])

  useEffect(() => {
    const UniswapV3FactoryContract = buildFactoryContract(fuseInterface)
    const WETH_ADDR = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
    if (poolsData.length === 0) { //TODO that ts fix
      return
    }
    console.log('Fetching oracle data')

    Promise.all(poolsData.map(async (pool) => {
      if (pool.assets.lenght === 0) {
        return
      }
      const poolContract = buildPoolOracleContract(pool.priceOracle, fuseInterface)
      let hasOracleTarget = false
      return {
        [pool.id]: {
          liquidity: parseInt(pool.totalLiquidityUSD),
          name: pool.name,
          index: parseInt(pool.index),
          assets: (await Promise.all(pool.assets.map(async (asset) => {
            let address = asset.underlying.id
            let symbol = asset.underlying.symbol
            let liquidity = parseInt(asset.underlying.totalLiquidityUSD)
            let assetPriceOracleAddress = await poolContract.oracles(address)
            let priceOracleIdentifier = await fuseInterface.identifyPriceOracle(assetPriceOracleAddress)
            let oracleIsTarget = ORACLE_IDENTIFIER_TARGETS.includes(priceOracleIdentifier)
            let v3PoolAddress = null
            if(oracleIsTarget){
              if(priceOracleIdentifier.includes('UniswapV3TwapPriceOracleV2')){
                let oracleContract = buildOracleV2Contract(assetPriceOracleAddress, fuseInterface)
                let [baseToken, feeTier] = await Promise.all([oracleContract.baseToken(), oracleContract.feeTier()])
                v3PoolAddress = await UniswapV3FactoryContract.getPool(address, baseToken, feeTier)
              } else {
                let oracleContract = buildOracleContract(assetPriceOracleAddress, fuseInterface)
                let feeTier = await oracleContract.feeTier()
                v3PoolAddress = await UniswapV3FactoryContract.getPool(address, WETH_ADDR, feeTier)
              }
              hasOracleTarget = true
          }
            return {
              [address]: {
                symbol: symbol,
                liquidity: liquidity,
                oracleIdentifier: priceOracleIdentifier,
                target: oracleIsTarget,
                v3PoolAddress: v3PoolAddress
              }
            }
          }))).reduce((result, element) => {
            return { ...result, ...element }
          }, {}),
          target: hasOracleTarget
        }
      }
    })).then((data: any) => {
      data = data.reduce((result, element) => {
        return { ...result, ...element }
      })
      setOracleData(data)
    })
  }, [poolsData])

  const buildPoolObjects = (input) => {
    console.log(input)
    return Object.entries(input).map((pool:[string, any]) => {
      let [address, data] = pool
      if(targetFilter && !data.target ){
        return
      }
      return (
      <Pool name={data.name} key={address} liquidity={data.liquidity} assets={data.assets} index={data.index} target={data.target}/>
      )
    })
  }

  return (
    <>
      {Object.keys(oracleData).length > 0 ? null : <Loading />}
      {buildPoolObjects(oracleData)}
    </>
  )
}
