import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  Textarea,
  useToast
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useWallet, useWeb3 } from '../hooks';

export default function SignupCard() {

  const { account, getAccount } = useWallet();
  const { contract } = useWeb3();

  const [ title, setTitle ] = useState<string>();
  const [ desc, setDesc ] = useState<string>();
  const [ lat, setLat ] = useState<number>();
  const [ lng, setLng ] = useState<number>();
  const [ metaData, setMetadata ] = useState<string>();
  const [ total, setTotal ] = useState<number>();
  

  const toast = useToast();
  const [isLoad, setIsLoad] = useState<boolean>(false);

  useEffect(()=> {
    getAccount();
  },[])

  console.log(title, desc)

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'}>
            스팟 등록하기
          </Heading>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}>
          <Stack spacing={4}>
            
            <FormControl id="spotTitle" isRequired>
              <FormLabel>스팟 이름</FormLabel>
              <Input type="text" onChange={ e =>  setTitle(e.target.value)  } />
            </FormControl>

            <FormControl id="spotDesc" isRequired>
              <FormLabel>스팟 설명</FormLabel>
              <Textarea placeholder='스팟에 대한 설명' onChange={ e => setDesc(e.target.value) } />
            </FormControl>
            
            <HStack>
              <Box>
                <FormControl id="firstName" isRequired>
                  <FormLabel>위도</FormLabel>
                  <Input type="text" onChange={ e=> setLat( parseInt(e.target.value) ) }/>
                </FormControl>
              </Box>
              <Box>
                <FormControl id="lastName" isRequired>
                  <FormLabel>경도</FormLabel>
                  <Input type="text" onChange={ e=> setLng( parseInt(e.target.value) ) }/>
                </FormControl>
              </Box>
            </HStack>
              <Stack pt={6}>
              <Text align={'center'}>
                주소로 위도,경도 찾으려면 <Link color={'blue.400'}>여기</Link>
              </Text>
            </Stack>
            <FormControl id="email" isRequired>
              <FormLabel>메타데이터</FormLabel>
              <Input type="text" onChange={ e=> setMetadata( e.target.value ) }/>
            </FormControl>
            <FormControl id="email" isRequired>
              <FormLabel>총 발행량</FormLabel>
              <Input type="text" placeholder='무제한 일 경우 0' onChange={ e=> setTotal( parseInt(e.target.value ) ) } />
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Submitting"
                size="lg"
                bg={'blue.400'}
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }}
                isLoading={isLoad}
                
                onClick={ async ()=> {
                  setIsLoad(true)
                  // toast({
                  //   title: 'Tx pending.',
                  //   description: "wait to transaction result",
                  //   status: 'loading',
                  //   duration: 9000,
                  //   isClosable: true,
                  // })
                  const result = await contract.methods.setSpotInfo(lat, lng, title, desc, metaData, total).send({ from: account })
                  if(result) setIsLoad(false)
                  toast({
                    title: 'Tx Success',
                    description: "txid : "+result.transactionHash,
                    status: 'success',
                    duration: 9000,
                    isClosable: true,
                  })
                }}
                >
                등록하기
              </Button>
              <Button onClick={ async ()=> {
                // const result = await contract.methods.getTest().call();
                const result = await contract.methods.getSpotLocation().call( { from : account});
                console.log('GET TEST 함수 실행!',result)
              }} >
                겟테스트
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}