import { FormControl, FormErrorMessage, FormLabel, Input, Text } from "@chakra-ui/react";
import axios from "axios";
import { useContext, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { AuthContext } from "../Authorization/Authorization";

interface Inputs {
    username: "string",
    password: "string"
}

interface LoginFormProps {
    initialRef: React.MutableRefObject<null>,
    onClose: ()=> void
}

interface RespData {
    access: string
    refresh: string
}

export default function LoginForm(props: LoginFormProps) {
    const {initialRef, onClose} = props
    const [ serverError, setServerError ] = useState<string | undefined>()
    const { user, setUser, tokens, setTokens }  = useContext(AuthContext)
    const {
        handleSubmit,
        register,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<Inputs>()

    const usernameValidator = {
        required: { value: true, message: "Required field"},
        maxLength: { value: 30, message: "Less than 30 symbols"},
    }
    const passwordValidator = {
        required: { value: true, message: "Required field"},
        maxLength: { value: 40, message: "Less than 40 symbols"}
    }

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        axios.post<RespData>('http://127.0.0.1:8000/api/user/login/', data)
        .then(r=>{
            setTokens(r.data)
            onClose()
        })
        .catch(error=>{
            if (error.response && error.response.status === 403) {
                setServerError('Username or password are incorrect')
            }
        })


    }

    return (
        <form id="my_form" onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={Boolean(errors.username || serverError)}>
                <FormLabel>Username</FormLabel>
                <Input
                    {...register("username", usernameValidator)}
                />
                {errors.username && <FormErrorMessage>{errors.username.message}</FormErrorMessage>}
            </FormControl>

            <FormControl mt={6} isInvalid={Boolean(errors.password || serverError)}>
                <FormLabel>Password</FormLabel>
                <Input
                    type='password'
                    {...register("password", passwordValidator)}
                />
                {errors.password && <FormErrorMessage>{errors.password.message}</FormErrorMessage>}
                {serverError && <FormErrorMessage>{serverError}</FormErrorMessage>}
            </FormControl>
            
        </form>
    )
}