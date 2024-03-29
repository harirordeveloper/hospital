function createAjaxObj(){
var httprequest=false
if (window.XMLHttpRequest &&!window.ActiveXObject){ // if Mozilla, Safari etc
httprequest=new XMLHttpRequest()
if (httprequest.overrideMimeType)
httprequest.overrideMimeType('text/xml')
}
else if (window.ActiveXObject){ // if IE
try {
httprequest=new ActiveXObject("Msxml2.XMLHTTP");
} 
catch (e){
try{
httprequest=new ActiveXObject("Microsoft.XMLHTTP");
}
catch (e){}
}
} //end IE
return httprequest
}

function ajax_ticker(xmlfile, divId, divClass, delay, fadeornot){
this.xmlfile=xmlfile //Variable pointing to the local ticker xml file (txt)
this.tickerid=divId //ID of ticker div to display information
var delay=(typeof delay=="number")? [delay] : delay //convert parameterif string into array [delay, refetchdelay]
this.delay=delay[0] //Delay between msg change, in miliseconds.
this.refetchdelay=delay[1] //Delay between refetching of Ajax contents
this.mouseoverBol=0 //Boolean to indicate whether mouse is currently over ticker (and pause it if it is)
this.pointer=0
this.opacitystring=(typeof fadeornot!="undefined")? "width:100%;margin:0 auto;text-align:center; filter:progid:DXImageTransform.Microsoft.alpha(opacity=100); opacity: 1" : ""
if (this.opacitystring!="") this.delay+=500 //add 1/2 sec to account for fade effect, if enabled
this.opacitysetting=0.2 //Opacity value when reset. Internal use.
this.messages=[] //Arrays to hold each message of ticker
this.ajaxobj=createAjaxObj()
document.write('<div id="'+divId+'" class="'+divClass+'"><div style="'+this.opacitystring+'">Initializing ticker...</div></div>')
this.getXMLfile()
}

ajax_ticker.prototype.getXMLfile=function(){
this.ajaxobj=createAjaxObj() //recreate Ajax object (IE seems to require it)
if (this.ajaxobj){
var instanceOfTicker=this
var url=this.xmlfile+"?bustcache="+new Date().getTime()
this.ajaxobj.onreadystatechange=function(){instanceOfTicker.initialize()}
this.ajaxobj.open('GET', url, true)
this.ajaxobj.send(null)
}
}

// -------------------------------------------------------------------
// initialize()- Initialize ticker method.
// -Gets contents of xml file and parse it using JavaScript DOM methods 
// -------------------------------------------------------------------

ajax_ticker.prototype.initialize=function(){
if (this.ajaxobj.readyState == 4){ //if request of file completed
if (this.ajaxobj.status==200 || window.location.href.indexOf("http")==-1){ //if request was successful
this.contentdiv=document.getElementById(this.tickerid).firstChild //div of inner content that holds the messages
var xmldata=this.ajaxobj.responseText
this.contentdiv.style.display="none"
this.contentdiv.innerHTML=xmldata
if (this.contentdiv.getElementsByTagName("div").length==0){ //if no messages were found
this.contentdiv.innerHTML="<b>Error</b> fetching remote ticker file!"
return
}
var instanceOfTicker=this
document.getElementById(this.tickerid).onmouseover=function(){instanceOfTicker.mouseoverBol=1}
document.getElementById(this.tickerid).onmouseout=function(){instanceOfTicker.mouseoverBol=0}
clearTimeout(this.fadetimer1) //clear timers
clearTimeout(this.pausetimer)
clearTimeout(this.rotatetimer)
this.mouseoverBol=0
this.messages=[] //reset messages[] to blank array (in the event initialize is being called again)
//Cycle through XML object and store each message inside array
for (var i=0; i<this.contentdiv.getElementsByTagName("div").length; i++){
if (this.contentdiv.getElementsByTagName("div")[i].className=="message")
this.messages[this.messages.length]=this.contentdiv.getElementsByTagName("div")[i].innerHTML
}
this.contentdiv.innerHTML=""
this.contentdiv.style.display="block"
this.rotatemsg()
if (this.refetchdelay>5000) //if refetch data delay is greater than 5 seconds
setTimeout(function(){instanceOfTicker.getXMLfile()}, this.refetchdelay)
}
}
}

// -------------------------------------------------------------------
// rotatemsg()- Rotate through ticker messages and displays them
// -------------------------------------------------------------------

ajax_ticker.prototype.rotatemsg=function(){
var instanceOfTicker=this
if (this.mouseoverBol==1) //if mouse is currently over ticker, do nothing (pause it)
this.pausetimer=setTimeout(function(){instanceOfTicker.rotatemsg()}, 100)
else{ //else, construct item, show and rotate it!
if (this.contentdiv.filters) //In IE, reapply filter attribute each time
this.contentdiv.style.filter="progid:DXImageTransform.Microsoft.alpha(opacity="+(this.opacitysetting*100)+")";
this.fadetransition("reset")
this.contentdiv.innerHTML=this.messages[this.pointer]
this.fadetimer1=setInterval(function(){instanceOfTicker.fadetransition('up', 'fadetimer1')}, 100) //FADE EFFECT- PLAY IT
this.pointer=(this.pointer<this.messages.length-1)? this.pointer+1 : 0
this.rotatetimer=setTimeout(function(){instanceOfTicker.rotatemsg()}, this.delay) //update container periodically
}
}

// -------------------------------------------------------------------
// fadetransition()- cross browser fade method for IE5.5+ and Mozilla/Firefox
// -------------------------------------------------------------------

ajax_ticker.prototype.fadetransition=function(fadetype, timerid){
var contentdiv=this.contentdiv
if (fadetype=="reset")
this.opacitysetting=0.2
if (contentdiv.filters && contentdiv.filters[0]){
if (typeof contentdiv.filters[0].opacity=="number") //IE6+
contentdiv.filters[0].opacity=this.opacitysetting*100
else //IE 5.5
contentdiv.style.filter="alpha(opacity="+this.opacitysetting*100+")"
}
else if (contentdiv.style.opacity!="undefined"){
contentdiv.style.opacity=this.opacitysetting
}
else
this.opacitysetting=1
if (fadetype=="up")
this.opacitysetting+=0.1
if (fadetype=="up" && this.opacitysetting>=1){
if (contentdiv.style && contentdiv.style.removeAttribute)
contentdiv.style.removeAttribute('filter') //fix IE clearType problem
clearInterval(this[timerid])
}
}