import { graphqlClient } from "@/graphql/api"
import { getCurrentUserQuery, getUserById } from "@/graphql/query/user"
import { useQuery } from "@tanstack/react-query"

export const useCurrentUser = ()=>{
    const query = useQuery({
        queryKey: ['currentUser'],
        queryFn: ()=>graphqlClient.request(getCurrentUserQuery)
    })
    return{...query,user:query.data?.getCurrentUser}
}

export const useGetUserbyId = ({id}:{id:string})=>{
    const query = useQuery({
        queryKey:['user-by-id'],
        queryFn:()=>graphqlClient.request(getUserById,{id:id})
    })
    return{...query,user:query.data?.getUserById}
  }