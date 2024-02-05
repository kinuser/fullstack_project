import { ReactNode, createContext, useContext, useState } from "react"

export const GlobalContext = createContext(null as any)


interface GlobalStorageProps {
    children: ReactNode
}

export default function GlobalStorage (props: GlobalStorageProps) {
    const { children } = props
    const [ search, setSearch ] = useState('')
    return(
        <GlobalContext.Provider value={{ search, setSearch }}>
            {children}
        </GlobalContext.Provider>
    )
}