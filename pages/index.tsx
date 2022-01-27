import styles from '../styles/Home.module.css'

import { useEffect, useState, useMemo } from 'react'
// @ts-ignore
import { getAllPoolsData } from '../lib/Graph.tsx';
// @ts-ignore
import { buildFuseInterface, buildPoolOracleContract } from '../lib/Fuse.tsx';


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
  const [poolsData, setPoolsData] = useState({})
  const [oracleData, setOracleData] = useState({})

  useEffect(() => {
    console.log('Loading!')
    getAllPoolsData().then(data => {
      console.log('Pool data fetched')
      setPoolsData(data)
    })
  }, []);

  useEffect(() => {
    if (!poolsData?.pools) {
      return
    }
    console.log('Fetching oracle data')

    Promise.all(poolsData.pools.map(async (pool) => {
      if (pool.assets.lenght === 0) {
        return
      }
      const poolContract = buildPoolOracleContract(pool.priceOracle, fuseInterface)
      let hasOracleTarget = false
      return {
        [pool.id]: {
          assets: (await Promise.all(pool.assets.map(async (asset) => {
            let assetAddress = asset.underlying.id
            let assetPriceOracleAddress = await poolContract.oracles(assetAddress)
            let priceOracleIdentifier = await fuseInterface.identifyPriceOracle(assetPriceOracleAddress)
            let oracleIsTarget = ORACLE_IDENTIFIER_TARGETS.includes(priceOracleIdentifier)
            if(oracleIsTarget)
              hasOracleTarget = true
            return {
              [asset.id]: {
                oracleIdentifier: priceOracleIdentifier,
                target: oracleIsTarget
              }
            }
          }))).reduce((result, element) => {
            return { ...result, ...element }
          }, {}),
          target: hasOracleTarget
        }
      }
    })).then(data => {
      data = data.reduce((result, element) => {
        return { ...result, ...element }
      })
      setOracleData(data)
    })
  }, [poolsData?.pools])

  useMemo(() => {
    if(Object.keys(oracleData).length > 0){
      console.log(oracleData)
      console.log('Finished')
    }
  }, [oracleData])

  return (
    <>
      <span>check console</span>
    </>
  )
}
