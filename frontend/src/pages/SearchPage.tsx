import { AddIcon } from "@chakra-ui/icons";
import { Center, Button, Flex, Text } from "@chakra-ui/react";
import ThreadsList from "../components/MainPageComponents/ThreadsList";
import { NavigatorUI } from "../components/NavigatorUI";
import TopBar from "../components/TopBar";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { instance } from "../utils/axiosInstance";
import { Location, useLocation } from "react-router-dom";
import { useContext, useEffect } from "react";
import { GlobalContext } from "../components/GlobalStorage";
import Statuses from "../components/Statuses";

export const fetchSearch = async (searchString: string) => {
    if (searchString !== '') {
        const resp = await instance.get('api/search/ajax/', {params: {name: searchString}})
        const rData = resp.data
        return rData
    }
    const data ={ emptySrting: true}
    return data
}

export default function SearchPage () {
    const location = useLocation()
    const { search } = useContext(GlobalContext)

    const { isLoading, data, isError }  = useQuery({ 
        queryKey: ['search_threads'], 
        queryFn: () => fetchSearch(search)
    })
    const client = useQueryClient()
    useEffect(()=>{
        client.fetchQuery({queryKey: ['search_threads']})
    },[search, ])
    if (data) {
    }
    return(
        <>
            <TopBar>
                <NavigatorUI curMain='Search results'/> 
            </TopBar>
            { data?.emptyString&&
             <h1>Введите название треда</h1>
            }
            <>
            {data && data.results &&  data.results.length > 0 &&
                <ThreadsList data={data.results}/>
            }
            {data && data.results &&  data.results.length === 0 &&
                <Statuses custom="Nothing was found"/>
            } 
            { isLoading&& <Statuses status="Loading"/>}
            { isError&& <Statuses status="Error"/>}
            </>
        </>
    )
}