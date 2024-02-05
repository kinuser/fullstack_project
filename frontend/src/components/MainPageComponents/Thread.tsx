import { Avatar, Badge, Box, Center, Divider, Flex, Heading, IconButton, Popover, PopoverContent, PopoverTrigger, Spacer, Text, Wrap, useDisclosure } from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ThreadType } from "../../types";
import UserModal from "../UserModal";
import { AddIcon, CheckIcon, DeleteIcon } from "@chakra-ui/icons";
import { AuthContext } from "../Authorization/Authorization";
import { instance } from "../../utils/axiosInstance";

interface Props {
    thr: ThreadType
    new?: boolean
}

interface PostSubsData {
    thread: number
}

const postSubThreads = async (data: PostSubsData) => {
    const response = (await instance.post('api/subs/post/subs/', data))
    return response
}

export default function Thread(props:Props) {
    const { thr : thread, new: isNew } = props
    const { isOpen, onToggle, onClose } = useDisclosure()
    const lastMessageTime = new Date (thread.last_message.created_time)
    const ThreadTime = new Date (thread.created_time)
    const navigate = useNavigate()
    const { isOpen: modalIsOpen, onOpen: modalOnOpen, onClose: modalOnClose } = useDisclosure()
    const location = useLocation()
    const toThread = () => {
        navigate(`/thread/${thread.id}/`, {state: { fromSubs: 
            location.pathname === "/subscriptions/"
        }})
    }
    const { user } = useContext(AuthContext)
    const [isListened, setIsListened] = useState(false)

    useEffect(()=>{
        if (thread.listened) {
            setIsListened(true)
        }
    },[thread])

    const submit = () => {
        instance.post('api/subs/post/subs/', {thread: thread.id})
        .then((r)=>{
            if (r.status === 201) {
                setIsListened(true)
            }
        })
    }

    const deleteSub = () => {
        instance.delete('api/subs/delete/subs/', {data:{thread_id: thread.id}})
        .then((r)=>{
            if (r.status === 204) {
                setIsListened(false)
            }
        })
    }

    return(
        <>
        <UserModal onOpen={modalOnOpen} isOpen={modalIsOpen} onClose={modalOnClose} user={thread.original_poster}></UserModal>
        <Flex borderRadius={'10px'} justifyContent={"space-between"} w='100%' h={'50px'} mb='10px' border='1px' borderColor='gray.200' p='1dvh'>
            <Popover
            returnFocusOnClose={false}
            isOpen={isOpen}
            onClose={onClose}
            placement='top'
            closeOnBlur={false}
            >
                <PopoverTrigger>
                <Flex onMouseEnter={onToggle} onMouseLeave={onToggle}>
                    <Center>
                        <Heading fontSize={"36px"}
                            _hover={{textDecoration: 'underline', cursor: 'pointer'}}
                            onClick={toThread}
                        >{thread.name}</Heading>
                    </Center>
                </Flex>
                </PopoverTrigger>
                <PopoverContent>
                    <Box p='6'>
                        <Flex>
                            <Box pr={6}><Avatar name={thread.last_message.owner.username} size='md' src={thread.last_message.owner.image}></Avatar></Box>
                            <Flex flexFlow={'column'}>
                                <Text>{thread.last_message.text}</Text>
                                <Flex>
                                    <Center><Text pr='6'>{thread.last_message.owner.username}</Text></Center>
                                    <Center><Badge colorScheme="blue">{lastMessageTime.toLocaleString("ru", { hour: 'numeric', minute: 'numeric',})}</Badge></Center>
                                </Flex>
                            </Flex>
                        </Flex>
                    </Box>
                </PopoverContent>
            </Popover>
            <Spacer/>
            <Center>
                {isNew && <Badge mx={1} colorScheme="red">New message</Badge>}
            </Center>
            {user&&
                <Center>
                    {isListened
                    ?
                        <>
                            <IconButton
                                onClick={deleteSub}
                                colorScheme='red'
                                variant='outline'
                                aria-label="Delete thread from subscriptions"
                                size='xs'
                                icon={<DeleteIcon/>}
                            />
                        </>
                    :
                        <IconButton
                            onClick={submit}
                            colorScheme='blue'
                            variant='outline'
                            aria-label="Listen this thread"
                            size='xs'
                            icon={<AddIcon/>}
                        />
                    }

                </Center>
            }

            <Flex justifyContent={'space-between'} onClick={modalOnOpen} ml={'3dvh'} w={'15%'} id='AuthorBlock' opacity={0.7} _hover={{ opacity: "1", cursor: "pointer"}}>
                    <Center mx={1}>
                        <Avatar name={thread.original_poster.username} size={'sm'} src={thread.original_poster.image}></Avatar>
                    </Center>
                    <Center>
                    <Text mx={1} _hover={{textDecoration: 'underline', opacity: "1"}} opacity={0.7}>{thread.original_poster.username}</Text>
                    </Center>
                    <Center>
                            <Badge mx={1} colorScheme="blue">{ThreadTime.toLocaleString("ru", { hour: 'numeric', minute: 'numeric',})}</Badge>
                    </Center>
            </Flex>
        </Flex>
        </>
    )
}