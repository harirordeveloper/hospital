
function change_menu(p)
{
for(i=11;i<=15;i++){
if(p=="p"+i+""){
document.getElementById("tab"+i+"").className="tab_active"
document.getElementById("block"+i+"").style.display='block';
}

else{
document.getElementById("tab"+i+"").className="tab_inactive"
document.getElementById("block"+i+"").style.display='none';
}		
}	 
}

function test_mouse(p)
{
for(i=11;i<=15;i++){
if(p=="p"+i+""){
document.getElementById("tab"+i+"").className="tab_inactive"
document.getElementById("block"+i+"").style.display='none';
}

else{
document.getElementById("tab"+i+"").className="tab_inactive"
document.getElementById("block"+i+"").style.display='none';

}		
}	 
}

/*Awards*/
function archangeTab(t)
{
for(i=1;i<=5;i++){
if(t=="t"+i+""){
document.getElementById("tabss"+i+"").className="tab_select";
document.getElementById("ar"+i+"").style.display='block';
}
else{
document.getElementById("tabss"+i+"").className="tab_unselect";
document.getElementById("ar"+i+"").style.display='none';
}}}

function blockError(){return true;}
window.onerror = blockError;