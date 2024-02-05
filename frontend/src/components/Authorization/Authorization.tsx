import axios from "axios";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { instance } from "../../utils/axiosInstance";
import { MyUser } from "../../types";
import { useQueryClient } from "@tanstack/react-query";

const AuthContext = createContext<AuthContextType>({
    user: undefined,
    setUser: ()=>{},
    tokens: undefined,
    setTokens: ()=>{}
})

interface Props {
    children : ReactNode
}

interface RespData {
    access: string
    refresh: string
}

interface AuthContextType {
    user: MyUser | undefined
    setUser: React.Dispatch<React.SetStateAction<MyUser | undefined>>
    tokens: RespData | undefined
    setTokens: React.Dispatch<React.SetStateAction<RespData | undefined>>

}

function getCookie(name:string) {
    let matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
  }

export default function Authorization (props: Props) {
    const { children } = props
    const [ user, setUser ] = useState<MyUser>()
    const [ tokens, setTokens ] = useState<RespData>()
    const client = useQueryClient()
    const testTokens = () => {
        if (tokens && tokens.access && tokens.refresh) {
            instance.get<MyUser>('api/user/myuser/', {
                headers: {
                    'Authorization': `Token ${tokens.access}`,
                }
            })
            .then(r=>{
                    if (r.status && r.status === 200) {
                        setUser(r.data)
                        let date = new Date(Date.now() + 86400e3*10);
                        document.cookie = `access=${tokens.access}; expires=` + date;
                        document.cookie = `refresh=${tokens.refresh}; expires=` + date;
                    }
                }  
            )
            .catch(err=> {
                if (err.response && err.response.status && err.response.status === 403) {
                    // logic for expired access token
                    instance.put('api/user/refresh/', {
                    'refresh_token': `${tokens.refresh}`
                    
                })
                .then(r=> {
                    // setting new pair of tokens
                    setTokens(r.data)
                    let date = new Date(Date.now() + 86400e3*10);
                    document.cookie = `access=${r.data.access}; expires=` + date;
                    document.cookie = `refresh=${r.data.refresh}; expires=` + date;
                })
                .catch(err=>{
                    // Deleting cookies with tokens if refresh token is expired too
                    if (err.response && err.response.status && err.response.status === 403) {                        
                        let date = new Date(Date.now() - 86400e3);
                        document.cookie = `access=${tokens.access}; expires=` + date;
                        document.cookie = `refresh=${tokens.refresh}; expires=` + date;
                        setTokens(undefined)
                        setUser(undefined)

                    }
                })
            }
            })
        }
    }


    useEffect(()=>{
        const refresh = getCookie('refresh')
        const access = getCookie('access')
        if (refresh && access) {
            setTokens({
                'access': access,
                'refresh': refresh
            })
        }
        
    },[])

    useEffect(()=>{
        testTokens()
        if (tokens) {
            instance.defaults.headers.common['Authorization'] = `Token ${tokens.access}`;
            // TODO test interceptor
            instance.interceptors.response.use(function (response) {
                return response;
              }, function (error) {
                if (error.response && error.response.data && error.response.data.detail) {
                    if (error.response.data.detail === 'Expired token.' || error.response.data.detail === 'Invalid or expired token.'){
                        testTokens()
                    }
                }
                return Promise.reject(error);
              })

        }
    }, [tokens,])

    return (
        <AuthContext.Provider value={{ user, setUser, tokens, setTokens }}>
            {children}
        </AuthContext.Provider>
    )
}

export {AuthContext}