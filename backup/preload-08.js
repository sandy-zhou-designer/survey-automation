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
    const range = 'Sheet1!A1:C80'; // Adjust the range as needed

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

// fetchSheetData().catch(console.error);



// AIzaSyADTB3SyzFxjC0fAIeHBmJVoecHG_jngyI


//////////
// const { google } = require('googleapis');
// const sheets = google.sheets('v4');
// const fs = require('fs');
// const path = require('path');


// const SERVICE_ACCOUNT_FILE = path.join(__dirname, './json/morning-brief-epoch-times-c5e87f3da780.json');

// Authenticate using the service account key file
// const auth = new google.auth.GoogleAuth({
//     keyFile: SERVICE_ACCOUNT_FILE,
//     scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
// });






var otherNewsletter1= ""
var otherNewsletter2= ""
var tv="";
var template = "";
var article = "";
var opinion = "";
var other = "";
var top="";
var highlight=""
var highlight2=""
var list =""
var first=""

var recommends = ""
var happy=""
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



var listOfUtms = {
 
      "morningbrief":"MB_article_",
   
}







var newsletterTemplate = templateList["morningbrief"];



window.addEventListener('DOMContentLoaded', async () => {

        
		
        
        userTypeAction()

        document.querySelector('#submit').onclick = async function(e) {
        e.preventDefault()

        waitOn()

    
        var includingPromo = true



                
         template = await openTemplate(newsletterTemplate.template)
    
     

      
        var surveyType = includingPromo?"f":"p"
        template =  template.replace(new RegExp("{{survey-type}}", 'g'), surveyType);
       


        if(newsletterTemplate.article)  article = await openTemplate(newsletterTemplate.article)
        if(newsletterTemplate.list) list = await openTemplate(newsletterTemplate.list)
        if(newsletterTemplate.tv) tv= await openTemplate(newsletterTemplate.tv)
        if(newsletterTemplate.happy) happy = await openTemplate(newsletterTemplate.happy)
        
        if(newsletterTemplate.opinion) opinion = await openTemplate(newsletterTemplate.opinion)
       
   
                                 
     if(newsletterTemplate.highlight) highlight = await openTemplate(newsletterTemplate.highlight)
            if(newsletterTemplate.highlight2) highlight2 = await openTemplate(newsletterTemplate.highlight2)
           
 

       

        
        
        if(newsletterTemplate.other) other = await openTemplate(newsletterTemplate.other)
        if(newsletterTemplate.first) first = await openTemplate(newsletterTemplate.first)

        
        if(newsletterTemplate.recommends) recommends = await openTemplate(newsletterTemplate.recommends)
         

        

	

        var content = {}

        // var activeSection = document.querySelector(`.${newsletter}`)
        // console.log(document.querySelector(`.${newsletter}`))
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






        const keyHandlers = {

       
          'content-':contentMake,
          'promo-':promoMake,
          'copy-': renderCopy,
          'article-': 'article',
          // 'opinion-': 'opinion',
          // 'tv-': 'tv',
          // 'other-': 'other',
          // "top-":"top",
          // "highlight-":"highlight",
          // "highlight2-":"highlight2",
          // "list-":"list",
          // "first-":"first",
          // "recommends-":"recommends",
          // "happy-":"happy"

        };

        // top = contentMake(key,data.get(key))



const largestNumbersByCategory = {};

for (const key of Array.from(data.keys()).reverse()) {
  for (const prefix in keyHandlers) {
    if (key.includes(prefix)) {
      const handler = keyHandlers[prefix];
      const dataValue = data.get(key);  // Get the data value associated with the key

      // Step 2: Check if dataValue is undefined or an empty string, skip if true
  
      if (typeof handler === 'function') {
      
        handler(key, dataValue);
      } else {
        if (!dataValue) {
        console.warn(`Skipping key: ${key} due to missing or empty data value`);
        continue;  // Skip to the next iteration instead of returning
         }


       // Step 3: Get the `alt` value using your existing function
      const alt = getAlt(key);

      // Step 4: Ensure `alt` is valid before processing
      if (alt) {
          console.log("alt is", alt);

          // Step 5: Extract the category and number from `alt`
          const altParts = alt.match(/(.*?)-(\d+)$/);  // Capture category and number
          if (altParts) {
            const category = altParts[1];              // e.g., 'more-top-news'
            const number = parseInt(altParts[2], 10);  // e.g., 7

            // Step 6: Compare with the largest number stored for this category
            if (!largestNumbersByCategory[category] || number > largestNumbersByCategory[category]) {
              largestNumbersByCategory[category] = number;  // Update to the new largest number
              var isLargestNumber = true;
            } else {
              var isLargestNumber = false;
            }

            // Step 7: Log or handle `isLargestNumber` as needed
            console.log(`For category ${category}, isLargestNumber: ${isLargestNumber}`);
          }
        } 

        // Continue with the async article fetching
        await getArticle(dataValue, key, renderPost, handler,isLargestNumber);
      }
      break;
    }
  }
}


     // for (const key of data.keys()) {
     //        // console.log("print the key",key)
     //      for (const prefix in keyHandlers) {
     //        if (key.includes(prefix)) {
     //          const handler = keyHandlers[prefix];
     //          if (typeof handler === 'function') {
     //            handler(key, data.get(key));
     //          } else {
     //            await getArticle(data.get(key), key, renderPost, handler);
     //          }
     //          break;
     //        }
     //      }
     //    }



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


    function promoMake(key, copy) {
        promoCheckbox = document.querySelector('input[name="promo-check"]');

        if(promoCheckbox.checked){
            renderCopy(key, copy)
        }
        // for (var key in c)
        //     if (key.includes('promo-'))
        //         promo = promo.replace((new RegExp('\{\{' + key + '\}\}', "g")), c[key])

        // return promo
    }


    function contentMake(key, copy) { 
        // console.log("the key is ", key)
        // console.log("the copy is ",copy)

        // for (var key in c) 
  
            if(key.includes('content-text')){
                template = template.replace((new RegExp('\{\{'+key+'\}\}',"g")), copy)
               
            }
        // return top

    }
    




async function renderPost(key, post,type,isLargestNumber) {

    console.log("isLargestNumber", isLargestNumber)


      const typeToFunction = {
          article: makeArticle(article, post),
          opinion: makeArticle(opinion, post),
          tv: makeArticle(tv, post),
          other: makeArticle(other, post),
          top: makeArticle(top, post),
          highlight: makeArticle(highlight, post),
          highlight2: makeArticle(highlight2, post),
          list:makeArticle(list, post),
              first:makeArticle(first, post),
              recommends:makeArticle(recommends, post),
              happy:makeArticle(happy, post),

      };


      var breakList= isLargestNumber?"": `<hr style="margin:0;height: 1px; border-width: 0;background-color: #cccccc;">`
       var breakOther= isLargestNumber?"":`<tr style="padding: 0; margin: 0;" class="mobile_hide"><td><hr style="margin:0;height: 1px; border-width: 0;background-color: #cccccc;"></td></tr>`
      
      



        if (type in typeToFunction) {

              if(type==="list"||type==="tv"||type==="happy"){
               var addedContent = typeToFunction[type]+breakList
                 template = template.replace(new RegExp('{{' + key + '}}', 'g'), addedContent);
              }

              else{
               
              var addedContent = typeToFunction[type]+breakOther
              template = template.replace(new RegExp('{{' + key + '}}', 'g'), addedContent);

              }

          

        }

   


    waitOff()




    function makeArticle(articleType, post) {
      if (!post) return '';


      // if (articleType ==="top"){
      //   console.log("top html is ", top)
      // }

      const replacements = {
        '{{article-link}}': post.url,
        '{{article-title}}': post.title,
        '{{article-author}}': post.author,
        '{{three_word_from_title}}': post.first_three_word,
        '{{utm}}': post.utm,
        '{{date}}': getTomorrowDate(),
        '{{author-img}}': post.authorImage,
        '{{trackingName}}': post.trackingName,
        '{{article-img}}': post.img,
        '{{image_caption}}': post.image_caption,
       '{{author-url}}': post.authorUrl,
       '{{categories}}':post.categories,
       // '{{utmContent}}':post.utmContent ,
       '{{alt}}':post.alt,
       

      };

      let result = articleType;

      for (const [placeholder, value] of Object.entries(replacements)) {
        result = result.replace(new RegExp(placeholder, 'g'), value);
      }

      return result;
    }



}
async function openTemplate(filepath) {


    let r = await fetch(filepath).then(response => response.text())
    return r
}
async function getArticle(url, key, callback,type,isLargestNumber) {
    if (!url) {

        template = template.replace((new RegExp('\{\{' + key + '\}\}', "g")), '')
        return null

    }
    await loadHTML(url, key, callback,type,isLargestNumber)
    return

}



async function loadHTML(url, key, renderFunction,type,isLargestNumber) {
    try {
        let cleanUrl = (new URL(url)).pathname;
        let id = cleanUrl.trim().match(/\d+$/)[0];
        
        // const data = await fetch('https://api.theepochtimes.com/epoch/eet/v1/get_single_post_go?id=' + id).then(response => response.json());
         const data = await fetch('https://www.theepochtimes.com/gapi/posts/' + id).then(response => response.json());

           // https://www.theepochtimes.com/gapi/posts/


            var newTitle = customizedTitle(key)

            var title =newTitle?newTitle: data.title;
            // console.log("title is ",title)
             var authorImage = "";
             var authorUrl = ""
             var categories="";
             var alt=""

             alt= getAlt(key)

             // console.log("the key is ", key)
             




            authorImage =data.authors[0].avatar? data.authors[0].avatar:"https://www.theepochtimes.com/assets/themes/eet/images/default-user.png"
            // console.log("author url", authorImage)
            if(data.authors[0].uri) authorUrl = "https://www.theepochtimes.com"+data.authors[0].uri;


            


            categories = data.categories?.[0]?.name ?? "";

           
            // if(data.categories[0].name && type==="article") categories = data.categories[0].name;


            let myTags = "";


            var img = data.thumbnail.medium

       
            


            parser = new DOMParser()
           
            var first_three_word =data.content[0].text
            first_three_word = truncateStringByWords(first_three_word, 50);
            var userStatus = "free";
      
            var trackingName = listOfUtms[newsletter]
            if(data.thumbnail.caption) {var image_caption =  data.thumbnail.caption
                image_caption =getWordsInsideParentheses(image_caption)
            }



           
            


            // if(isPremium(data)){
            //     title = "<b style='color:#3890CF'>Premium: </b>" + title
            // }



            var utm = "&utm_source="+ trackingName +userStatus;
             // if(newsletter==="morningbrief"||newsletter==="weekendbrief"){
                
             //    utm = utm + abTesting
             // }
           

        // ... your existing code ...

      
        // var authorElement = await makeAuthor(url, key);
        var author = data.authors[0].name;
       
       


        
        renderFunction(key, {
            url,
            img,
            title,
            author,
            first_three_word,
            utm,
            categories,
            // myTags,
            trackingName,
            authorImage,
            image_caption,
            authorUrl,
           alt,
           
        },type,isLargestNumber);
    } catch (error) {
        console.error("Error fetching or rendering data:", error);
    }
}






async function loadHTMLHere(url) {
    let r = await fetch(url).then(response => response.text())
    return r
}



function truncateStringByWords(inputString, wordLimit) {
  const words = inputString.split(' ');
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(' ') + '...';
  }
  return inputString;
}



function radioActions(){
        
           var radioButton = document.querySelectorAll('input[name="newsletter"]');
        
           radioButton.forEach(el => el.addEventListener("click", e => {

                newsletter  = e.target.id;
                if(newsletter.includes("brief")){
                    document.querySelector("input[name='copy-date']").classList.add("hide");
                    if(newsletter!="oldbrief"){
                         document.querySelector("#editor-message").classList.remove("hide");
                    }
                   
                }

                newsletterTemplate = templateList[newsletter]


               var targetSection = document.querySelector("."+newsletter);
       


                let siblings = document.querySelectorAll(".newsletter-ca")
                for(let sib of siblings) {
                sib.classList.remove("active")
                }
                // var newsletterTemplate = templateList["sevenDay"];
               targetSection.classList.add("active");

        
         }));  
}


function abTestingAction(){

           var radioButton = document.querySelectorAll('input[name="abTesting"]');
           radioButton.forEach(el => el.addEventListener("click", e => {

             version  = e.target.id;
            
                             
         })); 

}




function userTypeAction(){

           var radioButton = document.querySelectorAll('input[name="userType"]');
           radioButton.forEach(el => el.addEventListener("click", e => {

             userType  = e.target.id;
           return userType
                             
         })); 

           
}


function getWordsInsideParentheses(inputString) {
  const regex = /\((.*?)\)/g;
  const matches = inputString.match(regex);

  if (matches) {
    const wordsInsideParentheses = matches.map(match => match.replace(/\(|\)/g, '').trim());
    return wordsInsideParentheses;
  }

  return [];
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


function getAlt(key){
      if(document.querySelector(`[name="${key}"]`)) 

        {const element = document.querySelector(`[name="${key}"]`);
            // console.log("element is", element)

       if(element && element.hasAttribute('alt')) {
                // Get the alt attribute value\

            const alt = element.getAttribute('alt');
            // console.log("alt is", alt)
             return alt
            // Optionally, you can pair this with the element's name or value
        }
    }
}

function customizedTitle(key){
    if(document.querySelector(`[name="${key}"]`)) 

        {const element = document.querySelector(`[name="${key}"]`);
            // console.log("element is", element)

       if(element && element.hasAttribute('content')) {
                // Get the alt attribute value\

            const content = element.getAttribute('content');
            // console.log("alt is", alt)
             return content
            // Optionally, you can pair this with the element's name or value
        }
    }

}


function cleanUpData(formData) {
  // Keeping track of the highest index to add new items correctly
  let highestIndex = Object.keys(formData).reduce((max, current) => Math.max(max, parseInt(current)), 0);

  var breakHtml = "<br><span style='display:block;height:15px'></span>"
  Object.values(formData).forEach((item, index) => {
    // Existing rules for replacing Link with Headline
    if (item.id==="copy-editor-message"){
        item.Link = item.Content;
    }else if(item.id==="copy-title" || item.id==="copy-preheader") {
      item.Link = item.Headline;
    }else{
        formData[(highestIndex+1)] = {
        id: "copy-wise-person",
        Link: item.Headline
      };
    }
    // item.id !== "copy-word-of-wisdom"

    // Additional rules for creating new items based on specific item IDs
    const mappings = {
      "top-news-1": "content-text-1",
      "highlight-news-1": "content-text-2",
      "highlight2-news-1": "content-text-3",
      // "copy-word-of-wisdom":"copy-wise-person"
    };

    if (item.id in mappings) {
      // Prepare new item's properties

      const newItemId = mappings[item.id];
      item.Content=wrapImportantText(item.Content)
      var newItemLinkValue = item.Content; // Assuming item.Content exists

      let paragraphs = newItemLinkValue.trim().split(/\n+/);


      newItemLinkValue =  paragraphs.join(breakHtml);


      // Increment highestIndex to ensure a unique index for the new item
      highestIndex++;

      // Add new item to formData
      formData[highestIndex] = {
        id: newItemId,
        Link: newItemLinkValue
      };
    }
  });

  return formData;
}

function wrapImportantText(str) {
  // Regular expression to find "Why It Matters:"
  var pattern = /Why It Matters:/g;

  // Replace the matched text with wrapped text
  var updatedStr = str.replace(pattern, "<b>$&</b>");
  return updatedStr;
}


function updateFormInputs(formSelector, formData) {
  const form = document.querySelector(formSelector); // Select the existing form by its selector
  formData = cleanUpData(formData);
  
  Object.values(formData).forEach(item => {
    // Query both input and textarea elements within the form that match the item's id as their name attribute
    const element = form.querySelector(`input[name="${item.id}"], textarea[name="${item.id}"]`);
    if (element) {
      // If a matching element is found, update its value with item.Link
      element.value = item.Link;

     if(item.Headline)element.setAttribute('content', item.Headline);
      
    }
  });

}

async function setupButtonClick() {
      const button = document.getElementById('fillForm');
      await fetchSheetData()
      if (button) {
        button.addEventListener('click', function() {

           

          updateFormInputs('form', globalSheetData); // Adjust 'form' if your form has a more specific selector

        });
      } else {
        console.error('Button with ID "fillForm" was not found.');
      }
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
       

