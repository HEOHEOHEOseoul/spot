// SPDX-License-Identifier: MIT
 
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract Spot is ERC721Enumerable, Ownable{


    
    constructor() ERC721("Spot", "Spot"){}

    //스팟 정보 구조체
    struct SpotStruct {
        //uint		lat;		//	위도
        //uint		lng;		//	경도
        uint        circle;     //  허용 범위
        uint		registDate;	//	등록 날짜
        uint		validity;	//	유효기간 
        string	    title;		//	스팟 이름
        string  	desc;		//	스팟 설명
        string	    metaData;	//	메타데이터
        uint		total;		//	총 발행량( 0일경우 무제한)
        address 	creator;	//	발행요청자
    }

    struct SpotLocation {
        uint        lat;
        uint        lng;
    }

    SpotStruct[]    SpotStructArr;      // 스팟 구조체 배열
    SpotLocation[]  SpotLocationArr;    // 스팟 위치 배열


    mapping(address => mapping(uint => uint)) visitedInfo;  // prop : 요청주소 & 스팟넘버   value : 총 방문 횟수
    mapping(address => mapping(uint => uint)) whiteList;    // prop : 요청주소 & 스팟넘버   value : 구매 가능 갯수


    address[] admins;




    //스팟 정보 셋팅
    function setSpotInfo(uint lat, uint lng, SpotStruct memory reqInfo) private {
        require(checkAdmin(msg.sender), "No permission");

        SpotLocationArr.push(SpotLocation(lat, lng));
        SpotStructArr.push(reqInfo);
    }

    //관리자 주소 추가
    function setAdmin(address adminAddress) public {
        require(msg.sender == owner(), "You are not owner");
        admins.push(adminAddress);
    }

    //관리자 체크
    function checkAdmin(address sender) private view returns(bool) {
        if (sender == owner()) return true;
        for (uint i = 0; i < admins.length; i++) {
            if (admins[i] == sender) return true;
        }
        return false;
    }





    //스팟 위치 정보 가져오기
    function getSpotLocation() public view returns(SpotLocation[] memory) {
        return SpotLocationArr;
    }

    //스팟 상세 정보 가져오기
    function getSpotDetail(uint spotNo) public view returns(SpotStruct memory) {
        return SpotStructArr[spotNo];
    }

    //화이트 리스트 셋팅
    function setWhiteList(uint spotNo) public {
        whiteList[msg.sender][spotNo]++;
    }

    //구매 가능 갯수 체크
    function checkWhiteList(uint spotNo) public view returns(uint){
        return whiteList[msg.sender][spotNo];
    }




}