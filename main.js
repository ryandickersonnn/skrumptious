const canvasAPI = require('./canvas.js');
const username = "kwilbur";
const API_TOKEN = '6078~aLttsDjfPvDs3JxPVYnVzBhb2Fqqw5jfvrcV9GvOklDkVvV1knXumXjTZILnCpAq';

async function main() {
    console.time('requestDuration');    
    const result = await canvasAPI.scrapeCanvas(username, API_TOKEN);
    console.timeEnd('requestDuration'); 
    console.log("SHOULD BE OBJECT UNDERNEATH");
    for (let courseKey in result.courses) {
        if (result.courses.hasOwnProperty(courseKey)) {
            console.log(courseKey);                   // This will log the key (course name or ID)
            console.log(result.courses[courseKey]);   // This will log the details of the course
        }
    }
}

main();
