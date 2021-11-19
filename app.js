var express = require('express');

var app = express();
app.set('port', process.env.PORT || 3000);

app.get('/station', (req, res) => {
    var request = require('request');
    var convert = require('xml-js');
    
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
        for (i in info['response']['body']['items']['item']) {
            if (search === info['response']['body']['items']['item'][i]['subwayStationName']['_text']) {
                var subwayRouteName = info['response']['body']['items']['item'][i]['subwayRouteName']['_text'];
                var subwayStationId = info['response']['body']['items']['item'][i]['subwayStationId']['_text'];
                var subwayStationName = info['response']['body']['items']['item'][i]['subwayStationName']['_text'];
            }
        }

        answer = {
            "호선" : subwayRouteName,
            "역 코드" : subwayStationId,
            "역 이름" : subwayStationName,
        }

        res.send(answer);
    });
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중.');
});