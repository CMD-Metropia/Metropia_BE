var request = require('request');
var convert = require('xml-js');

// var url = 'http://openapi.tago.go.kr/openapi/service/SubwayInfoService/getKwrdFndSubwaySttnList';
// var queryParams = '?' + encodeURIComponent('ServiceKey') + '=h0TLLT%2BzNKA6vVq82NFjZwOnmJrhX4dfX9f5D%2FVHKpxu16En%2FjqjYBoLNaIYL3cvIhIJBnv3vansVFO3MDJ4mg%3D%3D'; /* Service Key*/
// queryParams += '&' + encodeURIComponent('subwayStationName') + '=' + encodeURIComponent('구로');

// request({
//     url: url + queryParams,
//     method: 'GET'
// }, function (error, response, body) {
//     /* console.log('Status', response.statusCode);
//     console.log('Headers', JSON.stringify(response.headers));
//     console.log('Reponse received', body); */

//     //xml을 json으로 변환
//     var xml2json = convert.xml2json(body, {compact: true, spaces: 4});
//     var info = JSON.parse(xml2json);
//     for (i in info['response']['body']['items']['item']) {
//         console.log('호선 : ' + info['response']['body']['items']['item'][i]['subwayRouteName']['_text']);
//         console.log('역 코드 : ' + info['response']['body']['items']['item'][i]['subwayStationId']['_text']);
//         console.log('역 이름 : ' + info['response']['body']['items']['item'][i]['subwayStationName']['_text']);
//         console.log("");
//     }
// });

var url = 'http://swopenAPI.seoul.go.kr/api/subway/'

//요청인자

var KEY = encodeURIComponent('705072737264706c3130336e7a63714a'); //인증키
var TYPE = encodeURIComponent('xml');
var SERVICE = encodeURIComponent('realtimeStationArrival');
var START_INDEX = 0;
var END_INDEX = 5;
var statnNm = encodeURIComponent('혜화');


url += KEY + '/' + TYPE + '/' + SERVICE + '/' + START_INDEX + '/' + END_INDEX + '/' + statnNm;

console.log(url);

request({
    url: url, 
    method: 'GET'
}, function(error, response, body) {
    console.log('Status:', response.statusCode);
    console.log('Headers:', JSON.stringify(response.headers));
    var xml2json = convert.xml2json(body, {compact: true, spaces: 4});
    var info = JSON.parse(xml2json);
     for (i in info['realtimeStationArrival']['row']) {
         console.log('역 ID : ' + info['realtimeStationArrival']['row'][i]['subwayId']['_text']);
         console.log('상행 or 하행 : ' + info['realtimeStationArrival']['row'][i]['updnLine']['_text']);
         console.log('trainLineNm : ' + info['realtimeStationArrival']['row'][i]['trainLineNm']['_text']);
         console.log('subwayHeading : ' + info['realtimeStationArrival']['row'][i]['subwayHeading']['_text']);
         console.log('역 이름 : ' + info['realtimeStationArrival']['row'][i]['statnNm']['_text']);
         console.log('bstatnNm : ' + info['realtimeStationArrival']['row'][i]['bstatnNm']['_text']);
         console.log('arrival message : ' + info['realtimeStationArrival']['row'][i]['arvlMsg2']['_text']);
         console.log("");
     }
});