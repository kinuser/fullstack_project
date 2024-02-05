import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import MessagesBlock from "../components/ThreadPageComponents/MessagesBlock";
import { NavigatorUI } from "../components/NavigatorUI";
import { MessagesPacket } from "../types";
import { instance } from "../utils/axiosInstance";
import { useLocation, useParams } from "react-router-dom";
import TopBar from "../components/TopBar";
import { Button, Flex, FormControl, FormErrorMessage, Icon, IconButton, Textarea } from "@chakra-ui/react";
import { BiSend, BiPaperclip } from "react-icons/bi";
import { useForm } from "react-hook-form";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import ThreadPageForm from "../components/ThreadPageComponents/ThreadPageForm";
import { AuthContext } from "../components/Authorization/Authorization";
import Statuses from "../components/Statuses";
import Buttons from "../components/Buttons";



const fetchMessages = async (id: string | undefined, page = 1) => {
    let data: MessagesPacket
    data = (await instance.get(`api/social/get/messages/${id}/?page=${page}`)).data
    return data
}





interface ThreadPageParams {
    threadId: string
}

export default function ThreadPage() {
    const params = useParams()
    const [curPage, setCurPage] = useState(1)
    const [totalPages, setTotalPages] = useState<number[]>()
    const { isLoading, data, isError }  = useQuery({ queryKey: ['thread_messages', curPage], queryFn: ()=>fetchMessages(params.threadId, curPage)})
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
    const { user } = useContext(AuthContext)
    const client = useQueryClient()
    const location = useLocation()
    useEffect(()=>{
        return ()=>client.removeQueries({ queryKey: [`thread_messages`] })
    }, [])
    return(
        <>
            { data&& 
                <>
                    <TopBar>
                        <NavigatorUI curMain='Main page'data={data.results.messages['0'].thread.name} location={location}/>
                    </TopBar>
                    <MessagesBlock data={data}/>
                    {user&& 
                        <ThreadPageForm params={params}/>
                    }
                    {totalPages&&
                        <Buttons pages={totalPages} onClick={setCurPage}/>
                    }
                </>
            }
            { isLoading&& <Statuses status="Loading"/>}
            { isError&& <Statuses status="Error"/>}
        </>
    )
}