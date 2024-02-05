import { Alert, AlertIcon, Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, UseDisclosureProps, useDisclosure } from "@chakra-ui/react";
import React, { useContext, useRef } from "react";
import LoginForm from "./LoginForm";
import { loginContext } from "./Navbar";

interface ModalProps {
    isOpen: boolean,
    onOpen: () => void,
    onClose: () => void
}

export default function LoginModal (props: ModalProps) {
    const { isOpen, onOpen, onClose} = props
    const initialRef = useRef(null)
    const { setIsAlert, isAlert} = useContext(loginContext)
    return(
        <Modal isOpen={isOpen} onClose={onClose} initialFocusRef={initialRef}>
            <ModalOverlay />
                <ModalContent>
                <ModalHeader>Login</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <LoginForm initialRef={initialRef} onClose={onClose}/>
                    { isAlert&&
                        <Alert status='success' mt='2dvh'>
                            <AlertIcon />
                            You was successfully registered! Just login with your credentials.
                        </Alert>
                    }
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='blue' mr={3} type="submit" form="my_form">
                    Login
                    </Button>
                    <Button variant='ghost' onClick={onClose}>Close</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}