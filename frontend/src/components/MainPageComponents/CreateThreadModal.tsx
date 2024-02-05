import { useDisclosure, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Text, Textarea, Input, FormControl, FormLabel, FormErrorMessage, Flex, IconButton, Center } from "@chakra-ui/react"
import { useForm } from "react-hook-form"
import { instance } from "../../utils/axiosInstance"
import { useNavigate, useParams } from "react-router-dom"
import { useRef } from "react"
import { BiPaperclip, BiSend } from "react-icons/bi"

interface CreateThreadModalProps {
    isOpen: boolean
    onOpen: ()=>void
    onClose: ()=>void
}

interface CreateThreadModalFormInputs {
  [index: string]: any
  text: string
  name: string
  file?: FileList
}



export default function CreateThreadModal (props: CreateThreadModalProps) {
  const { isOpen, onOpen, onClose} = props
  const params = useParams()
  const navigate = useNavigate()
  const {
    handleSubmit,
    register,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateThreadModalFormInputs>()

  const postThread = (values: CreateThreadModalFormInputs | FormData) => {
    instance.post('api/social/create/thread/', values)
      .then(r=>{
        navigate(`thread/${r.data.id}/`)
      })
  }

  const nameValidator = {
    minLength: { value: 4, message: 'Minimal length is 4'},
    required: 'This field is required'
  }
  const textValidator = {
    minLength: { value: 4, message: 'Minimal length is 4'},
    required: 'This field is required'
  }

  const onSubmit = (values: CreateThreadModalFormInputs) => {
    const formData = new FormData()
      if (values.file?.length === 0) {
          postThread(values)
      } else if (values.file?.length && values.file?.length > 0){
          const length = values.file.length
          let curLength: number = 0
          while (curLength <= length){
              formData.append('file', values.file[curLength])
              curLength ++
          }
          delete values.file
          for (var key in values){
              formData.append(`${key}`, values[key])
          }
          postThread(formData)
      }
      textRef.current.value = ''
      fileRef.current.value = ''
    
    
  }
  const { ref: textRegRef, ...restTextReg } = register('text', textValidator);
  const { ref: fileRegRef, ...restFileReg } = register('file');
  const textRef = useRef(null as any)
  const fileRef = useRef(null as any)
  return (
    <>  
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create thread</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit(onSubmit)} id="cr_thread" style={{display: 'flex'}}>
              <Flex flexDir='column' width='100%'>
              <FormControl isInvalid={Boolean(errors.name)}>
                <FormLabel>
                  Name of thread
                </FormLabel>
                <Input
                  {...register('name', nameValidator)}
                >
                </Input>
                { errors.name && <FormErrorMessage>{errors.name.message}</FormErrorMessage>}
              </FormControl>
              <FormControl isInvalid={Boolean(errors.text)}>
              <FormLabel>
                  Your message
                </FormLabel>
                <Textarea 
                  borderRadius='10px' 
                  height='80%'
                  {...restTextReg}
                  ref={(e) => {
                      textRegRef(e)
                      textRef.current = e 
                  }}
                />
                {errors.text && <FormErrorMessage>{errors.text.message}</FormErrorMessage>}
              </FormControl>
              <Flex flexDir='column' justifyContent='end' ml='1dvh'>
                <FormControl>
                  <input 
                    type='file' 
                    style={{ display: 'none' }} 
                    multiple
                    {...restFileReg}
                    ref={(e) => {
                        fileRegRef(e)
                        fileRef.current = e 
                    }}
                  />
                </FormControl>
              </Flex>
            </Flex>
            </form>             
          </ModalBody>

          <ModalFooter>

            <Center>
              <IconButton
                borderRadius='10px'
                colorScheme='blue'
                aria-label='Attach files'
                onClick={()=>fileRef.current.click()}
                mr={3}
                icon={<BiPaperclip />}
              /> 
            </Center>
            <Button type="submit" form='cr_thread' colorScheme='blue' mr={3} >Send</Button>
            <Button colorScheme='red' onClick={onClose}>
              Close
            </Button>
            
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}