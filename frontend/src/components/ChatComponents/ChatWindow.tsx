import { Box, Center, Flex, Text } from "@chakra-ui/react";
import ChatMessage from "./ChatMessage";
import { SelectObject } from "../../pages/DialoguesPage";
import { instance } from "../../utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { ChatMessagePaginationResponse, ChatMessage as ChatMessageType } from "../../types";
import { useLocation } from "react-router-dom";

interface ChatWindowsProps {
  data: SelectObject
}

const fetchMessages = async (id: number | undefined) => {
  const data = (await instance.get<ChatMessagePaginationResponse>(`api/private/get/messages/${id}/`)).data
  return data
}

export default function ChatWindow (props:ChatWindowsProps) {
    const { data: chatData } = props

    const { data, isLoading, error} = useQuery({
      queryKey: ['dialogues', chatData.id], 
      queryFn: ()=>fetchMessages(chatData.id), 
      enabled: Boolean(chatData.id)
    })

    if (data) {
        return(
          <Flex id='Chat' borderRadius='10px' border='1px' borderColor='gray.200' height='80%' flexDirection='column-reverse' padding='20px' overflowY='scroll'>
            {data.results.map(mes=><ChatMessage data={mes} key={mes.id}/>)}
          </Flex> 
        )
    }

    return(
      <Flex justifyContent='center' alignItems='center' id='Chat' borderRadius='10px' border='1px' borderColor='gray.200' height='100%' padding='20px'>
        <Center>
          <Text fontWeight='bold' color='gray.600'>Select your chat</Text>
        </Center>
      </Flex> 
  )

}