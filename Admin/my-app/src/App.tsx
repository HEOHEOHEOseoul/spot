import * as React from "react"
import { useState, useEffect } from "react"
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  theme,
  useToast,
} from "@chakra-ui/react"
import { ColorModeSwitcher } from "./ColorModeSwitcher"
import { Logo } from "./Logo"
import { Route, Routes } from "react-router-dom"
import NotFound from "./pages/NotFound"
import SideBar from "./components/SideBar"
import Main from "./pages/Main"
import Login from "./pages/Login"
import { useWallet, useWeb3 } from "./hooks"
import AdminManage from "./pages/AdminManage"
import { MapPage } from "./pages/MapPage"


export const App = () => {

  const { account, getAccount } = useWallet();
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const { contract } = useWeb3();
  const toast = useToast();
  
  useEffect(()=> {
    getAccount();
  }, [])

  useEffect(()=> {
    if (account) checkAdmin();
  }, [account])

  const checkAdmin = async() => {
    const result = await contract.methods.checkAdmin(account).call();
    if (!result) {
      toast({
        title: 'No permission',
        description: "You are not a admin.",
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
    }
    setIsLogin(result);
  }


  
  return (
    <ChakraProvider theme={theme}>
      { isLogin ?
      <SideBar>
        <Routes>
          
          <Route path="/" element={<Main />} />
          <Route path="/admin" element={<AdminManage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </SideBar>
      :
      <Login />
      }
    </ChakraProvider>
  )
}
