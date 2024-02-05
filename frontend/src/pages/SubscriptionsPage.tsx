import { useQuery, useQueryClient } from "@tanstack/react-query";
import ThreadsList from "../components/MainPageComponents/ThreadsList";
import { instance } from "../utils/axiosInstance";
import { SubcriptionResponse, ThreadType, ThreadsResponse } from "../types";
import { NavigatorUI } from "../components/NavigatorUI";
import { useContext, useEffect } from "react";
import { AuthContext } from "../components/Authorization/Authorization";
import { useNavigate } from "react-router-dom";
import TopBar from "../components/TopBar";
import { Flex, Text } from "@chakra-ui/react";
import Statuses from "../components/Statuses";



const fetchSubscriptions = async () => {
    let data: SubcriptionResponse
    data = (await instance.get('api/subs/get/subs/',)).data
    return data
}



export default function SubscriptionsPage() {
    const { user } = useContext(AuthContext)
    const navigate = useNavigate()
    if (!user){
        navigate('/')
    }
    const { isLoading, data, isError }  = useQuery({ queryKey: ['subscriptions'], queryFn: fetchSubscriptions })
    const client = useQueryClient()
    useEffect(()=>{
        return ()=>client.removeQueries({queryKey: ['subscriptions',]})
    }, [])
    

    return (
        <>  
            { data && data.results.length > 0 &&
            <>  
                <TopBar>
                    <NavigatorUI data={'Subscriptions'} curMain='Main page'/>
                </TopBar>
                <ThreadsList data={data.results}/> 
            </>
            }
            { data && data.results.length === 0 &&
                <Flex justifyContent='center' alignItems='center' mt='20dvh'>
                    <Text fontWeight='bold' color='gray.500' fontSize='38px'>
                        You have no subscriptions
                    </Text>
                </Flex>
            }
            { isLoading&& <Statuses status="Loading"/>}
            { isError&& <Statuses status="Error"/>}
        </>
        
    )
}

export { SubscriptionsPage }