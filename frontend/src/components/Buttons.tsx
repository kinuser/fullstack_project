import { Box, Flex } from "@chakra-ui/react"

interface ButtonsProps {
    pages: number[]
    onClick: React.Dispatch<React.SetStateAction<number>>
}

export default function Buttons (props: ButtonsProps) {
    const { pages, onClick } = props
    
    return(
        <Flex mx='10%' width='100%' my='1%'>
                {pages.map(p=>
                    <Box 
                        as="button"
                        color='black' 
                        px='15px'
                        py='4px'
                        backgroundColor='gray.50'
                        borderRadius='10px'
                        fontSize='28px'
                        fontWeight='bold'
                        _hover={{ bg: 'gray.100' }}
                        mr='1dvh'
                        onClick={()=>onClick(p)}
                        key={p}
                    >
                        {p}
                    </Box>
                )}
            </Flex>
    )

}