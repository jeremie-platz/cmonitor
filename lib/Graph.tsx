import { request, gql } from 'graphql-request'

const GRAPH_ENDPOINT = 'https://api.studio.thegraph.com/query/853/fuse-zacel/0.5.91'

export const getAllPoolsData = async () => {
    const query = gql`
    query GetAllPoolsData {
      utility(id: "0") {
        cTokenCount
      }
      pools(first: 640)
      {
        id
          address
          name
          index
          priceOracle
            assets{
            id
            symbol
            underlying{
              id
              symbol
            }
          }
      }
    }
    `
    return (await request(GRAPH_ENDPOINT, query))
}