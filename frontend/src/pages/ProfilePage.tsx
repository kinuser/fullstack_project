import { Alert, AlertIcon, Avatar, Box, Button, Flex, FormControl, FormErrorMessage, FormLabel, Input } from "@chakra-ui/react";
import { Navbar } from "../components/Navbar/Navbar";
import { useContext, useRef, useState } from "react";
import { AuthContext } from "../components/Authorization/Authorization";
import { SubmitHandler, useForm } from "react-hook-form";
import { instance } from "../utils/axiosInstance";
import { MyUser } from "../types";
import { logout } from "../components/Hooks/Logout";
import { useNavigate } from "react-router-dom";

interface MyUserInputs {
    [index: string]: any
    username?: string
    first_name?: string
    last_name?: string
    email?: string
    image?: FileList
}

export default function ProfilePage() {
    const { user, setUser, setTokens } = useContext(AuthContext)
    const navigate = useNavigate()

    const {
        handleSubmit,
        register,
        formState: { errors },
        setError,
    } = useForm<MyUserInputs>()

    const usernameValidator = {
        required: { value: true, message: "Необходимое поле"},
        maxLength: { value: 30, message: "Не больше 30 символов"},
    }

    const emailValidator = {
        maxLength: { value: 30, message: "Не больше 30 символов"},
        pattern: { value: /^[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*@[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*$/gm, message: "Введите правильный email"}
    }

    const firstNameValidator = {
        maxLength: { value: 50, message: "Не больше 50 символов"},
    }

    const lastNameValidator = {
        maxLength: { value: 50, message: "Не больше 50 символов"},
    }
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files) {
            const url = URL.createObjectURL(e.target.files[0])
            setFile(url)
        }
        
    }
    const { ref: fileRegRef, ...restFileReg } = register('image', {onChange: (e)=>handleFileChange(e)})
    const fileRef = useRef(null as any)
    const onSubmit = (data: MyUserInputs) => {
        const formData = new FormData()
        if (data.image?.length === 0) {
            delete data.image
            for (var key in data) {
                formData.append(`${key}`, data[key])
            }
        } else if (data.image?.length && data.image.length > 0) {
            const image = data.image[0]
            delete data.image
            for (var key in data) {
                formData.append(`${key}`, data[key])
            }
            formData.append(`image`, image)
        }

        

        instance.patch<MyUser>('api/user/myuser/', formData)
        .then(r=>{
            setUser(r.data)
            setServerError(1)
        })
        .catch(error=>{
            setServerError(2)
            if(error.response.data.username) {
                setError('username', { message: 'Username was already taken' });
            }
        })
    }
    const [file, setFile] = useState<string>()
    const [ serverError, setServerError] = useState<number>()
    if (user) {
        return(
            <>  {user&& 
                <Flex width='72%' p={12} justifyContent='center' bg='gray.50' mx='14% ' mt='10px' borderRadius='20px'>
                    <Flex direction='column' mr='5%'>
                        { file
                        ?    <Avatar name={user.username} src={file} size='2xl' ></Avatar>
                        :    <Avatar name={user.username} src={user.image as string} size='2xl' ></Avatar>
                        }
                        <Button colorScheme="blue" mt='1%' variant='outline' onClick={()=>fileRef.current.click()}>Upload image</Button>
                    </Flex>
                        <form id="my_form" onSubmit={handleSubmit(onSubmit)}>
                            <FormControl isInvalid={Boolean(errors.username)}>
                                <FormLabel>Username</FormLabel>
                                <Input
                                    defaultValue={user.username}
                                    {...register("username", usernameValidator)}
                                />
                                {errors.username && <FormErrorMessage>{errors.username.message}</FormErrorMessage>}
                            </FormControl>
    
                            <FormControl mt={2} isInvalid={Boolean(errors.first_name)}>
                                <FormLabel>First name</FormLabel>
                                <Input
                                    defaultValue={user.first_name}
                                    {...register("first_name", firstNameValidator)}
                                />
                                {errors.first_name && <FormErrorMessage>{errors.first_name.message}</FormErrorMessage>}
                            </FormControl>
    
                            <FormControl mt={2} isInvalid={Boolean(errors.last_name)}>
                                <FormLabel>Last name</FormLabel>
                                <Input
                                    defaultValue={user.last_name}
                                    {...register("last_name", lastNameValidator)}
                                />
                                {errors.first_name && <FormErrorMessage>{errors.first_name.message}</FormErrorMessage>}
                            </FormControl>
                    
    
                            <FormControl mt={2} isInvalid={Boolean(errors.first_name)}>
                                <FormLabel>Email</FormLabel>
                                <Input
                                    defaultValue={user.email}
                                    {...register('email', emailValidator)}
                                />
                                {errors.email && <FormErrorMessage>{errors.email.message}</FormErrorMessage>}
                            </FormControl>
    
                            <FormControl mt={2} isInvalid={Boolean(errors.image)} display='none'>
                                <Input
                                    type='file'
                                    {...restFileReg}
                                    ref={(e) => {
                                        fileRegRef(e)
                                        fileRef.current = e 
                                    }}
                                />
                                {errors.image && <FormErrorMessage>{errors.image.message}</FormErrorMessage>}
                            </FormControl>
                            <Flex mt='2dvh'>
                                <Button type="submit" colorScheme="blue" variant='outline' width="100%">
                                    Change info 
                                </Button>
                                <Button colorScheme="red" variant='outline' width="100%" onClick={()=>logout(setUser, setTokens)}>
                                    Logout
                                </Button>
                            </Flex>
                            {serverError&& serverError === 1&&
                                <Alert status='success' variant='subtle' mt='2dvh'>
                                    <AlertIcon />
                                    Data uploaded to the server. Fire on!
                                </Alert>
                            }
                            {serverError&& serverError === 2&&
                                <Alert status='error' variant='subtle' mt='2dvh'>
                                    <AlertIcon />
                                    Ooops... Something went wrong!
                                </Alert>
                            }
                            
                        </form>
                        
                </Flex>
                }
            </>
            
    
        )
    } else {
        navigate('/')
        return(<></>)
    }
    
    
}