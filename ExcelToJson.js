const fs = require("fs");
const XLSX = require("xlsx");
const axios = require("axios");
const workload = XLSX.readFile(__dirname + "/test.xls");

const excel = workload.Sheets[workload.SheetNames[0]];

const possibleKeys = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    "AA",
    "AB",
    "AC",
    "AD",
    "AE",
    "AF",
    "AG",
    "AH",
    "AI",
    "AJ",
    "AK",
    "AL",
    "AM",
    "AN",
    "AO",
    "AP",
    "AQ",
    "AR",
    "AS",
    "AT",
    "AU",
    "AV",
    "AW",
    "AX",
    "AY",
    "AZ",
    "BA",
    "BB",
    "BC",
    "BD",
    "BE",
    "BF",
    "BG",
    "BH",
    "BI",
    "BJ",
    "BK",
    "BL",
    "BM",
    "BN",
    "BO",
    "BP",
    "BQ",
    "BR",
    "BS",
    "BT",
    "BU",
    "BV",
    "BW",
    "BX",
    "BY",
    "BZ",
    "CA",
    "CB",
    "CC",
    "CD",
    "CE",
    "CF",
    "CG",
    "CH",
    "CI",
    "CJ",
    "CK",
    "CL",
    "CM",
    "CN",
    "CO",
    "CP",
    "CQ",
    "CR",
    "CS",
    "CT",
    "CU",
    "CV",
    "CW",
    "CX",
    "CY",
    "CZ",
];

let columnOfNeededValues = {};
let subjectColumnValues = [{}, {}, {}, {}, {}];
console.log("first");
for (let key of possibleKeys) {
    if (excel[`${key}1`]) {
        switch (excel[`${key}1`]?.v) {
            case "NAnsList": {
                columnOfNeededValues.answer_sheet_id = key;
                break;
            }
            case "NVariant": {
                columnOfNeededValues.variant = key;
                break;
            }
            case "NBall": {
                columnOfNeededValues.overall = key;
                break;
            }
            case "CNaimen": {
                columnOfNeededValues.school_info = key;
                break;
            }
            case "NCorrect1":
            case "NCorrect2":
            case "NCorrect3":
            case "NCorrect4":
            case "NCorrect5": {
                subjectColumnValues[+excel[`${key}1`].v[8] - 1].correct = key;
                break;
            }
            case "NError1":
            case "NError2":
            case "NError3":
            case "NError4":
            case "NError5": {
                subjectColumnValues[+excel[`${key}1`].v[6] - 1].incorrect = key;
                break;
            }
            case "NBall1":
            case "NBall2":
            case "NBall3":
            case "NBall4":
            case "NBall5": {
                subjectColumnValues[+excel[`${key}1`].v[5] - 1].score = key;
                break;
            }
            case "blok1":
            case "blok2":
            case "blok3":
            case "blok4":
            case "blok5": {
                subjectColumnValues[+excel[`${key}1`].v[4] - 1].name = key;
                break;
            }
            case "b1er":
            case "b2er":
            case "b3er":
            case "b4er":
            case "b5er": {
                subjectColumnValues[+excel[`${key}1`].v[1] - 1].wrong_answers =
                    key;
                break;
            }
        }
    }
}

columnOfNeededValues.subjects = subjectColumnValues;

console.log(columnOfNeededValues);

let results = {};
let singleResult = {};
let index = 2;

while (excel[`A${index}`]) {
    singleResult = {
        answer_sheet_id:
            excel[`${columnOfNeededValues.answer_sheet_id}${index}`]?.v,
        variant: excel[`${columnOfNeededValues.variant}${index}`]?.v,
        overall: excel[`${columnOfNeededValues.overall}${index}`]?.v,
        school_info: excel[`${columnOfNeededValues.school_info}${index}`]?.v,
        subjects: [
            {
                name: excel[`${columnOfNeededValues.subjects[0]?.name}${index}`]
                    ?.v,
                correct:
                    excel[
                        `${columnOfNeededValues.subjects[0]?.correct}${index}`
                    ]?.v,
                incorrect:
                    excel[
                        `${columnOfNeededValues.subjects[0]?.incorrect}${index}`
                    ]?.v,
                score: excel[
                    `${columnOfNeededValues.subjects[0]?.score}${index}`
                ]?.v,
                wrong_answers:
                    excel[
                        `${columnOfNeededValues.subjects[0]?.wrong_answers}${index}`
                    ]?.v,
            },
            {
                name: excel[`${columnOfNeededValues.subjects[1]?.name}${index}`]
                    ?.v,
                correct:
                    excel[
                        `${columnOfNeededValues.subjects[1]?.correct}${index}`
                    ]?.v,
                incorrect:
                    excel[
                        `${columnOfNeededValues.subjects[1]?.incorrect}${index}`
                    ]?.v,
                score: excel[
                    `${columnOfNeededValues.subjects[1]?.score}${index}`
                ]?.v,
                wrong_answers:
                    excel[
                        `${columnOfNeededValues.subjects[1]?.wrong_answers}${index}`
                    ]?.v,
            },
            {
                name: excel[`${columnOfNeededValues.subjects[2]?.name}${index}`]
                    ?.v,
                correct:
                    excel[
                        `${columnOfNeededValues.subjects[2]?.correct}${index}`
                    ]?.v,
                incorrect:
                    excel[
                        `${columnOfNeededValues.subjects[2]?.incorrect}${index}`
                    ]?.v,
                score: excel[
                    `${columnOfNeededValues.subjects[2]?.score}${index}`
                ]?.v,
                wrong_answers:
                    excel[
                        `${columnOfNeededValues.subjects[2]?.wrong_answers}${index}`
                    ]?.v,
            },
            {
                name: excel[`${columnOfNeededValues.subjects[3]?.name}${index}`]
                    ?.v,
                correct:
                    excel[
                        `${columnOfNeededValues.subjects[3]?.correct}${index}`
                    ]?.v,
                incorrect:
                    excel[
                        `${columnOfNeededValues.subjects[3]?.incorrect}${index}`
                    ]?.v,
                score: excel[
                    `${columnOfNeededValues.subjects[3]?.score}${index}`
                ]?.v,
                wrong_answers:
                    excel[
                        `${columnOfNeededValues.subjects[3]?.wrong_answers}${index}`
                    ]?.v,
            },
            {
                name: excel[`${columnOfNeededValues.subjects[4]?.name}${index}`]
                    ?.v,
                correct:
                    excel[
                        `${columnOfNeededValues.subjects[4]?.correct}${index}`
                    ]?.v,
                incorrect:
                    excel[
                        `${columnOfNeededValues.subjects[4]?.incorrect}${index}`
                    ]?.v,
                score: excel[
                    `${columnOfNeededValues.subjects[4]?.score}${index}`
                ]?.v,
                wrong_answers:
                    excel[
                        `${columnOfNeededValues.subjects[4]?.wrong_answers}${index}`
                    ]?.v,
            },
        ],
    };
    results[singleResult.answer_sheet_id] = singleResult;
    singleResult = {};
    console.log(index);
    index++;
}
const shit = JSON.stringify(results);
fs.writeFile("results.json", shit, function (err, result) {
    if (err) console.log("error", err);
});
