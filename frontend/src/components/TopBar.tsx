import { Flex } from "@chakra-ui/react"
import { NavigatorUI } from "./NavigatorUI"

interface TopBarProps {
    children: React.ReactNode
}

export default function TopBar (props: TopBarProps) {
    return(
        <Flex justifyContent='space-between' mx='10%' my='2px'>
            {props.children}
        </Flex>
    )
}