import { FormControl, FormErrorMessage, FormLabel, Input, Text } from "@chakra-ui/react";
import axios from "axios";
import { SubmitHandler, useForm } from "react-hook-form";

interface Inputs {
    email: "string",
    password: "string"
}

interface Props {
    initialRef: React.MutableRefObject<null>,

}
export default function LoginFormWithEmail(props: Props) {
    const {initialRef} = props
    const {
        handleSubmit,
        register,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<Inputs>()

    const emailValidator = {
        required: { value: true, message: "Необходимое поле"},
        maxLength: { value: 30, message: "Не больше 30 символов"},
        pattern: { value: /^[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*@[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*$/gm, message: "Введите правильный email"}
    }
    const passwordValidator = {
        required: { value: true, message: "Необходимое поле"},
        maxLength: { value: 40, message: "Не больше 40 символов"}
    }

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        axios.post('http://127.0.0.1:8000/api/user/login/', data)
    }

    return (
        <form id="my_form" onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={Boolean(errors.email)}>
                <FormLabel>Email</FormLabel>
                <Input
                    {...register("email", emailValidator)}
                />
                {errors.email && <FormErrorMessage>{errors.email.message}</FormErrorMessage>}
            </FormControl>

            <FormControl mt={6} isInvalid={Boolean(errors.password)}>
                <FormLabel>Пароль</FormLabel>
                <Input
                    {...register("password", passwordValidator)}
                />
                {errors.password && <FormErrorMessage>{errors.password.message}</FormErrorMessage>}
            </FormControl>
        </form>
    )
}