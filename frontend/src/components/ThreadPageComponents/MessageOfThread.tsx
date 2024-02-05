import { Avatar, Badge, Box, Center, Flex, Text, Wrap, useDisclosure } from "@chakra-ui/react";
import { Message, User } from "../../types";
import UserModal from "../UserModal";

interface MessageProps {
    message: Message
    op: User
}
export default function MessageOfThread (props: MessageProps) {
    const { message, op } = props
    const time = new Date(message.created_time)
    const { isOpen, onOpen, onClose} = useDisclosure()
    return (
        <>
            <UserModal isOpen={isOpen} onOpen={onOpen} onClose={onClose} user={message.owner}></UserModal>
            <Flex id='message' minH='80px' borderBottom='1px' borderColor='gray.200' p='10px'>
                <Box _hover={{cursor: 'pointer'}} onClick={onOpen}><Avatar name={message.owner.username} size='lg' src={message.owner.image}/></Box>
                <Flex flexDirection={"column"} ml='20px'>
                    <Wrap>
                        <Text 
                            fontWeight="extrabold"
                            fontSize="20px"
                            mr='10px'
                            onClick={onOpen}
                            _hover={{textDecoration: 'underline', cursor: 'pointer', opacity: "1"}} opacity={0.7}
                        >
                            {message.owner.username}
                        </Text>
                        { op.username === message.owner.username &&<Center><Badge colorScheme="red" mr='10px'>Original poster</Badge></Center>}
                        <Center><Badge colorScheme="blue">{time.toLocaleString("ru", { hour: 'numeric', minute: 'numeric',})}</Badge></Center>
                    </Wrap>
                    <Text> 
                        {message.text}
                    </Text><br/>
                    {message.file[0]&& 
                    <Box backgroundColor='gray.100' p='1dvh' borderRadius='10px'>
                        {message.file.map(file=>
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