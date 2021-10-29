
// Import the functions you need from the SDKs you need

//import { initializeApp } from '/node_modules/firebase/app';

//import { getAnalytics } from "/node_modules/firebase/analytics";
//import { getSystemErrorMap } from "util";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
//import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-analytics.js";
//import { firebase } from "https://www.gstatic.com/firebasejs/3.7.1/firebase.js";
import { getDatabase, ref, set, child ,get, onValue } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-database.js";

// TODO: Replace the following with your apWp's Firebase project configuration

const firebaseConfig = {
    apiKey: "AIzaSyD7G2VBnTAt9bwXw-EWwBRVqr2DxKQGrJc",
    authDomain: "statisticize.firebaseapp.com",
    projectId: "statisticize",
    storageBucket: "statisticize.appspot.com",
    messagingSenderId: "330427551175",
    appId: "1:330427551175:web:93dc117a6455b7d2585de2",
    databaseURL: "https://statisticize-default-rtdb.firebaseio.com",
    measurementId: "G-JXSZKS07YG"
  };
  
  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);
  var numberOfQuestions;
  initialize();
  startListener();
  //console.log("questions" + numberOfQuestions);
/*
  const analytics = getAnalytics(app);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// Get a list of cities from your database
async function getCities(db) {
    const citiesCol = collection(db, 'cities');
    const citySnapshot = await getDocs(citiesCol);
    const cityList = citySnapshot.docs.map(doc => doc.data());
    return cityList;
  }
  async function retrieveData(db){
    const dataCol = collection(db,'data');
    const data2 = await getDocs(dataCol);
    return data2;
  }

  async function addData(db){

  }
  */
function saveToFirebase(firstName, lastName){

  set(ref(database, 'user'), {
    username: firstName,
    lastname: lastName,
    
  });
}
function addQuestion(){

  set(ref(database, 'questions/1'), {
    string: 'How many bones have you broken?'
    
  });
}
function changeQuestion(){

  set(ref(database, 'question'), {
    username: firstName,
    flip: topOrBottom(),    
  });
}
function topOrBottom(){
  var rand = Math.random();
  if(rand < 0.5){
    return "High";
  } else {
    return "Low";
  }
}

function randomQuestionInt(max){
  return Math.floor(Math.random()*max);
}
function initialize(){
  const dbRef = ref(getDatabase());
  //get(child(dbRef, `questions/` + (randomQuestionInt(1) + 1))).then((snapshot) => {
  get(child(dbRef, `questions`)).then((snapshot) => {
  if (snapshot.exists()) {
    //console.log(snapshot.val());
    numberOfQuestions = Object.keys(snapshot.val()).length;
    //console.log("QuestionsPart2: " + numberOfQuestions);
  } else {
    console.log("Huge Errors Occured while Reading");
  }
}).catch((error) => {
  console.error(error);
});
}
function getRandomQuestion(){
  const dbRef = ref(getDatabase());
  get(child(dbRef, `questions/` + (randomQuestionInt(numberOfQuestions) + 1))).then((snapshot) => {
  if (snapshot.exists()) {
    console.log(snapshot.val());
  } else {
    console.log("No data available");
  }
}).catch((error) => {
  console.error(error);
});
}
function startListener(){
  var qBox = document.getElementById("Question");
  var hlBox = document.getElementById("HighLow");
  if(qBox == undefined || hlBox == undefined){
    return;
  }
  const starCountRef = ref(database, 'question/'+ ChopUpUrl(window.location.href));
  onValue(starCountRef, (snapshot) => {
    
  const data = snapshot.val();
  getNewQuestionAndValue(data);
});
}


  export function myFunction()
  {   
  document.body.style.backgroundColor= "#ffdddd";
  }
  window.myFunction = myFunction;
  function changeText(){
    var x = document.getElementById("ChangingDiv");
              
            if (x.innerHTML === "Woah it Changes") {
                x.innerHTML = "Look at it now!";
            } else {
                x.innerHTML = "Woah it Changes";
            }
  }
  window.changeText = changeText;
  function useInput(){
    //document.getElementById("ChangingDiv").innerHTML = "Tried";
    var name = document.getElementById("fname").value;
    var ln = document.getElementById("lname").value;
    //saveToFirebase(name,ln);
    addQuestion();
    getRandomQuestion();
    name = name +" : "+ ln;
    document.getElementById("nameOutput").innerHTML = name;
  }
  window.useInput = useInput;
  function getNewQuestionAndValue(data){
    var qBox = document.getElementById("Question");
    var hlBox = document.getElementById("HighLow");
    qBox.innerHTML = data.string;
    hlBox.innerHTML = data.flip;

  }
  function ChopUpUrl(url){
    
    var strs = url.split('/');
    return strs[strs.length -1].replaceAll('.','') + "q";
    
  }
  function changeQuestionForPage(gotQuestion){
    
    
    set(ref(database, 'question/'+ ChopUpUrl(window.location.href)), {
      string: gotQuestion,
      
      flip: topOrBottom(),    
    });
  }
  window.changeQuestionForPage = changeQuestionForPage;
  window.getNewQuestionAndValue = getNewQuestionAndValue;
  function getRandomQuestionString(){
    const dbRef = ref(getDatabase());
    
    get(child(dbRef, `questions/` + (randomQuestionInt(numberOfQuestions) + 1))).then((snapshot) => {
    if (snapshot.exists()) {
      
      
      changeQuestionForPage(snapshot.val().string);
      startListener();
      
    } else {
      console.log("No data available");
    }
  }).catch((error) => {
    console.error(error);
  });
  
  
  }
  window.getRandomQuestionString = getRandomQuestionString;
  updateQuestions();
  function updateQuestions(){
    var strs="How many bones have you broken?\nHow many cousins do you have?\nHow many states have you been to?\nHow long since your last meal (hours)?\nHow long since you went swimming (days)?\nHow many movies have you watched in the last week?\nHow many languages do you know how to say Hello in?\nHow many pillows are currently on your bed?\nHow much sleep did you get last night (hours)?\nHow many different mirrors have you looked in in the last 24 hours?\nHow tall are you (inches)?\nHow fast can you type in wpm?\nHow many things are on your task bar\nHow many things are on your desktop\nHow many discord servers are you on, 0 if no discord\nHow many pets have you had?\nHow long since you had cake (days)?\nHow many hoodies do you own?\nHow many shoes do you own?\nHow many languages do you speak?\nHow many different sports have you been on a team for?\nHow many classes have you skipped this semester?\nHow many pieces of clothing are you wearing right now?\nHow long since your last haircut (days)\nHow long did you spend making breakfast this morning (minutes)\nHow long did you spend in bed before getting up this morning (minutes)\nHow long did you spend in your home between waking up and leaving for the first time today (minutes)\nHow many rings do you own?\nHow many monitors are on your desk?\nHow many lights are in your room?\nHow long since you read a book (days)?\nHow long can you hold your breath (seconds)?\nHow many pokemon can you name?\nHow many apps do you have on your phone?\nHow many pages do you have on your phone?\n".split("\n");


    for(var i = 0; i < strs.length; i += 1){
      set(ref(database, 'questions/'+i), {
        string: strs[i]
        
      });
    }
  }
  

