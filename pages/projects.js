
    const openCircle = `<div style='background-color: clear; height: 80%; aspect-ratio: 1; border-radius: 100%; border: 1px solid black; float: left;'></div> `
    const closedCircle =`<div style='background-color: white; height: 80%; aspect-ratio: 1; border-radius: 100%; border: 1px solid black; float: left;'></div> `

    
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
        console.log(boxID);
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
