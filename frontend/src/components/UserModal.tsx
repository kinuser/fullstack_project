import { Avatar, Button, Flex, FormControl, IconButton, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Textarea, useDisclosure, useOutsideClick } from "@chakra-ui/react"
import { User } from "../types";
import { BiPaperclip, BiSend } from "react-icons/bi";
import { useContext, useRef, useState } from "react";
import { AuthContext } from "./Authorization/Authorization";
import { useNavigate } from "react-router-dom";
import CreateDialogueForm from "./CreateDialogueForm";

interface UserModalProps {
    onOpen: () => void;
    onClose: () => void;
    isOpen: boolean;
    user: User
}

export default function UserModal (props: UserModalProps) {
        const { onClose, onOpen, isOpen, user } = props
        const navigate = useNavigate()        
        const [ isActive, setIsActive ] = useState(false)

        const { user: myUser } = useContext(AuthContext)
        const ref = useRef<HTMLInputElement>(null)

        useOutsideClick({
          ref: ref,
          handler: () => {
            setTimeout(()=>setIsActive(false), 200)
            
          }
        })

        return (
          <>
            <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
              <ModalOverlay/>
              <ModalContent ref={ref}>
                <ModalHeader>{user.username}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Avatar name={user.username} src={user.image}></Avatar>
                  {isActive&&
                    <CreateDialogueForm user2={user}/>
                  }
                </ModalBody>
                {!isActive&& 
                <ModalFooter>
                  {myUser?.username === user.username
                  ?
                  <Button colorScheme='blue' mr={3} onClick={()=>navigate('/profile/')}>
                    To my page
                  </Button>
                  :
                  <>
                    
                      <Button colorScheme='blue' mr={3} onClick={()=>setIsActive(true)}>
                        Write a message
                      </Button>
                    
                  </>
                  }
                </ModalFooter>
                }
              </ModalContent>
            </Modal>
          </>
        )
      }