import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Wrap } from "@chakra-ui/react"
import { ReactNode } from "react"
import { Link, Location } from "react-router-dom"

interface NavigatorProps {
    curMain: string
    data?: string
    location?: Location<any>
}

const NavigatorUI: React.FC<NavigatorProps> = (props: NavigatorProps) => {

    const {data, location, curMain} = props
    
    return(
        <Box p='10px' maxW='80%' borderRadius='10px' bg='gray.50' w='fit-content' my='0.2%'>
            <Breadcrumb>
                <BreadcrumbItem>
                    <BreadcrumbLink as={Link} to='/' fontWeight='extrabold'>{curMain}</BreadcrumbLink>
                </BreadcrumbItem>
                {location?.state?.fromSubs&&
                    <BreadcrumbItem>
                        <BreadcrumbLink isCurrentPage={false} fontWeight='extrabold' as={Link} to='/subscriptions/'>
                            Subscribed threads
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                }
                {/* 
                <BreadcrumbItem>
                    <BreadcrumbLink href='#' fontWeight='extrabold'>Доска</BreadcrumbLink>
                </BreadcrumbItem> */}
                {data&& 
                    <BreadcrumbItem>
                        <BreadcrumbLink isCurrentPage={false} fontWeight='extrabold'>{data}</BreadcrumbLink>
                    </BreadcrumbItem>
                }

            </Breadcrumb>
        </Box>
    )
}

export { NavigatorUI }