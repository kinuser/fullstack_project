import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, UseDisclosureProps, useDisclosure } from "@chakra-ui/react";
import React, { useRef } from "react";
import LoginForm from "./LoginForm";
import RegistrationForm from "./RegistrationForm";

interface ModalProps {
    isOpen: boolean,
    onOpen: () => void,
    onClose: () => void

}

export default function RegisterModal (props: ModalProps) {
    const { isOpen, onOpen, onClose} = props
    const initialRef = useRef(null)
    return(
        <Modal isOpen={isOpen} onClose={onClose} initialFocusRef={initialRef}>
            <ModalOverlay />
                <ModalContent>
                <ModalHeader>Register</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <RegistrationForm initialRef={initialRef} onClose={onClose}/>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='blue' mr={3} type="submit" form="my_form">
                    Send
                    </Button>
                    <Button variant='ghost' onClick={onClose}>Close</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}