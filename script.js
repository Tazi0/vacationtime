// Made by Tazio
var obj = {
    "en-US" : {
        "country": "United States",
        "vacation": [

        ],
        "yes": "Yes",
        "no": "No",
        "countdown": "But in $ #",
        "remaining": "$ # remaining",
        "days": ['day', 'days']
    },
    "nl-NL": {
        "country": "Nederland",
        "vacation": [
            ["15-2", "1-3", "voorjaarsvakantie"], 
            ["25-4", "3-5", "meivakantie"], 
            ["4-6", "23-7", "zomervakantie"],
            ["10-10", "25-10", "herfstvakantie"],
            ["19-12", "3-1", "kerstvakantie"],
            ["13-4", "13-4", "2e paasdag"],
            ["27-4", "27-4", "koningsdag"],
            ["21-5", "21-5", "hemelvaart"],
            ["1-6", "1-6", "2e pinksterdag"]
        ],
        "yes": "Ja",
        "no": "Nee",
        "countdown": "Maar wel in $ #",
        "remaining": "Nog $ # over",
        "days": ['dag', 'dagen']
    }
}

// Data inserters
var insert = {
    "lang": document.getElementById("lang"),
    "answer": document.getElementById("answer"),
    "detail": document.getElementById("detail")
}


function main() {
    // Client specific
    var lang = navigator.language
    var data = obj[lang]
    var date = new Date()

    // Work
    if (data != null) {
        // Data exists in object
        var daysTill = 10000
        var vacation = false
        var breakType = ""

        for (let i = 0; i < data["vacation"].length; i++) {
            const e = data["vacation"][i]

            var begin = e[0].split("-")
            var till = e[1].split("-")
            var oneDay = 24 * 60 * 60 * 1000

            if (e.length == 3) {
                begin = new Date(date.getFullYear(), parseInt(begin[1]) - 1, begin[0])
                till = new Date(date.getFullYear(), parseInt(till[1]) - 1, till[0])

                if (date > begin && date < till) {
                    vacation = true
                    var away = Math.ceil((till.getTime() - date.getTime()) / (oneDay))
                    breakType = e[2]
                    daysTill = away
                    break;
                } else {
                    var away = Math.ceil((begin.getTime() - date.getTime()) / (oneDay))
                    if (away > 0 && away < daysTill) {
                        daysTill = away
                    }
                }
            }
        }

        // Debugging
        // console.log(vacation);
        // console.log(daysTill);
        // console.log(breakType);

        // insert["lang"].innerText = data["country"]
        if (vacation) {
            // Yes vacation :)
            insert['answer'].innerText = data["yes"]
            insert['detail'].innerHTML = breakType + `<br>${data['remaining'].replace("$", daysTill).replace("#", (data['days'][daysTill-1] ?? data['days'][1]))}`

            document.body.style.backgroundColor = "green";
        } else {
            // Not vacation
            insert['answer'].innerText = data["no"]
            if(daysTill != 10000) {
                insert['detail'].innerText = data['countdown'].replace("$", daysTill).replace("#", (data['days'][daysTill-1] ?? data['days'][1])) + " 🙂"
            } else {
                insert['detail'].innerText = "Your country is not in my databank 🙃"
            }

            if (daysTill < 5) {
                document.body.style.backgroundColor = "orange";
            } else {
                document.body.style.backgroundColor = "red";
            }
        }
    } else {
        // No language found or didn't exist in data object
        insert["lang"].innerText = "No language found"
        insert["answer"].innerText = "¯\\_(ツ)_/¯"
    }

    // refresh when a new day starts
    setTimeout(() => {
        main()
    }, refreshTime());
}

main()

// Function for timeout
function refreshTime() {
    var midnight = new Date();
    midnight.setHours(24);
    midnight.setMinutes(0);
    midnight.setSeconds(0);
    midnight.setMilliseconds(0);
    return (midnight.getTime() - new Date().getTime());
}