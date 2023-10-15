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
            // console.log(result.courses[courseKey]);             // This will log the key (course name or ID)
            const assignments = result.courses[courseKey].assignments;
            for (const assignment of assignments) {
                const assignmentName = assignment.assignment_name;
                const assignmentDue = assignment.assignment_due;
                // console.log('Assignment Name:', assignmentName);
                // console.log('Assignment Due:', assignmentDue);
                dueDates.push(assignmentDue);
                names.push(assignmentName);
              }
            // for(assignment in result.courses[courseKey].assignments)
            // console.log(assignment.assignment_name);   // This will log the details of the course
        }
    }
    const now = new Date();
    let question = "";
    // let dated = new Map();
    const dated = {};


    // for(let i = 0; i < dueDates.length; i++){
    //     if(dueDates[i] != null){
    //         const fixedDate = dueDates[i].replace(/[TZ]/g, ' ');
    //         const parts = fixedDate.split(" ");
    //         let dueDate = new Date(parts[0]);
    //         if(dueDate > now){
    //             question += "Assignment: ";
    //             question += names[i];
    //             question += " Due Date: ";
    //             question += parts[0];
    //             question += " Due Time: ";
    //             question += parts[1];
    //             question += " ";

    //         }
    //     }
    // }
    for(let i = 0; i < dueDates.length; i++){
        if(dueDates[i] != null){
            const fixedDate = dueDates[i].replace(/[TZ]/g, ' ');
            const parts = fixedDate.split(" ");
            let dueDate = new Date(parts[0]);
            dated[dueDate] = [names[i], parts[0]];
            }
        }
    // for(key in dated){
    //     console.log(dated[key]);
    // }
    const keysArray = Object.keys(dated);
    keysArray.sort();
    // let values = dated.keys();
    // sortedKeys = values.sort();
    console.log(keysArray);
    for(key in keysArray){
        console.log(dated[key])
    }
    // const sortedMap = new Map([Object.keys(dated)].sort());
    // console.log(sortedMap)
    // for (var i = 0, keys = Object.keys(sortedMap), ii = keys.length; i < ii; i++) {
    //     console.log(keys[i] + '|' + sortedMap[keys[i]]);
    //   }
    // console.log(question);
}

main();
