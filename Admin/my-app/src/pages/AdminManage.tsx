import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    Button,
  } from '@chakra-ui/react'
import { useEffect, useState } from 'react';
import AddAdminModal from '../components/AddAdminModal';
import { useWallet, useWeb3 } from '../hooks'

export default function AdminManage() {

    const {account, getAccount} = useWallet();
    const { contract } = useWeb3();

    const [adminList, setAdminList] = useState([]);

    const getAdminList = async() => {
        const result = await contract.methods.getAdminList().call( { from: account} );
        console.log(result);
        setAdminList(result);
    }
    
    useEffect(()=> {
        getAccount()
    }, [])
    useEffect(()=> {
        getAdminList();
    }, [account])


    return (
        <>
        <TableContainer>
        <Table variant='striped' colorScheme='linkedin'>
            <TableCaption>관리자 추가/제거 페이지</TableCaption>
            <Thead>
                <Tr>
                    <Th>No</Th>
                    <Th>주소</Th>
                    {/* <Th>상태</Th> */}
                    <Th isNumeric>관리</Th>
                </Tr>
            </Thead>
            <Tbody>
                { 
                adminList.map((v, i) => {
                    return (
                        <Tr>
                            <Td>{i}</Td>
                            <Td>{v}</Td>
                            {/* <Td>25.4</Td> */}
                            <Td isNumeric> 
                                <Button colorScheme={"red"}
                                onClick={ ()=> {
                                    contract.methods.deleteAdmin(i).send({ from: account });
                                    
                                }}
                                >
                                    삭제
                                </Button> 
                            </Td>
                        </Tr>
                    )
                }) 
                }
            </Tbody>
        </Table>
        </TableContainer>

        <AddAdminModal />
        </>
    )
}