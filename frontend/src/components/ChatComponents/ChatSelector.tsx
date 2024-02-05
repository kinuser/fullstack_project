import { Flex, Avatar, Text, background } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { SelectObject } from "../../pages/DialoguesPage";
import { ChatMeta, User } from "../../types";
import { AuthContext } from "../Authorization/Authorization";

interface ChatSelectorProps {
    listId: number,
    select: SelectObject
    setSelect: React.Dispatch<React.SetStateAction<SelectObject>>
    data: ChatMeta
}

export default function ChatSelector (props: ChatSelectorProps) {
    const { user } = useContext(AuthContext)
    const [ otherUser, setOtherUser ] = useState<User>()
    useEffect(()=>{
        if (data.thread.user1.username === user?.username) {
            setOtherUser(data.thread.user2)
        } else {
            setOtherUser(data.thread.user1)
        }
    }, [])

    const { setSelect, select, listId, data } = props

    const unSelectedProps = {
        _hover: {bg: 'gray.200', cursor: 'pointer'}
    }
    const selectedProps = {
        bg: 'gray.200',
        _hover: { cursor: 'pointer'}
    }

    const changeSelection = () => {
        if ((typeof(select.id) === 'number') && select.id === listId) {
            setSelect({id: undefined, isSelect: false}) 
        } else if (typeof(select.id) === 'undefined') {
            setSelect({id: listId, isSelect: true})
        } else if ((typeof(select.id) === 'number') && select.id !== listId) {
            setSelect({id: listId, isSelect: true})
        }
    }

    if (select.id === listId) {
        return (
            <Flex id='Chat' borderRadius='10px' border='1px' borderColor='gray.200' p='5px' mb='0.5dvh' 
            {...selectedProps}
            onClick={changeSelection}
            >
                {otherUser && 
                    <>
                        <Avatar name={otherUser.username} src={otherUser.image} size='md'></Avatar>
                        <Flex flexDir='column' ml='2%'>
                            <Text fontWeight='bold'>{otherUser.username}</Text>
                            <Text color='gray.700' noOfLines={1} >{data.thread.last_message.owner.username === user?.username && 'Вы: ' }{ data.thread.last_message.text}</Text>
                        </Flex>
                    </>
                }

            </Flex>
        )
    }
    return (
        <Flex id='Chat' borderRadius='10px' border='1px' borderColor='gray.200' p='5px' mb='0.5dvh'
        {...unSelectedProps}
        onClick={changeSelection}
        >
            {otherUser && 
                <>
                    <Avatar name={otherUser.username} src={otherUser.image} size='md'></Avatar>
                    <Flex flexDir='column' ml='2%'>
                        <Text fontWeight='bold'>{otherUser.username}</Text>
                        <Text color='gray.700' noOfLines={1} >{data.thread.last_message.owner.username === user?.username && 'Вы: ' }{ data.thread.last_message.text}</Text>
                    </Flex>
                </>
            }
        </Flex>
    )
    
}