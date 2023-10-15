const canvasAPI = require('./canvas.js');
const username = "kwilbur";
const API_TOKEN = '6078~aLttsDjfPvDs3JxPVYnVzBhb2Fqqw5jfvrcV9GvOklDkVvV1knXumXjTZILnCpAq';

async function main() {
    console.time('requestDuration');    
    const result = await canvasAPI.scrapeCanvas(username, API_TOKEN);
    console.timeEnd('requestDuration'); 
    console.log("SHOULD BE OBJECT UNDERNEATH");
    let dueDates = [];
    let names = [];

    for (let courseKey in result.courses) {
        if (result.courses.hasOwnProperty(courseKey)) {
            const assignments = result.courses[courseKey].assignments;
            for (const assignment of assignments) {
                const assignmentName = assignment.assignment_name;
                const assignmentDue = assignment.assignment_due;
                dueDates.push(assignmentDue);
                names.push(assignmentName);
              }
        }
    }
    const now = new Date();
    const dated = {};

    for(let i = 0; i < dueDates.length; i++){
        if(dueDates[i] !== null){
            let question = "";
            const fixedDate = dueDates[i].replace(/[TZ]/g, ' ');
            const parts = fixedDate.split(" ");
            let dueDate = new Date(parts[0]);
            if(dueDate > now){
                question += "Assignment: ";
                question += names[i];
                question += " Due Date: ";
                question += parts[0];
                question += " Due Time: ";
                question += parts[1];
                question += " ";
                if(dueDate in dated){
                    dated[dueDate] = dated[dueDate] + question + "\n";
                }
                else{
                    dated[dueDate] = question + "\n";
                }
            }
        }
    }
    const sortedHashMap = Object.fromEntries(
        Object.entries(dated).sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
    );
    let chatGPTString = "";
    for (let key in sortedHashMap) {
        if (sortedHashMap.hasOwnProperty(key)) {
            chatGPTString += sortedHashMap[key];
        }
    }
    console.log(chatGPTString);

}

main();
