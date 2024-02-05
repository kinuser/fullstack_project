import { Avatar, Badge, Box, Center, Divider, Flex, Heading, Spacer, Text, Wrap } from "@chakra-ui/react";
import React from "react";
import Thread from "./Thread";
import { Subscription, ThreadType } from "../../types";



interface LastThrProps {
    data: ThreadType[] | Subscription[]
}

function instanceOfThreadType(object: any): object is ThreadType[]  {
    return 'created_time' in object['0'];
}

export default function ThreadsList(props: LastThrProps) {
    const { data } = props
    if (instanceOfThreadType(data)) {
        return(
            <>
                <Flex alignItems={"center"} mx='10%' bg='gray.50' flexDir={"column"} borderRadius={'20px'} p='10px'>
                    {data.map(thr=><Thread thr={thr} key={thr.id}/>)}
                </Flex>
            </>
        )
    }

    if (!instanceOfThreadType(data)) {
        return(
            <>
                <Flex alignItems={"center"} mx='10%' bg='gray.50' flexDir={"column"} borderRadius={'20px'} p='10px'>
                    {data.map(sub=>
                        <Thread thr={sub.thread} key={sub.thread.id} new={sub.watched_counter != sub.thread.counter}/>
                    )}
                </Flex>
            </>
        )
    }
    return(<></>)
}