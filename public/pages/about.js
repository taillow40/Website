olddisplay = "SurfingSwimming"
function switchDisplay(id){
    document.getElementById(olddisplay).style.display = 'none'
    document.getElementById(olddisplay+'Selector').style.backgroundColor = getComputedStyle(document.querySelector(':root')).getPropertyValue('--color-blue-white');
    document.getElementById(id).style.display = 'block'
    document.getElementById(id +'Selector').style.backgroundColor = getComputedStyle(document.querySelector(':root')).getPropertyValue('--color-blue-blue-white');
    olddisplay = id;
}