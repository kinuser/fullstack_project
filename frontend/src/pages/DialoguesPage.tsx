import { ReactNode, useContext, useEffect, useState } from "react"
import { NavigatorUI } from "../components/NavigatorUI"
import ThreadsList from "../components/MainPageComponents/ThreadsList"
import { Avatar, Box, Flex, IconButton, Text, Textarea } from "@chakra-ui/react"
import ChatSelector from "../components/ChatComponents/ChatSelector"
import { instance } from "../utils/axiosInstance"
import { ChatMeta } from "../types"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import ChatMessage from "../components/ChatComponents/ChatMessage"
import { AuthContext } from "../components/Authorization/Authorization"
import { useLocation, useNavigate } from "react-router-dom"
import ChatWindow from "../components/ChatComponents/ChatWindow"
import TopBar from "../components/TopBar"
import { BiPaperclip, BiSend } from "react-icons/bi"
import SendComp from "../components/ChatComponents/SendComp"

export interface SelectObject {
    id: number | undefined
    isSelect: boolean
}


const FetchDialogues = async () => {
    const data = (await instance.get<ChatMeta[]>('api/subs/get/dialogues/')).data
    return data
}

const DialoguesPage: React.FC = () => {
    
    const { user } = useContext(AuthContext)
    const navigate = useNavigate()
    if (!user){
        navigate('/')
    }
    let selection: SelectObject = {id: undefined, isSelect: false}
    const [ select, setSelect ] = useState(selection)
    let location = useLocation()


    const { data, isLoading, error} = useQuery({queryKey: ['dialogues'], queryFn: FetchDialogues})
    const client = useQueryClient()

    useEffect(()=>{
        if(location.state?.id){
            setSelect({
                id: location.state.id, 
                isSelect: true,
            })
        }
        return client.removeQueries({queryKey: ['dialogues', ]})
    }, [])
    
    return(
        <>
            <TopBar>
                <NavigatorUI curMain='Chats '/>
            </TopBar>
            
            <Flex width='80%' borderRadius='20px' p='10px'  bg='gray.50' mx='10%' h='80dvh'>
                <Flex id='Chats column' flexDir='column' width='30%' overflowY='scroll'>
                    { data && data.map(dial=><ChatSelector listId={dial.thread.id} select={select} setSelect={setSelect} data={dial}/>)}
                </Flex>
                <Flex w='100%' flexDir='column'>
                    <ChatWindow data={select}/>
                    { select.id &&
                        <SendComp data={select}/>
                    }
                    
                </Flex>
            </Flex>
        </>
    )
}

export { DialoguesPage }