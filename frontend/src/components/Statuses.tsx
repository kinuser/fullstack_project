import { Flex, Text } from "@chakra-ui/react"

interface StatusesProps {
    status: 'Loading' | 'Error'
    custom: string
}

type RequireAtLeastOne<T> = { [K in keyof T]:
    { [L in K]: T[L] } &
    { [L in Exclude<keyof T, K>]?: T[L] }
  }[keyof T];

export default function Statuses (props: RequireAtLeastOne<StatusesProps>) {
    const { status, custom } = props
    return (
        <Flex justifyContent='center' alignItems='center' mt='20dvh'>
            <Text fontWeight='bold' color='gray.500' fontSize='38px'>
                {status && status}
                {custom && custom}
            </Text>
        </Flex>
    )

}