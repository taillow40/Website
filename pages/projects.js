
    const openCircle = `<div style='background-color: rgb(210,210,210); height: 80%; aspect-ratio: 1; border-radius: 100%; border: 1px solid black; float: left;'></div> `
    const closedCircle =`<div style='background-color: rgb(255,255,255); height: 80%; aspect-ratio: 1; border-radius: 100%; border: 1px solid black; float: left;'></div> `
    var display = "Personal";
    
function SetupButtons(imageStringArray, boxID){
    imageStringArray;
        
        box = document.getElementById(boxID);
        e_imageBox = box.querySelector('.projectBox_Image');
        e_imageBox.setAttribute('style', `background-image: url(${imageStringArray[0]})`)
        e_buttonLeft = box.querySelector('.projectBox_SelectorButton.left')
        e_buttonRight = box.querySelector('.projectBox_SelectorButton.right')
        e_icons = box.querySelector('.projectBox_ImageSelector');
        e_buttonLeft.addEventListener("click", moveBack);
        e_buttonRight.addEventListener("click", moveNext);
        e_imageBox.addEventListener("click", () => {displayBigImage(imageStringArray, boxID)});
        i = 0;
        drawButtons();
    
    function moveNext (){
        
        i = i + 1;
        i = (i >= imageStringArray.length)? 0 : i;
        e_imageBox = document.getElementById(boxID).querySelector('.projectBox_Image');
        e_icons = document.getElementById(boxID).querySelector('.projectBox_ImageSelector');
        e_imageBox.setAttribute('style', `background-image: url(${imageStringArray[i]})`);
        drawButtons();
    }
    function moveBack (){
        i = i - 1;
        i = (i <= -1)? imageStringArray.length-1 : i;
        e_imageBox = document.getElementById(boxID).querySelector('.projectBox_Image');
        e_icons = document.getElementById(boxID).querySelector('.projectBox_ImageSelector');
        e_imageBox.setAttribute('style', `background-image: url(${imageStringArray[i]})`);
        drawButtons();
    }
    function drawButtons(){
        var stringBuilder = ''
        for(var i2 = 0; i2 < imageStringArray.length; i2+= 1){
            if(i2 == i){
                stringBuilder += closedCircle;
            } else {
                stringBuilder += openCircle;
            }          
        }
        
        e_icons.innerHTML = stringBuilder;
    }

}
function switchDisplay(){
    if(display == "Personal"){
        document.querySelector('.content').setAttribute('style','display: none;');
        document.querySelector('.professionalContent').setAttribute('style','display: true;');
        document.getElementById('Personal').setAttribute('style', "text-decoration-line: none;");
        document.getElementById('Professional').setAttribute('style', "text-decoration-line: underline;");
       
        display = "Professional"
    } else if(display == "Professional"){
        document.querySelector('.professionalContent').setAttribute('style','display: none;');
        document.getElementById('Personal').setAttribute('style', "text-decoration-line: underline;");
        document.getElementById('Professional').setAttribute('style', "text-decoration-line: none;");
        document.querySelector('.content').setAttribute('style','display: true;');
        display = "Personal"
    }
}


function displayBigImage(imageStringArray, boxID){
    box = document.getElementById("ImageDisplay");
    e_imageBox = box.querySelector('.ImageDisplay_Image');
    
    e_buttonLeft = box.querySelector('.ImageDisplay_SelectorButton.left')
    e_buttonRight = box.querySelector('.ImageDisplay_SelectorButton.right')
    e_icons = box.querySelector('.ImageDisplay_ImageSelector');
    e_buttonLeft.addEventListener("click", moveBack);
    e_buttonRight.addEventListener("click", moveNext);

    i2 = findI2();
    
    drawButtons();
    
    e_imageBox.setAttribute('style', `background-image: url(${imageStringArray[i2]})`)
    document.querySelector('.body').style.overflow = 'hidden';
    document.getElementById('ImageDisplay').setAttribute('style',"width: 100vw; height: 100vh; position: fixed; left: 0%; top: 0%; z-index: 1; background-color: rgba(0,0,0,0.8);");
    function findI2(){
        
        myChildren = document.getElementById(boxID).querySelector('.projectBox_ImageSelector').children;
        console.log(myChildren.length);
        if(myChildren.length == 1){
            return 0;
        }
        
        for(z = 1; z < myChildren.length - 1; z += 1){
            if(myChildren[z-1].style.backgroundColor != myChildren[z].style.backgroundColor && myChildren[z-1].style.backgroundColor != myChildren[z+1].style.backgroundColor){                
                return z -1
            }
            if(myChildren[z-1].style.backgroundColor != myChildren[z].style.backgroundColor && myChildren[z].style.backgroundColor != myChildren[z+1].style.backgroundColor){
                return z;
            }
            if(myChildren[z+1].style.backgroundColor != myChildren[z].style.backgroundColor && myChildren[z-1].style.backgroundColor != myChildren[z+1].style.backgroundColor){
                return z +1;
            }
        }
         
    }
    function moveNext (){
        
        i2 = i2 + 1;
        i2 = (i2 >= imageStringArray.length)? 0 : i2;
        e_imageBox = document.getElementById("ImageDisplay").querySelector('.ImageDisplay_Image');
        e_icons = document.getElementById("ImageDisplay").querySelector('.ImageDisplay_ImageSelector');
        e_imageBox.setAttribute('style', `background-image: url(${imageStringArray[i2]})`);
        drawButtons();
    }
    function moveBack (){
        i2 = i2 - 1;
        i2 = (i2 <= -1)? imageStringArray.length-1 : i2;
        e_imageBox = document.getElementById("ImageDisplay").querySelector('.ImageDisplay_Image');
        e_icons = document.getElementById("ImageDisplay").querySelector('.ImageDisplay_ImageSelector');
        e_imageBox.setAttribute('style', `background-image: url(${imageStringArray[i2]})`);
        drawButtons();
    }
    function drawButtons(){
        var stringBuilder = ''
        for(var i3 = 0; i3 < imageStringArray.length; i3+= 1){
            if(i3 == i2){
                stringBuilder += closedCircle;
            } else {
                stringBuilder += openCircle;
            }          
        }
        
        e_icons.innerHTML = stringBuilder;
    }

}
function hideBigImage(){
    imageDisplay = document.getElementById('ImageDisplay');
    imageDisplay.setAttribute('style', "display:none;");
    document.querySelector('.body').style.overflow = 'visible';
    imageDisplay.innerHTML=` <div class="ImageDisplay_Image" onclick="hideBigImage()"></div>
    <div class="ImageDisplay_ImageSelector"></div>
    <div class="ImageDisplay_X" onclick="hideBigImage()">X</div>
    <button class="ImageDisplay_SelectorButton left">&lt</button>
    <button class="ImageDisplay_SelectorButton right">&gt</button>`;
}
