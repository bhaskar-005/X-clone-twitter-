import { graphqlClient } from "@/graphql/api"
import { getAllTweets } from "@/graphql/query/user"
import { useQuery,useMutation, QueryClient, useQueryClient } from "@tanstack/react-query"
import {createTweet} from '@/graphql/mutation/createTweet'
import { CreateTweetInput, } from "@/gql/graphql"
import toast from "react-hot-toast"

export const useTweets = ()=>{
  const res = useQuery(
    {
        queryKey: ['tweets'],
        queryFn: ()=> graphqlClient.request(getAllTweets)
    })  
    return {...res, tweets:res.data?.getAllTweets}
}

export const useCreateTweet = ()=>{
    const queryClient = useQueryClient(); 
    let toastId;
    const res = useMutation({
        mutationFn: (payload:CreateTweetInput) => graphqlClient.request(createTweet ,{payload}),
        onMutate: ()=> toastId = toast.loading('createing..'),
        onError:(error)=>{
            toast.dismiss(toastId!);
            toast.error(`${error.stack?.slice(6,45)}`)
        },
        onSuccess: ()=> {
            queryClient.invalidateQueries({queryKey:['tweets']});
            toast.dismiss(toastId!);
            toast.success('created.');
        },
    })
    return res;
}