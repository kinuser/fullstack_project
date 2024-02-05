import { Flex, Heading, Text } from "@chakra-ui/react";
import { Navbar } from "../components/Navbar/Navbar";

export default function ErrorPage () {
    return(
        <>
            <Navbar/>
            <Flex flexDir='column' alignItems='center' mt='15%'>
                <Heading>Oops! </Heading>
                <Heading>This page does not exist.</Heading>
                <Text color='gray.300' fontWeight='bold' fontSize='36px' mt='5%'> 404 </Text>
            </Flex>
        </>
    )
}