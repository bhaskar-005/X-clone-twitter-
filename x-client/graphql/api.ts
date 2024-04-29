import {GraphQLClient} from 'graphql-request'

const isClient = typeof window !== 'undefined' && window
export const graphqlClient = new GraphQLClient(process.env.GQL_URL! ,{
    headers:{
        __token: isClient? `Bearer ${localStorage.getItem('__token')}`:''
    }
})