var express = require('express');
var request = require('request');
var convert = require('xml-js');

var app = express();
app.set('port', process.env.PORT || 3000);

// 역 상세 정보 (역 이름을 파라미터로 쏴줘야 함. 예를 들어 localhost:3000/station?name=광나루)
app.get('/station1', (req, res) => {    
    var search = req.query.name;
    
    var url = 'http://openapi.tago.go.kr/openapi/service/SubwayInfoService/getKwrdFndSubwaySttnList';
    var queryParams = '?' + encodeURIComponent('ServiceKey') + '=h0TLLT%2BzNKA6vVq82NFjZwOnmJrhX4dfX9f5D%2FVHKpxu16En%2FjqjYBoLNaIYL3cvIhIJBnv3vansVFO3MDJ4mg%3D%3D'; /* Service Key*/
    queryParams += '&' + encodeURIComponent('subwayStationName') + '=' + encodeURIComponent(search);

    request({
        url: url + queryParams,
        method: 'GET'
    }, function (error, response, body) {
        var xml2json = convert.xml2json(body, {compact: true, spaces: 4});
        var info = JSON.parse(xml2json);

        if (info.response.body.totalCount._text === "0") {
            console.log("Error (No station that has such name)")
        }
        else if (info.response.body.totalCount._text === "1") {
            var subwayRouteName = info.response.body.items.item.subwayRouteName._text
            var subwayStationId = info.response.body.items.item.subwayStationId._text
            var subwayStationName = info.response.body.items.item.subwayStationName._text
        }
        else {
            var subwayRouteName = info.response.body.items.item[0].subwayRouteName._text
            var subwayStationId = info.response.body.items.item[0].subwayStationId._text
            var subwayStationName = info.response.body.items.item[0].subwayStationName._text
        }

        answer = {
            "호선" : subwayRouteName,
            "역 코드" : subwayStationId,
            "역 이름" : subwayStationName,
        }

        res.json(answer);
    });
});

// 역 도착 시간 정보 (서버 오류로 아직 구현 못함)
app.get('/station2', (req, res) => {    
    
});

// 역 화장실 정보 (통합 csv 파일 필요)
app.get('/station3', (req, res) => {    
    
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중.');
});

app.use(function (req, res, next) {
    res.status(404).send('Sorry cant find that!');
});

app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something broke!');
})