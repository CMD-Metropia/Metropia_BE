const parse = require("csv-parse/lib/sync");
const fs = require("fs");

const csv = fs.readFileSync("final.csv");
// console.log(csv.toString());
// parse 메서드 -> 2차원배열화
const records = parse(csv.toString());
// console.log(records[1][2]);

for (i in records){
    console.log("역명: " + records[i][1])
    console.log("게이트내외: " + records[i][2])
    console.log("")
}