var express = require('express');
var request = require('request');
var convert = require('xml-js');
var parse = require("csv-parse/lib/sync");
var fs = require("fs");

const csv = fs.readFileSync("final.csv");
const records = parse(csv.toString());

var app = express();
app.set('port', process.env.PORT || 3000);

// 역 상세 정보 (역 이름을 파라미터로 쏴줘야 함. 예를 들어 localhost:3000/station?name=광나루)
app.get('/station1', (req, res) => {
    var search = req.query.name;
    
    const option = {
        url : 'http://openapi.tago.go.kr/openapi/service/SubwayInfoService/getKwrdFndSubwaySttnList' + '?' + encodeURIComponent('ServiceKey') + '=h0TLLT%2BzNKA6vVq82NFjZwOnmJrhX4dfX9f5D%2FVHKpxu16En%2FjqjYBoLNaIYL3cvIhIJBnv3vansVFO3MDJ4mg%3D%3D'+ '&' + encodeURIComponent('subwayStationName') + '=' + encodeURIComponent(search),
        method: 'GET'
    };

    request(option, function (error, response, body) {
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
        const answer = {
            subwayRouteName,
            subwayStationId,
            subwayStationName,
            toilet : null
        }
        for (const i in records){
            if (records[i][1].includes(search)) {
                answer.toilet = records[i][2];
                break;
            }
        }
        
        res.json(answer);
    });
});

// 역 도착 시간 정보 (지금 새벽이라 구현 못함)
app.get('/station2', (req, res) => {    
    
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