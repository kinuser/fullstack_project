import { ComponentWithAs, Flex, FormControl, FormErrorMessage, IconButton, Textarea, TextareaProps } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BiPaperclip, BiSend } from "react-icons/bi";
import { instance } from "../../utils/axiosInstance";
import { SelectObject } from "../../pages/DialoguesPage";
import { useForm } from "react-hook-form";
import { useEffect, useRef } from "react";

const sendMessage = async (id: number, values: any) => {
    return instance.post(`api/private/create/message/${id}/`, values)
}

interface SendCompProps {
    data: SelectObject
}

interface SendCompFormInputs {
    text: string
    file: string
}

interface UseMutationSendCompParams {
    id: number
    values: any
}

export default function SendComp (props: SendCompProps) {
    const { data } = props
    const {
        handleSubmit,
        register,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<SendCompFormInputs>()

    const textValidator = {
        required: 'This field is required',
        minLength: { value: 4, message: 'Minimum length should be 4' },
    }

    const client = useQueryClient()

    const mutation = useMutation({
        mutationFn: (data: UseMutationSendCompParams)=>sendMessage(data.id, data.values),
        onSuccess: ()=>{
            client.invalidateQueries({
                queryKey: ['dialogues', ]
            })
        }
    })

    const onSubmit = (values: any) => {
        const formData = new FormData()
        if (!values.file && data.id) {
            mutation.mutate({
                id: data.id,
                values: values
            })

        } else if (values.file && data.id){
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
            mutation.mutate({
                id: data.id,
                values: formData
            })
        }
        textRef.current.value = ''
        fileRef.current.value = ''
    }


    const textRef = useRef(null as any)
    const fileRef = useRef(null as any)
    const { ref: textRegRef, ...restTextReg } = register('text', textValidator);
    const { ref: fileRegRef, ...restFileReg } = register('file');

    return (
        <Flex id='Send section' borderColor='gray.200' width='100%' height='20%'  padding='20px'>
            <form onSubmit={handleSubmit(onSubmit)} style={{width: '100%', display: 'flex'}}>
                <FormControl isInvalid={Boolean(errors.text)}>
                    <Textarea 
                        borderRadius='10px' 
                        height='100%'
                        {...restTextReg}
                        ref={(e) => {
                            textRegRef(e)
                            textRef.current = e // you can still assign to ref
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
                        type="submit"
                        borderRadius='10px'
                        variant='outline'
                        colorScheme='blue'
                        aria-label='Send message'
                        icon={<BiSend />}
                    />
                </Flex> 
            </form>
        </Flex>
    )
}