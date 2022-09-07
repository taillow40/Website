olddisplay = "SurfingSwimming"
function switchDisplay(id){
    document.getElementById(olddisplay).style.display = 'none'
    document.getElementById(olddisplay+'Selector').style.backgroundColor = 'rgb(119, 189, 214)';
    document.getElementById(id).style.display = 'block'
    document.getElementById(id +'Selector').style.backgroundColor = 'rgb(190, 218, 228)'
    olddisplay = id;
}