import { Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import { useWallet, useWeb3 } from "../hooks"

export default function AddAdminModal() {
    const { isOpen, onOpen, onClose } = useDisclosure()
  
    const initialRef = React.useRef(null)
    const finalRef = React.useRef(null)

    const [targetAddress, setTargetAddress] = useState<string>();
    
    const [isLoad, setIsLoad] = useState<boolean>(false);
    const toast = useToast();
    const { account, getAccount } = useWallet();
    const { contract } = useWeb3();


    useEffect(()=> {
        getAccount();
    }, [])
  
    return (
      <>
        <Button colorScheme={"blue"} onClick={onOpen}>관리자 추가</Button>
  
        <Modal
          initialFocusRef={initialRef}
          finalFocusRef={finalRef}
          isOpen={isOpen}
          onClose={onClose}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>관리자 추가</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl isRequired>
                <FormLabel>지갑주소</FormLabel>
                <Input ref={initialRef} placeholder='0x....' 
                onChange={(e)=>{ setTargetAddress(e.target.value) } }
                />
              </FormControl>
            </ModalBody>
  
            <ModalFooter>
              <Button colorScheme='blue' mr={3} isLoading={isLoad}
              onClick={ async()=> {
                setIsLoad(true);
                try {
                  const result = await contract.methods.setAdmin(targetAddress).send( { from: account });
                  if(result) {
                    
                    toast({
                      title: 'Add admin complete',
                      description: "txid : "+result.transactionHash,
                      status: 'success',
                      duration: 9000,
                      isClosable: true,
                    });
                    console.log(result)
                    onClose();
                  }
                } catch(e) {
                  toast({
                    title: 'Fail to add admin',
                    description: e+'',
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                  })
                }
                setIsLoad(false)
              }}
              >
                추가
              </Button>
              <Button onClick={onClose}>취소</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
  }