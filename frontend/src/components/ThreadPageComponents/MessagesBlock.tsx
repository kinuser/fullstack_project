import { Flex } from "@chakra-ui/react";
import MessageList from "../MessageList";
import MessageOfThread from "./MessageOfThread";
import { MessagesPacket } from "../../types";

interface MessageBlockProps {
    data: MessagesPacket
}

export default function MessagesBlock (props: MessageBlockProps) {
    const { messages: messageList, op } = props.data.results

    return(
        <Flex justifyContent='center' mx='10%' bg='gray.50' id='mainContainer' p='10px' borderRadius='20px' px='20px'>
            <MessageList>
                {messageList.map(message=><MessageOfThread message={message} key={message.id} op={op}/>)}
            </MessageList>
        </Flex>
    )
}