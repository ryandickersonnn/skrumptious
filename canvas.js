const CANVAS_DOMAIN = 'https://wustl.instructure.com';
const API_URL = `${CANVAS_DOMAIN}/api/v1/`;
const API_TOKEN = '6078~aLttsDjfPvDs3JxPVYnVzBhb2Fqqw5jfvrcV9GvOklDkVvV1knXumXjTZILnCpAq'; 
// This is my API TOKEN
const COURSE_ID = 114975;
const USER_ID = 51896;
const TERM_ID_INDEX = 1;
const START_TIME = 2;
const END_TIME = 3;

async function scrapeCanvas(username, API_TOKEN){
    let result = {
        username: username,
        api_token: API_TOKEN,
        courses: {}
    };
    const HEADERS = {
        'Authorization': `Bearer ${API_TOKEN}`
    };
    retArr = await getTermIds(HEADERS);
    let termValue = Math.max(...retArr.map(subArray => subArray[1])) -1;
    const now = new Date();
    for(subArr of retArr){
        if(subArr[START_TIME] !== null && subArr[END_TIME] !== null){
            let before = new Date(subArr[START_TIME]);
            let after = new Date(subArr[END_TIME]);
            if(before < now && now < after){
                termValue = subArr[TERM_ID_INDEX];
                break;
            }
        }
    }
    currentCourses = await getCoursesByTerm(termValue, HEADERS);
    let courseInfoArr = [];
    const USER_ID = currentCourses[0].enrollments[0].user_id;
    for(const course of currentCourses){
        courseInfoArr = courseInfoArr.concat([[course.name, course.id]]);
    }
    let currentGrades = [];
    let currentAssignments = [];
    for(const courseArr of courseInfoArr){
        let assignmentList = [];
        let fileList = [];
        let grade = await getGradesByCourse(courseArr[1], USER_ID, HEADERS);
        currentGrade = grade[0].grades.current_score;
        let files = await getCourseFiles(courseArr[1], API_TOKEN, HEADERS);
        for(const element of files){
            if(element !== null){
                fileList = fileList.concat({file_name: element.display_name, url: element.url, mime_class: element.mime_class})
            }
        }
        let data = await getAssignmentsByCourse(courseArr[1], HEADERS);
        for(const element of data){
            assignmentList = assignmentList.concat({assignment_name: element.name, assignment_due: element.due_at});
        }
        result.courses[courseArr[0]] = {
            grade: currentGrade,
            assignments: assignmentList,
            files: fileList,
        };
    }
    return result;
}

async function getCourseFiles(course_id, API_TOKEN, HEADERS) {    
    const response = await fetch(`${API_URL}/courses/${course_id}/files`, {
        method: "GET",
        headers: HEADERS
    });
    
    if (response.ok) {
        return await response.json();
    } else {
        console.error(`Error fetching course files: ${response.statusText}`);
        return [];
    }
}


async function getTermIds(HEADERS) {
    const endpoint = "accounts/1/terms"; 
    const response = await fetch(`${API_URL}${endpoint}`, { headers: HEADERS });
    if (response.ok) {
        const data = await response.json();
        if (data.hasOwnProperty('enrollment_terms')) {
            retArr = [];
            for(const item of data.enrollment_terms){
                retArr.push([item.name, item.id, item.start_at, item.end_at]);
            }
            return retArr;
        }
        else{
            console.error(`Data not of correct form`);
            return 
        }
    } else {
        console.error(`Error fetching terms: ${response.statusText}`);
        return [];
    }
}

function getNextLink(linkHeader) {
    if (!linkHeader) return null; 
    const links = linkHeader.split(',');
    for (const link of links) {
        const [url, rel] = link.split(';');
        if (rel.trim() === 'rel="next"') {
            const nextUrl = new URL(url.trim().slice(1, -1)); // Remove < and >
            return nextUrl.pathname + nextUrl.search;
        }
    }
    return null;
}

async function getCoursesByTerm(termId, HEADERS) {
    let currentCourses = [];
    let allCourses = [];
    let endpoint = `courses?enrollment_term_id=${termId}&per_page=100`;
    while (endpoint) {
        const response = await fetch(`${API_URL}${endpoint}`, { headers: HEADERS });
        if (response.ok) {
            const data = await response.json();
            allCourses = allCourses.concat(data);
            const linkHeader = response.headers.get('Link');
            endpoint = getNextLink(linkHeader);
        } else {
            console.error(`Error fetching courses: ${response.statusText}`);
            break;
        }
    }

    for (const item of allCourses) {
        if (item.enrollment_term_id == 195) {
            currentCourses = currentCourses.concat(item);
        }
    }
    return currentCourses;
}

async function getGradesByCourse(courseID, userID, HEADERS){
    response = await fetch(`${API_URL}/courses/${courseID}/enrollments?user_id=${userID}`, {
        method: "GET",
        headers: HEADERS
    });
    if (response.ok) {
        const data = await response.json();
        return data;
    } else {
        console.error(`Error fetching terms: ${response.statusText}`);
        return [];
    }
}

async function getAssignmentsByCourse(courseID, HEADERS){
    response = await fetch(`${API_URL}/courses/${courseID}/assignments`, {
        method: "GET",
        headers: HEADERS
    });
    if (response.ok) {
        const data = await response.json();
        return data;
    } else {
        console.error(`Error fetching terms: ${response.statusText}`);
        return [];
    }
}
// Run The code
const getTerms = false
const getCourses = false
const getAssignments = false
const getGrades = false
const runScrapeCanvas = true
if(runScrapeCanvas){
    scrapeCanvas("kwilbur", API_TOKEN)
    .then(result => {
        for (let courseKey in result.courses) {
            if (result.courses.hasOwnProperty(courseKey)) {
                console.log(courseKey);                   // This will log the key (course name or ID)
                console.log(result.courses[courseKey]);   // This will log the details of the course
            }
        }
    })
}
if(getTerms){
    getTermIds()
    .then(ret_array => {
        for(const item of ret_array){
            console.log(item.course_code);
        }
        console.log(ret_array);
    })
    .catch(error => {
        console.error(`Error: Unable to fetch courses. ${error}`);
    });
}
if(getCourses){
    getCoursesByTerm(195, 100)
    .then(ret_array => {
        console.log("----------");
        console.log("----------");
        console.log("----------");
        console.log("----------");
        console.log("----------");
        for(const item of ret_array){
            console.log(item);
        }
        console.log("Finish");
    })
    .catch(error => {
        console.error(`Error: Unable to fetch courses. ${error}`);
    });
}
if(getGrades){
    getGradesByCourse(COURSE_ID, USER_ID)
    .then(data => {
        for (const enrollment of data) {
            console.log(enrollment.grades.current_score);
            if (enrollment.type === "student" && enrollment.user_id === userID) {
                const grades = enrollment.grades;
                const current_grade = grades.current_grade;
                const final_grade = grades.final_grade;
                console.log(`Current grade: ${current_grade}, Final grade: ${final_grade}`);
            }
        }
    })
    .catch(error => {
        console.error("Error fetching grades:", error);
    });
}

if(getAssignments){
    getAssignmentsByCourse(COURSE_ID, USER_ID)
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error("Error fetching grades:", error);
    });
}

