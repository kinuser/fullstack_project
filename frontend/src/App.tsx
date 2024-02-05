import * as React from "react"
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  theme,
  Flex,
} from "@chakra-ui/react"
import { Navbar } from "./components/Navbar/Navbar"
import ThreadsList from "./components/MainPageComponents/ThreadsList"
import ProfilePage from "./pages/ProfilePage"
import { RouterProvider, createBrowserRouter } from "react-router-dom"
import ThreadPage from "./pages/ThreadPage"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import MainPage from "./pages/MainPage"
import Authorization from "./components/Authorization/Authorization"
import SubscriptionsPage from "./pages/SubscriptionsPage"
import { DialoguesPage } from "./pages/DialoguesPage"
import SearchPage from "./pages/SearchPage"
import GlobalStorage from "./components/GlobalStorage"
import ErrorPage from "./pages/ErrorPage"

export const App = () => {
  const mainPage =   {
    path: "/",
    element:  <Navbar/>,
    errorElement: <ErrorPage/>,
    children: [{
        path: '/',
        element: <MainPage/>
      },
      {
        path: '/profile/',
        element: <ProfilePage/>
      },
      {
        path: '/thread/:threadId/',
        element: <ThreadPage/>
      },
      {
        path: '/subscriptions/',
        element: <SubscriptionsPage/>
      },
      {
        path: '/chats/',
        element: <DialoguesPage/>
      },
      {
        path: '/search/',
        element: <SearchPage/>
      },
    ]
  }

  const router = createBrowserRouter(
    [mainPage]
  )
  const queryClient = new QueryClient()
  
  return (
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Authorization>
          <GlobalStorage>
            <RouterProvider router={router} />
          </GlobalStorage>
        </Authorization>
      </QueryClientProvider>
    </ChakraProvider>
  )
}


// const mainPage =   {
//   path: "/",
//   element:  <Navbar/>,
//   children: [{
//     path: '/',
//     element: <MainPage/>
//   }]
// }
// const profilePage = {
//   path: "/profile/",
//   element:  <Navbar/>,
//   children: [{
//     path: '/profile/',
//     element: <ProfilePage/>
//   }]
// }

// const threadPage = {
//   path: "/thread/:threadId",
//   element:  <Navbar />,
//   children: [{
//     path: '/thread/',
//     element: <ThreadPage/>
//   }]
// }