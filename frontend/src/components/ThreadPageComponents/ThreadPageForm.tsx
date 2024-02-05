import { Flex, FormControl, Textarea, FormErrorMessage, IconButton, Input } from "@chakra-ui/react"
import { useQueryClient, useMutation } from "@tanstack/react-query"
import { useRef } from "react"
import { useForm } from "react-hook-form"
import { BiPaperclip, BiSend } from "react-icons/bi"
import { instance } from "../../utils/axiosInstance"
import { Params, useParams } from "react-router-dom"
import FileInput from "./FileInput"


const sendMessage = (values: ThreadPageFormInputs | FormData) => {
    return instance.post('api/social/create/message/', values, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }}
    )
}

interface ThreadPageFormInputs {
    [index: string]: any
    text: string
    thread?: string
    file?: FileList
}

interface ThreadPageFormProps {
    params: Readonly<Params<string>>
}

export default function ThreadPageForm (props:ThreadPageFormProps) {

    const { params } = props

    const client = useQueryClient()

    const mutation = useMutation({
        mutationFn: (values: ThreadPageFormInputs | FormData)=>sendMessage(values),
        onSuccess: ()=>{
            client.invalidateQueries({
                queryKey: ['thread_messages', ]
            })
        }
    })

    const {
        handleSubmit,
        register,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<ThreadPageFormInputs>()

    const textRef = useRef(null as any)
    const fileRef = useRef(null as any)
    const textValidator = {
        required: 'This field is required',
        minLength: { value: 4, message: 'Minimum length should be 4' },
    }
    const { ref: textRegRef, ...restTextReg } = register('text', textValidator);
    const { ref: fileRegRef, ...restFileReg } = register('file');

    const onSubmit = (values: ThreadPageFormInputs) => {
        const formData = new FormData()
        if (values.file?.length === 0) {
            values.thread = params.threadId
            mutation.mutate(values)
        } else if (values.file?.length && values.file?.length > 0){
            const length = values.file.length
            let curLength: number = 0
            while (curLength <= length){
                formData.append('file', values.file[curLength])
                curLength ++
            }
            delete values.file
            values.thread = params.threadId
            for (var key in values){
                formData.append(`${key}`, values[key])
            }
            mutation.mutate(formData)
        }
        textRef.current.value = ''
        fileRef.current.value = ''
    }


    return(
        <Flex id='Post form' justifyContent='center' mx='10%' bg='gray.50' p='20px' borderRadius='20px' my='1%'>
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