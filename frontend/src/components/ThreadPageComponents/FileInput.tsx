import { Input } from "@chakra-ui/react";

export default function FileInput () {
    return (
        <Input 
            borderRadius='10px' 
            height='100%'
            type="file"
            multiple
        />
    )
}