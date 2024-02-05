import { Flex } from "@chakra-ui/react";
import { JsxElement } from "typescript";
import React, { ReactNode } from "react";

interface Props {
    children: ReactNode
}

export default function MessageList (props: Props) {
    const { children } = props
    return (
        <Flex width='100%' flexDirection='column' id="messageList">
            { children }
        </Flex>
    )
}