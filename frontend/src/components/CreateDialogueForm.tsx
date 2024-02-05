import { Flex, FormControl, Textarea, FormErrorMessage, IconButton } from "@chakra-ui/react"
import { useQueryClient, useMutation } from "@tanstack/react-query"
import { useRef } from "react"
import { useForm } from "react-hook-form"
import { BiPaperclip, BiSend } from "react-icons/bi"
import { Params, useNavigate, useParams } from "react-router-dom"
import { instance } from "../utils/axiosInstance"
import { Chat, User } from "../types"


const sendMessage = (values: ThreadPageFormInputs) => {
    return instance.post('api/private/create/thread/', values)
}

interface ThreadPageFormInputs {
    text: string
    file: FileList
    user2: number
}

interface CreateDialogueFormProps {
    user2: User
}

export default function CreateDialogueForm (props: CreateDialogueFormProps) {

    const { user2 } = props

    const {
        handleSubmit,
        register,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<ThreadPageFormInputs>()

    const textValidator = {
        required: 'This field is required',
        minLength: { value: 4, message: 'Minimum length should be 4' },
    }

    const navigate = useNavigate()
    const onSubmit = (values: ThreadPageFormInputs) => {
        const formData = new FormData()
        formData.append('user2', String(user2.id))
        formData.append('text', values.text)
        if (values.file) {
            const length = values.file.length
            let curLength: number = 0
            while (curLength <= length){
                formData.append('file', values.file[curLength])
                curLength ++
            }
        }

        instance.post<Chat>('api/private/create/thread/', formData)
        .then(r=>{
            navigate('/chats/', { state: {id: r.data.id}})
        })
        .catch(e=>{
            if (e.response && e.response.data.code === 'already_exist'){
                instance.post(`api/private/create/message/${e.response.data.id}/`, {
                    text: values.text
                })
                navigate('/chats/', { state: {
                    id: e.response.data.id
                }})
            }
            
        })
    }

    const textRef = useRef(null as any)
    const fileRef = useRef(null as any)
    const { ref: textRegRef, ...restTextReg } = register('text', textValidator);
    const { ref: fileRegRef, ...restFileReg } = register('file');

    return(
        <Flex id='Post form' justifyContent='center' bg='gray.50' p='20px' borderRadius='20px' my='5%' w='100%'>
                        <form style={{display: 'flex', width: '100%'}} onSubmit={handleSubmit(onSubmit)}>
                            <FormControl isInvalid={Boolean(errors.text)}>
                                <Textarea 
                                    borderRadius='10px' 
                                    height='100%'
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
                                <IconButton
                                    borderRadius='10px'
                                    variant='outline'
                                    colorScheme='blue'
                                    aria-label='Attach files'
                                    mb='1dvh'
                                    onClick={()=>fileRef.current.click()}
                                    icon={<BiPaperclip />}
                                    />  
                                <IconButton
                                    borderRadius='10px'
                                    variant='outline'
                                    colorScheme='blue'
                                    aria-label='Send message'
                                    icon={<BiSend />}
                                    type='submit'
                                    /> 
                            </Flex> 
                        </form>
                    </Flex>
    )
}