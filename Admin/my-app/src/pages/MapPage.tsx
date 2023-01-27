import { Box, Button, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Map, MapMarker, MarkerClusterer } from "react-kakao-maps-sdk"
import { useWallet, useWeb3 } from "../hooks";




export const MapPage = () => {

    const { account, getAccount } = useWallet();
    const { contract } = useWeb3();

    const [ locations, setLocations ] = useState<number[][]>([[0,0]]);
    const [ isGot, setIsGot ] = useState<boolean>(false);

    useEffect(()=> {
        getAccount()
        
    }, [])
    useEffect(()=> {
        getSpotLocation();
    }, [account])


    const getSpotLocation = async ()=> {
        const result  = await contract.methods.getSpotLocation().call( { from : account } );
        let tmp : number[][] = [];
        for(let i = 0; i< result.length; i++) {
            tmp.push([result[i].lat, result[i].lng]);
        }
        setLocations(tmp);
        setIsGot(true)
        
    }

    return (
        <>
        {
            isGot
            ?
            <Map
                center={{ lat: 33.55635, lng: 126.79584 }}
                style={{ width: "100%", height: "700px" }}
                level={8}
            >
                <MarkerClusterer
                    averageCenter={true}
                    minLevel={2}
                >
                {
                    locations.map((pos, i) => (
                        <MapMarker
                        key={i}
                        position={{lat: (pos[0]/100000), lng: (pos[1]/100000)}}
                        />
                    ))
                }
                </MarkerClusterer>
            </Map>
            :
            <Box>
                <Text>가져오는 중 ~~</Text>
            </Box>
            }   
        </>
    )
}