import { request, gql } from 'graphql-request'

const GRAPH_ENDPOINT = 'https://api.studio.thegraph.com/query/853/fuse-zacel/0.5.91'

export const getTotalPoolCount = async () => {
  const query = gql`
  query GetTotalPoolCount { 
    utility(id: "0") {
        poolCount
      }
  }`
  let response = await request(GRAPH_ENDPOINT, query)
  return parseInt(response?.utility?.poolCount)
}

export const getAllPoolsData = async (poolCount: number = 645) => {
  const query = gql`
    query GetAllPoolsData {
      pools(first: ${poolCount})
      {
      id
        address
        name
        index
        priceOracle
        totalLiquidityUSD
          assets{
          id
          symbol
          underlying{
            id
            symbol
            totalLiquidityUSD
          }
        }
      }
    }
    `
  return (await request(GRAPH_ENDPOINT, query))?.pools || []
}