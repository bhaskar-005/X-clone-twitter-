import {GraphQLClient} from 'graphql-request'

const isClient = typeof window !== 'undefined' && window
export const graphqlClient = new GraphQLClient('http://localhost:8000/graphql',{
    headers:{
        __token: isClient? `Bearer ${localStorage.getItem('__token')}`:''
    }
})