import { useEffect, useRef, useState } from "react";
import Web3 from "web3";
import { CONTRACT, ABI } from "../web3.config";

export const useObserve = () => {
  const [isObserved, setIsObserved] = useState<boolean>(false);

  const dom = useRef<HTMLDivElement>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  const observe = () => {
    if (dom.current) {
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) setIsObserved(true);
        else setIsObserved(false);
      });
      observer.current.observe(dom.current);

      return () => observer.current && observer.current.disconnect;
    }
  };

  useEffect(() => {
    observe();
  }, [dom]);

  return { isObserved, dom };
};

export const useWallet = () => {
  const [account, setAccount] = useState<string>("");

  const addBnbTestNet = async() => {
    try {
        await window.ethereum.request({
            mothod: 'wallet_addEthereumChain',
            params: [
                {
                    chainId: '0x13881',
                    chainName: 'Mumbai - Testnet',
                    nativeCurrency: {
                        name: 'tMATIC',
                        symbol: 'tMATIC',
                        decimals: 18
                    },
                    rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
                    blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
                },
            ],
        });
    } catch( err : any ) {
        console.error("network adding error - ", err)
    }
}

  const switchChainToBnb = async() => {
    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x13881' }],
        });
    } catch (err : any) {
        console.error(err)
        // 4092에러 : 네트워크 없음
        if (err.code === 4902) addBnbTestNet();
    }
  }

  const getAccount = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        // setAccount(accounts[0]);
        //커스텀
        if(window.ethereum.chainId === '0x13881' || window.ethereum.chainId === 80001) {
          setAccount(accounts[0]);
        }else {
          switchChainToBnb();
        }
      } else {
        alert("메타마스크가 없습니다.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return { account, getAccount };
};

export const useWeb3 = () => {
  const [web3, setWeb3] = useState<any>();
  const [contract, setContract] = useState<any>();

  useEffect(() => {
    if (!window.ethereum) return;

    setWeb3(new Web3(window.ethereum));
  }, []);
  useEffect(() => {
    if (!web3) return;

    setContract(new web3.eth.Contract(ABI, CONTRACT));
  }, [web3]);

  return { web3, contract };
};
