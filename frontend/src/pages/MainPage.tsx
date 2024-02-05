import { useQuery, useQueryClient } from "@tanstack/react-query";
import ThreadsList from "../components/MainPageComponents/ThreadsList";
import { instance } from "../utils/axiosInstance";
import { ThreadsResponse } from "../types";
import { NavigatorUI } from "../components/NavigatorUI";
import { Button, Center, useDisclosure, Text, Flex, Box } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import TopBar from "../components/TopBar";
import CreateThreadModal from "../components/MainPageComponents/CreateThreadModal";
import { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../components/Authorization/Authorization";
import Statuses from "../components/Statuses";
import Buttons from "../components/Buttons";


const fetchLastThreads = async (page = 1) => {
    let data: ThreadsResponse
    const response = await instance.get(`api/social/get/last_threads/?page=${page}`)
    data = response.data
    return data
}






export default function MainPage() {

    const [ isEnabled, setIsEnabled ] = useState(false)
    const [ curPage, setCurPage ] = useState(1)
    const { isLoading, data, isError }  = useQuery({ 
        queryKey: ['last_threads', curPage], 
        queryFn: ()=> fetchLastThreads(curPage),
        // enabled: isEnabled
    })
    const { isOpen, onOpen, onClose } = useDisclosure()

    const { user } = useContext(AuthContext)

    const client = useQueryClient()

    useEffect(()=>{
        client.invalidateQueries({
            queryKey: ['last_threads', ]
        })
    }, [user])
    const [totalPages, setTotalPages] = useState<number[]>()

    useMemo(()=>{
        if (data && data.count > 20){
            let totalPagesVar = Math.floor(data.count / 20)
            if (data.count % 20 > 0) {
                totalPagesVar ++
            }
            let i = 1
            let pagesArray: number[] = []
            while (i <= totalPagesVar){
                pagesArray.push(i)
                i++
            }
            setTotalPages(pagesArray)
        }
    }, [data])


    return (
        <>  
            { data&& 
            <>  
                <CreateThreadModal isOpen={isOpen} onClose={onClose} onOpen={onOpen}/>
                <TopBar>
                    <NavigatorUI curMain="Main page"/>
                    {user&&
                        <Center>
                            <Button onClick={onOpen} variant='outline' colorScheme='blue' rightIcon={<AddIcon/>}>Create new thread</Button>
                        </Center>
                    }   
                </TopBar>
                <ThreadsList data={data.results}/> 
            </>
            }
            {totalPages&& <Buttons 
                pages={totalPages}
                onClick={setCurPage}
            />}
            { isLoading&& <Statuses status="Loading"/>}
            { isError&& <Statuses status="Error"/>}
        </>
        
    )
}