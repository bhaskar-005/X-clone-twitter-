import {GraphQLClient} from 'graphql-request'

const isClient = typeof window !== 'undefined' && window
export const graphqlClient = new GraphQLClient('https://x-clone-twitter.onrender.com/graphql' ,{
    headers:{
        __token: isClient? `Bearer ${localStorage.getItem('__token')}`:''
    }
})