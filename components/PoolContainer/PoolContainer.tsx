
import styles from './PoolContainer.module.css'

const AssetContainer = ({
    symbol,
    address,
    v3pool,
    target,
    hasFullRangeLiquidity
}) => {
    return (
    <div className={styles.asset}>
        <span className={target ? styles.target : null}>{symbol}</span> 
        {v3pool ? 
        <>
        <a className={styles.v3pool} href={'https://info.uniswap.org/#/pools/' + v3pool.toLowerCase()}>{v3pool}</a>
        {hasFullRangeLiquidity ? <span> OK</span> : <span className={styles.target}> NO FULL RANGE LIQUIDITY</span>}
        </> 
        : null}
    </div>
    )
}
type PoolContainerProps = {
    name: string,
    liquidity: number,
    index: number,
    assets: any,
    target: boolean
}
const PoolContainer = ({
    name,
    liquidity,
    index,
    assets,
    target
}: PoolContainerProps) => {

    const buildAssets = (input) => {
        return Object.entries(input).map((asset:[string, any]) => {
            let [address, data] = asset
            return <AssetContainer key={address} symbol={data.symbol} address={address} target={data.target} v3pool={data.v3PoolAddress} hasFullRangeLiquidity={data.hasFullRangeLiquidity}/>
          })
    }

    return (
        <div className={styles.PoolContainer}>
            <a className={styles.name} href={'https://app.rari.capital/fuse/pool/' + index}>
                {name}
            </a>
            <span className={styles.liquidity}>
                ({liquidity/100}$)
            </span>
            <div className={styles.assets}>
                {buildAssets(assets)}
            </div>
        </div>
    )
}

export default PoolContainer