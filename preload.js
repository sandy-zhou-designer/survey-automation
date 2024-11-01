var minify = require('html-minifier').minify;

let globalSheetData = null;



const { google } = require('googleapis');
const sheets = google.sheets('v4');
const fs = require('fs');
const path = require('path');


const SERVICE_ACCOUNT_FILE = path.join(__dirname, './json/survey-result-434018-6311a07e59cc.json');

// Authenticate using the service account key file
const auth = new google.auth.GoogleAuth({
    keyFile: SERVICE_ACCOUNT_FILE,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

async function fetchSheetData() {
    const authClient = await auth.getClient();
    const spreadsheetId = '1gbCeOxy4f5acTCRnn_PxJhPh1VCpZdo_CbDgJHtvipM';
    const range = 'Sheet1!A1:C120'; // Adjust the range as needed

    const response = await sheets.spreadsheets.values.get({
        auth: authClient,
        spreadsheetId: spreadsheetId,
        range: range,
    });

    const data = response.data.values;
    if (data.length > 0) {
     
        // data.forEach(row => {
        //     // console.log(row);
        // });
        
        globalSheetData =  parseData(data)
    } else {
        console.log('No data found.');
    }
}



var template = "";

var newsletter = "morningbrief"
var version = "layoutA"
var userType = "paid"
var withLabel = true;
var templateList ={
    
     morningbrief:{
       template:"./templates/morning_brief/newsletter_stripped_template.html",
      
       article:"./templates/morning_brief/article_stripped_template.html",
      
       
    }

}

var dividerHtml=""

var buttonHtml = `
<div align="center" style="margin-top:32px; ">
  <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="{{copy-link}}" style="height:49px; v-text-anchor:middle; width:430px;" arcsize="4%"  stroke="f" fillcolor="#A0000B"><w:anchorlock/><center style="color:#FFFFFF;font-family: arial,helvetica,sans-serif; "><![endif]-->
    <a href="{{copy-link}}" target="_blank" class="v-button v-font-size" style="box-sizing: border-box;display: inline-block;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #FFFFFF; background-color: #A0000B; border-radius: 2px;-webkit-border-radius: 2px; -moz-border-radius: 2px; width:auto; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word; mso-border-alt: none;font-family: arial,helvetica,sans-serif; font-size: 24px;font-weight: 700; ">
      <span style="display:block;padding:10px 20px;line-height:120%;"><span style="font-size: 20px; line-height: 24px;">{{copy-button}}</span></span>
    </a>
    <!--[if mso]></center></v:roundrect><![endif]-->
</div>
<div align="center" style="word-break:break-word;margin:0;padding:0 0 4px 0px;font-family:Inter,Arial,sans-serif;font-size: 12px;font-style: normal;font-weight: 400;line-height: 1.4;letter-spacing: 0px;color:#5E5E5E;margin-bottom:32px;margin-top:8px">{{copy-terms}}</div>
`



var listOfUtms = {
 
      "morningbrief":"MB_article_",
   
}







var newsletterTemplate = templateList["morningbrief"];



window.addEventListener('DOMContentLoaded', async () => {

        
        
        
     

        document.querySelector('#submit').onclick = async function(e) {
        e.preventDefault()

        waitOn()

    
 



                
         template = await openTemplate(newsletterTemplate.template)
    
     


  

        

    

        var content = {}


        var form = document.querySelector('form')

        var data = new FormData(form);






        


        // Function to remove inactive sections
        function removeInactiveSections() {
            // Find all inactive sections within the form
            var inactiveSections = form.querySelectorAll(`.newsletter-ca:not(.${newsletter})`);
            
            // Store inactive sections for potential restoration
            var removedSections = [];
            inactiveSections.forEach(section => {
                // Store information needed for restoration
                removedSections.push({parent: section.parentNode, section: section});
                // Remove the section from the DOM
                section.parentNode.removeChild(section);
            });
            
            return removedSections;
        }

        // Function to restore inactive sections
        function restoreInactiveSections(removedSections) {
            removedSections.forEach(item => {
                item.parent.appendChild(item.section);
            });
        }

        // Example usage
        newForm = removeInactiveSections();
     template = template.replace(new RegExp("{{today-date}}", 'g'), getFormattedTomorrow());
        // template = template.replace((new RegExp('{{today-date}}')), getFormattedTomorrow())

        template = template.replace((new RegExp('{{day-of-week}}')), getDayOfWeek())

       
         template = template.replace(new RegExp("{{date}}", 'g'), getTomorrowDate());

         template = template.replace(new RegExp('{{td-yymmdd}}', 'g'), getTodaysDateInDDMMYY())

           template = template.replace(new RegExp('{{survey-result}}', 'g'),  renderSurveyResult(globalSheetData) )


           
         const keyHandlers = {
                 // 'content-':contentMake,
                 //  'promo-':promoMake,
                  'copy-': renderCopy,

        };


        for (const key of data.keys()) {
                // console.log("print the key",key)
              for (const prefix in keyHandlers) {
                if (key.includes(prefix)) {
                  const handler = keyHandlers[prefix];
                  if (typeof handler === 'function') {
                    handler(key, data.get(key));
                  } else {
                    // await getArticle(data.get(key), key, renderPost, handler);
                  }
                  break;
                }
              }
            }







        const minifyOptions = {
            includeAutoGeneratedTags: true,
            removeAttributeQuotes: true,
            removeComments: true,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            sortClassName: true,
            useShortDoctype: true,
            collapseWhitespace: true
        }

         template = template.replace(new RegExp("{{date}}", 'g'), getTomorrowDate());
        template = template.replace((new RegExp('\{\{.*?\}\}', "g")), '')
        
        

        document.querySelector('#result').value = minify(template, minifyOptions).replace(/(\s)\s+/g, "$1")

        document.querySelector('iframe').contentWindow.document.open()
        document.querySelector('iframe').contentWindow.document.write(minify(template, minifyOptions).replace(/(\s)\s+/g, "$1"))
        waitOff()


    }
})

function waitOn() {
    document.querySelector('.spinner').className += ' wait'
}

function waitOff() {
    document.querySelector('.spinner').className = 'spinner'
}
function renderCopy(key, copy) {
    template = template.replace((new RegExp('\{\{' + key + '\}\}', "g")), copy)
}






async function openTemplate(filepath) {


    let r = await fetch(filepath).then(response => response.text())
    return r


}







async function loadHTMLHere(url) {
    let r = await fetch(url).then(response => response.text())
    return r
}









function getRelevantDate() {
  const now = new Date();
  const hour = now.getHours();

  // If the time is between 0 AM (00:00) and 8 AM (08:00), use today's date
  if (hour < 8) {
    return now; // Use today's date
  } else {
    now.setDate(now.getDate() + 1); // Add 1 day to get tomorrow's date
    return now;
  }
}

function getTomorrowDate() {
  const relevantDate = getRelevantDate();
  
  const dd = String(relevantDate.getDate()).padStart(2, '0');
  const mm = String(relevantDate.getMonth() + 1).padStart(2, '0'); // January is 0!
  const yyyy = relevantDate.getFullYear();
  
  return yyyy + "-" + mm + "-" + dd;
}

function getFormattedTomorrow() {
  const relevantDate = getRelevantDate();
  const options = { year: 'numeric', month: 'long', day: '2-digit' };
  const formattedTomorrow = relevantDate.toLocaleDateString('en-US', options);
  return formattedTomorrow;
}

function getDayOfWeek() {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const relevantDate = getRelevantDate();
  return daysOfWeek[relevantDate.getDay()];
}


function getTodaysDateInDDMMYY() {
  const today = new Date();
  let day = today.getDate().toString().padStart(2, '0');
  let month = (today.getMonth() + 1).toString().padStart(2, '0'); // JavaScript months are 0-based
  let year = today.getFullYear().toString().slice(-2);
  
  return year+ month+day ;
}








async function setupButtonClick() {
    
      await fetchSheetData()
      
}

// Call setupButtonClick once the DOM is fully loaded to ensure the button is available
    document.addEventListener('DOMContentLoaded', setupButtonClick);

function parseData(data) {
    var surveyList = []; // List to store all survey questions
    var currentSurveyQuestion = null; // To keep track of the current question

    data.slice(1).forEach(row => { // Skip the first row
        var question = row[0];
        var answer = row[1];
        var percentage = row[2];

        if (question) {
            // If there's a new question, create a new surveyQuestion object
            currentSurveyQuestion = {
                question: question,
                answers: {}
            };

            // Append the new question to the surveyList
            surveyList.push(currentSurveyQuestion);
        }

        // If there's an answer (and possibly no question, meaning it belongs to the previous question)
        if (answer && percentage) {
            // Find the next available index in the answers object
            var answerIndex = Object.keys(currentSurveyQuestion.answers).length + 1;
            currentSurveyQuestion.answers[answerIndex] = [answer, percentage];
        }

        // Log the current state for debugging
        
    });

    // Log the final surveyList
    console.log("Survey List:", surveyList);

    // You can return the surveyList for further processing or use
    return surveyList;
}


function renderSurveyResult(data) {
    var finalHtml = ''; // Initialize finalHtml as an empty string
    var index = 1;

    data.forEach(row => {
        var que = row.question;

        var surveyHtml = `
            <p style="font-family:Inter,Arial,Sans-serif;font-size:18px;font-weight:500;letter-spacing:-.6px;color:#000;margin-bottom:20px;">${index}&nbsp; ${que}</p>
        `;

        var ans = row.answers;
        for (var key in ans) { // Correct the for loop syntax
            // var answerHtml = `
               
            //         <div style="word-break:break-word;padding:0;vertical-align:top;clear:both;display:block;margin-bottom:2px;margin-top:8px">${ans[key][0]}</div>
            //         <div style="height:fit-content;background-color:#E8E8E8;line-height:0;vertical-align:center;">
            //             <div style="display:inline-block;background-color:#1C9FFF;height:20px;width:${ans[key][1]};" width="${ans[key][1]}" height="20"></div>
            //             <span style="display:inline-block;float:right;line-height:1.5;vertical-align:center;padding-right:5px;">${ans[key][1]}</span>
            //         </div>
            //     `;

            var answerHtml = `
    <table role="presentation" style="width: 100%; margin-top: 8px; margin-bottom: 2px;">
        <tr>
            <td style="padding: 0; vertical-align: top; clear: both; display: block;">
                <div style="word-break: break-word; font-family: Inter, Arial, Sans-serif;">${ans[key][0]}</div>
            </td>
        </tr>
        <tr>
            <td style="background-color: #E8E8E8; height: 20px; padding: 0;border-radius:5px">
                <table role="presentation" style="width: 100%; height: 20px; border-collapse: collapse;">
                    <tr>
                        <td style="background-color: #003965; width: ${ans[key][1]}; height: 20px;border-radius:5px"></td>
                        <td style="text-align: right; padding-right: 5px; font-family: Inter, Arial, Sans-serif; line-height: 20px;">
                            ${ans[key][1]}
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
`;

            surveyHtml += answerHtml; // Concatenate answerHtml to surveyHtml

        }
         

        surveyHtml = `<div style="margin-top:28px; margin-bottom:28px;font-family:Inter,Arial,Sans-serif;font-size:14px;font-weight:500;line-height:1.2;letter-spacing:-.2px;color:#121212;mso-line-height-alt:1.2;"><p style="font-family:Inter,Arial,Sans-serif;font-size:18px;font-weight:600;letter-spacing:-.6px;color:#000;margin-bottom:20px;">${surveyHtml}</div>`
        if (index < data.length) {
            surveyHtml += `<hr style="margin:0;height: 1px; border-width: 0;background-color: #cccccc;">`;
        }
        if(index === 3){
           surveyHtml += buttonHtml 
        }

        index+=1

        finalHtml += surveyHtml; // Concatenate surveyHtml to finalHtml

      
    });

    return finalHtml;
}


       

