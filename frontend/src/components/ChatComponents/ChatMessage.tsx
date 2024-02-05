import { Flex, Avatar, Text, useDisclosure, Box } from "@chakra-ui/react";
import { ChatMessage as ChatMessageType} from "../../types";
import UserModal from "../UserModal";
import { useEffect } from "react";

interface ChatMessageProps {
    data: ChatMessageType
}

export default function ChatMessage (props: ChatMessageProps) {
    const { isOpen, onOpen, onClose} = useDisclosure()
    const { data: message } = props
    const time = new Date(message.created_time)
    return(
        <>
            <UserModal user={message.owner} isOpen={isOpen} onOpen={onOpen} onClose={onClose}/>
            <Flex _hover={{bg: 'gray.100'}} p='10px' borderRadius='10px'>
                <Avatar name={message.owner.username} src={message.owner.image} size='md'
                _hover={{cursor: 'pointer'}}
                onClick={onOpen}
                />
                <Flex flexDir='column' ml='1dvh'>
                    <Flex>
                        <Text fontWeight='bold'>{message.owner.username}</Text>
                        <Text color='gray.500' ml='1dvh'>{time.toLocaleString("ru", { hour: 'numeric', minute: 'numeric',})}</Text>
                    </Flex>
                    <Text color='gray.700'>
                        {message.text}
                    </Text>
                    {message.file[0]&&
                        <Box backgroundColor='gray.100' p='1dvh' borderRadius='10px'>
                        { message.file.map(file=>
                                <>  
                                    <Box as='a' href={file.file} target="_blank" _hover={{bg: 'gray.200'}} borderRadius='10px' py='2px' px='5px'>
                                        {file.file.split('/').reverse()[0]}
                                    </Box><br/>
                                </>
                                )}
                        </Box>
                    }
                </Flex>
            </Flex>
        </>
    )
}