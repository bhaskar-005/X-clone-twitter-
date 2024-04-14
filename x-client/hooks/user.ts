import { graphqlClient } from "@/graphql/api"
import { getCurrentUserQuery } from "@/graphql/query/user"
import { useQuery } from "@tanstack/react-query"
import { GraphQLClient } from "graphql-request"

export const useCurrentUser = ()=>{
    const query = useQuery({
        queryKey: ['currentUser'],
        queryFn: ()=>graphqlClient.request(getCurrentUserQuery)
    })
    return{...query,user:query.data?.getCurrentUser}
}