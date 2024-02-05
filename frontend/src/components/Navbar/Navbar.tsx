import { BellIcon, ChatIcon } from "@chakra-ui/icons";
import { Avatar, Button, ButtonGroup, Center, Flex, IconButton, Image, Input, Menu, MenuButton, MenuItem, MenuList, Square, Text, Wrap, useDisclosure } from "@chakra-ui/react";
import React, { createContext, useContext, useState } from "react";
// import logo from '../images/simple_logo.png';
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import { Link, Link as ReactRouterLink, useLocation, useParams } from 'react-router-dom'
import { useNavigate, Outlet } from "react-router-dom";
import { AuthContext } from "../Authorization/Authorization";

import Search from "./Search";

interface LoginContextInterface {
    isAlert: boolean
    setIsAlert: any
    onCloseRegister: any
    onOpen: any
}

export const loginContext = createContext<LoginContextInterface>({
    isAlert: false,
    setIsAlert: ()=>{},
    onCloseRegister: ()=>{},
    onOpen: ()=>{}

})

const Navbar: React.FC = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { isOpen: isOpenR, onOpen: onOpenR, onClose: onCloseRegister} = useDisclosure()
    const navigate = useNavigate()
    const { user } = useContext(AuthContext)        
    const [ isAlert, setIsAlert ] = useState(false)

    return(
        <>  
            <loginContext.Provider value={{ isAlert, setIsAlert, onCloseRegister, onOpen }}>
                <LoginModal isOpen={isOpen} onOpen={onOpen} onClose={onClose}/>
                <RegisterModal isOpen={isOpenR} onOpen={onOpenR} onClose={onCloseRegister}/>
            </loginContext.Provider>
            <Flex py={2} justifyContent={"space-between"} px='8%' borderBottom='1px' borderColor='gray.50'>
                <Flex>
                    <Center
                        opacity={0.7}
                        _hover={{ 
                            cursor: "pointer",
                            backdropFilter: "auto",
                            opacity: "1"
                        }}
                        onClick={()=>navigate('/')}
                        mr='5'
                    >
                        {/* <Image 
                            src={logo}
                            w={8}
                            h={8}
                        /> */}
                        <Text
                            color={"black"} 
                            fontSize={32}
                            as="b"
                        >
                            forum
                        </Text>
                    </Center>
                    <Center mx="5">
                        <Menu isLazy>
                            <MenuButton 
                                color={"black"} 
                                fontSize={32}
                                opacity={0.7}
                                _hover={{ 
                                    cursor: "pointer",
                                    backdropFilter: "auto",
                                    opacity: "1"
                                }}
                            >
                                <Text 
                                    as="b"
                                    color={"black"} 
                                    fontSize={32}
                                >
                                    Rules
                                </Text>
                            </MenuButton>
                            <MenuList color={"black"}>
                                {/* MenuItems are not rendered unless Menu is open */}
                                <MenuItem>Public rules </MenuItem>
                                <MenuItem>User rules</MenuItem>
                            </MenuList>
                        </Menu>
                    </Center>
                    <Center mx="5">
                        <Text 
                            color={"black"} 
                            fontSize={32}
                            opacity={0.7}
                            as="b"
                            _hover={{ 
                                cursor: "pointer",
                                backdropFilter: "auto",
                                opacity: "1"
                            }}
                        >
                            FAQ
                        </Text>
                    </Center>
                </Flex>
                <Flex justifyContent={"flex-end"} w="50%">
                    <Center>
                        <Search/>
                        { user 
                        ?
                        <>
                            <Flex opacity={0.7} _hover={{ opacity: "1", cursor: "pointer"}} as={ReactRouterLink} mx='3dvh'to='/profile/'>
                                <Center mx={1}>
                                    <Avatar name={user.username} size={'sm'} {...(user.image && { src: user.image })}/>
                                </Center>
                                <Center>
                                    <Text mx={1} _hover={{textDecoration: 'underline', opacity: "1"}} opacity={0.7}>{user.username}</Text>
                                </Center>
                            </Flex>
                            <Flex>
                                <Center>
                                    <IconButton
                                        variant='outline'
                                        colorScheme='blue'
                                        aria-label='Chats'
                                        icon={<ChatIcon />}
                                        as={Link}
                                        to='/chats/'
                                    />
                                </Center>
                                <Center ml='0.5dvh'>
                                    <IconButton
                                        variant='outline'
                                        colorScheme='blue'
                                        aria-label='Alerts'
                                        icon={<BellIcon />}
                                        as={Link}
                                        to='/subscriptions/'
                                    />
                                </Center>
                            </Flex>
                        </>

                        :
                        <ButtonGroup isAttached variant='outline' colorScheme='blue' ml={10}>
                            <Button onClick={onOpen}>Login</Button>
                            <Button onClick={onOpenR}>Register</Button>
                        </ButtonGroup>
                        }

                    </Center>
                </Flex>
            </Flex>
            <Outlet/>
        </>
    )
}

export {Navbar}
    