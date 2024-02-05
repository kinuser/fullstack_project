import { SearchIcon } from "@chakra-ui/icons"
import { Input, IconButton, FormControl } from "@chakra-ui/react"
import { useContext, useState } from "react"
import { GlobalContext } from "../GlobalStorage"
import { useLocation, useNavigate } from "react-router-dom"

export default function Search () {
    const { search, setSearch } = useContext(GlobalContext)
    const [ isValidSearch, setIsValidSearch ] = useState(true)
    const [ searchString, setSearchString ] = useState('')
    const navigate = useNavigate()
    const location = useLocation()
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchString(e.currentTarget.value)
        if (searchString !== '' && !isValidSearch){
            setIsValidSearch(true)
        }
    }

    const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch()
        }
    }

    const makeSearch = () => {
        setIsValidSearch(true)
        setSearch(searchString)
        setSearchString('')
}

    const handleSearch = () => {
        if (searchString !== '' && location.pathname !== '/search/'){
            makeSearch()
            navigate('/search/')
        } else if (searchString !== '' && location.pathname === '/search/'){
            makeSearch()
        } else if (searchString === '') {
            setIsValidSearch(false)
        }
    }
    return(
        <>  <FormControl isInvalid={!isValidSearch}>
                <Input 
                    placeholder='Find thread'
                    color={"black"}
                    value={searchString}
                    onChange={e=>{onChange(e)}}
                    onKeyDown={handleEnter}
                    width='30dvh'
                />
            </FormControl>
            <IconButton 
                onClick={handleSearch}
                colorScheme='blue'
                variant='outline'
                aria-label='Search database'
                icon={<SearchIcon />}
            />
        </>
    )
}