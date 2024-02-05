import { Alert, AlertIcon, FormControl, FormErrorMessage, FormLabel, Input, Portal, Text } from "@chakra-ui/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { instance } from "../../utils/axiosInstance";
import { useContext, useState } from "react";
import { loginContext } from "./Navbar";

interface Inputs {
    username: "string",
    // email: "string",
    password: "string"
}

interface Props {
    initialRef: React.MutableRefObject<null>,
    onClose: ()=>void


}
export default function RegistrationForm(props: Props) {
    const {initialRef, onClose} = props
    const { setIsAlert, isAlert, onOpen} = useContext(loginContext)
    const {
        handleSubmit,
        register,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<Inputs>()

    const userNameValidator = {
        required: { value: true, message: "Required field"},
        maxLength: { value: 10, message: "No more than 10 symbols"},
        pattern: { value: /^[a-zA-Z\-]+$/, message: "Nickname must consist from simple symbols"}
    }

    const passwordValidator = {
        required: { value: true, message: "Required field"},
        maxLength: { value: 40, message: "No more than 10 symbols"}
    }

    

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        instance.post('api/user/register/', data)
        .then(r=>{
            if (r.status === 201) {
                setIsAlert(true)
                onOpen()
                onClose()
            }
        })
    }

    return (
        <>
            <form id="my_form" onSubmit={handleSubmit(onSubmit)}>
                <FormControl isInvalid={Boolean(errors.username)}>
                    <FormLabel>Username</FormLabel>
                    <Input
                        placeholder="Unique username, no more than 10 simple symbols"
                        {...register("username", userNameValidator)}
                    />
                    {errors.username && <FormErrorMessage>{errors.username.message}</FormErrorMessage>}
                </FormControl>

                <FormControl mt={6} isInvalid={Boolean(errors.password)}>
                    <FormLabel>Passowrd</FormLabel>
                    <Input
                        type='password'
                        placeholder="No more than 40 symbols"
                        {...register("password", passwordValidator)}
                    />
                    {errors.password && <FormErrorMessage>{errors.password.message}</FormErrorMessage>}
                </FormControl>
            </form>
        </>
    )
}