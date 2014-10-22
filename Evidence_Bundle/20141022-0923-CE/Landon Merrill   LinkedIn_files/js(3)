LI.define("StyledDropdown");
LI.StyledDropdown=function(c,C){C={name:C.name||null,autoPosition:(C.autoPosition===false)?false:true,align:(C.align)?C.align:"left",containerClass:(C.containerClass)?C.containerClass:"styled-dropdown",listClass:(C.listClass)?C.listClass:null,normalLinkClass:(C.normalLinkClass)?C.normalLinkClass:"normal-link",openOnHover:(C.openOnHover)?C.openOnHover:false,stickyLabel:(C.stickyLabel)?C.stickyLabel:false,applyOptionClassToLabel:(C.applyOptionClassToLabel)?C.applyOptionClassToLabel:false};
var q=c,v=null,B=null,u=[],m=null,n=null,g=40,w=38,s=27,j=13,b=false,y=0,k=-1,h=0,x=0,r=false,d="disabled",p=null,o=null,a="itemSelectEvent",e,A,l,i,z,E,D,i,f;
v=Y$("select",q,true);
m=Y$("span.label",q,true);
B=Y$("ul",q,true);
if(!B){B=document.createElement("ul");
q.appendChild(B)
}if(!m){if(C.applyOptionClassToLabel){o=['<span class="label">','<span class="',v.options[v.selectedIndex].className,'">',v.options[v.selectedIndex].text,"</span>","</span>"].join("")
}else{o=['<span class="label">',"<span>",v.options[v.selectedIndex].text,"</span>","</span>"].join("")
}z=LI.domify(o);
q.insertBefore(z,v)
}m=Y$("span.label span",q,true);
YDom.addClass(q,C.containerClass);
YDom.addClass(B,C.listClass);
function t(){var L=":false;",K,G,H=v.options,J=B.firstChild,I=0,F;
if(!b){if(YAHOO.env.ua.ie&&YAHOO.env.ua.ie<7){n=document.createElement("iframe");
n.src="javascript"+L;
q.appendChild(n)
}x=v.options.length;
for(I=0;
I<x;
I++){K=H[I];
G=document.createElement("li");
G.innerHTML="<div>"+LI.htmlEncode(K.text)+"</div>";
YDom.addClass(G,K.className+" option");
if(K.selected&&y===0){m.innerHTML=LI.htmlEncode(K.text);
y=I;
h=I
}if(I===0){YDom.addClass(G,"first")
}else{if(I+1===F){YDom.addClass(G,"last")
}}if(J){B.insertBefore(G,J)
}else{B.appendChild(G)
}}u=B.getElementsByTagName("li");
for(I=0,F=u.length;
I<F;
I++){u[I]._index=I
}b=true
}}f=function(){if(r){return
}var G=YDom.getRegion(B),K=YDom.getRegion(m.parentNode),J,I,H,F;
if(C.align==="right"){J=[K.right-B.clientWidth,K.bottom]
}else{J=[K.left,K.bottom]
}YDom.addClass(q,"open");
if(C.autoPosition){YDom.setXY(B,J)
}if(YAHOO.env.ua.ie&&YAHOO.env.ua.ie<7){if(G){n.style.height=G.height+"px";
n.style.width=G.width+"px"
}YDom.setXY(n,YDom.getXY(B))
}I=YDom.getElementsByClassName("highlighted","li",B);
for(H=0,F=I.length;
H<F;
H++){YDom.removeClass(I[H],"highlighted")
}YDom.addClass(u[v.selectedIndex],"highlighted")
};
E=function(){YDom.removeClass(q,"open")
};
D=function(G){G=G||window.event;
var H=v.selectedIndex,K=G.keyCode,J,I,F;
J=YDom.getElementsByClassName("selected","li",B);
for(I=0,F=J.length;
I<F;
I++){YDom.removeClass(J[I],"selected")
}if(G.type==="keydown"){if(K===j){H=y
}else{if(K===g&&y>=x-1){H=y+1
}else{if(K===w&&y>=x){H=y-1;
v.selectedIndex=x-1
}}}}if(!u[H]){H=y
}YDom.addClass(u[H],"selected");
y=H;
f();
if(G.type!=="blur"){e(G)
}};
i=function(){if(!YDom.hasClass(q,"open")&&!C.stickyLabel){m.innerHTML=v.options[v.selectedIndex].text;
for(var H=m.className.split(" "),F=H.length,G=0;
G<F;
G++){if(H[G].indexOf("styled-dropdown-select-")===0){YDom.removeClass(m,H[G])
}}YDom.addClass(m,"styled-dropdown-select-"+v.options[v.selectedIndex].getAttribute("data-li-styled-dropdown-class"))
}};
e=function(G){G=G||window.event;
var I=G.keyCode;
var F=YEvent.getTarget(G);
if(G.type==="mousedown"&&(YDom.hasClass(F.parentNode,"disabled")||YDom.hasClass(F,"disabled"))){YEvent.stopEvent(G);
return
}if(YDom.hasClass(F,C.normalLinkClass)){E();
if(F.href){if(F.target){var H=window.open(F.href,F.target);
H.focus()
}else{window.location=F.href
}}return
}if(I===s||(G.type==="blur"&&y>=x)){E();
v.selectedIndex=h
}else{if(G.type==="blur"&&k!==y){A(y)
}else{if(I===j||G.type==="mousedown"){YEvent.stopEvent(G);
if(G.type==="mousedown"&&YDom.getAncestorByClassName(F,C.containerClass)&&(!YDom.hasClass("label")&&!YDom.getAncestorByClassName(F,"label"))){if(F.nodeName!=="LI"){F=YDom.getAncestorByTagName(F,"li");
if(!F){return
}}y=F._index;
if(y<x){v.selectedIndex=y
}}if(YDom.hasClass(F,"option")||I===j){A(y);
E()
}}}}i()
};
A=function(G){var F,I,H;
if(G>=x){v.selectedIndex=h;
F=LI.StyledDropdown.itemSelectEvent.fire(C.name,u[G]);
if(LI.Events){LI.Events.fire(a,{name:C.name,option:u[G]})
}if(F!==false){H=Y$("div > a",u[G]);
if(H.length===1){if(H[0].target){I=window.open(H[0].href,H[0].target);
I.focus();
E();
v.blur();
return false
}else{document.location.href=H[0].href
}}}}else{h=G;
LI.StyledDropdown.itemSelectEvent.fire(C.name,v.options[G]);
if(LI.Events){LI.Events.fire(a,{name:C.name,option:v.options[G]})
}}k=G;
E();
v.blur()
};
l=function(H){H=H||window.event;
var G=YEvent.getTarget(H),J=YDom.getElementsByClassName("highlighted","li",B),I,F;
for(I=0,F=J.length;
I<F;
I++){YDom.removeClass(J[I],"highlighted")
}if(H.type==="mouseover"&&YDom.getAncestorByClassName(G,C.containerClass)){if(G.nodeName!=="LI"){G=YDom.getAncestorByTagName(G,"li")
}YDom.addClass(G,"highlighted")
}};
this.disableDropdown=function(){if(!r){r=true;
YDom.addClass(c,d)
}};
this.enableDropdown=function(){if(r){r=false;
YDom.removeClass(c,d)
}};
this.getSelectedValue=function(){return v.options[v.selectedIndex].value
};
this.setSelectedValue=function(J,K){t();
var G=v.options,F=G.length,I,H;
for(H=0;
H<F;
H++){I=G[H];
if(J===I.value){I.selected=true;
if(!K){A(H)
}YDom.addClass(u[H],"highlighted");
m.innerHTML=v.options[v.selectedIndex].text;
y=H;
i();
return
}}throw J+" is not a valid value."
};
YEvent.on(v,"focus",function(F){t();
if(!YDom.hasClass(q,"open")){f();
D(F)
}});
if(!C.stickyLabel){YEvent.on(v,"blur",function(F){e(F);
E()
});
YEvent.on(q,"focus",D);
YEvent.on(q,"blur",E)
}YEvent.on(v,"keydown",D);
if(C.openOnHover){YEvent.on(m,"mouseover",function(){v.focus()
});
YEvent.on(q,"mouseover",function(){if(p){window.clearTimeout(p)
}});
YEvent.on(q,"mouseout",function(){if(YDom.hasClass(q,"open")){p=window.setTimeout(function(){v.blur()
},250)
}else{if(p){window.clearTimeout(p)
}}})
}YEvent.on(m,"mousedown",function(F){if(YDom.hasClass(q,"open")){E();
e(F);
v.blur()
}else{t();
f();
D(F);
v.focus()
}});
YEvent.on(v,"change",D);
YEvent.on(B,"mouseover",l);
YEvent.on(B,"mouseout",l);
YEvent.on(B,"mousedown",e);
i();
LI.StyledDropdown.loadEvent.fire(C.name);
LI.StyledDropdown.itemSelectEvent.fire(C.name,v.options[v.selectedIndex]);
if(LI.Events){LI.Events.fire(a,{name:C.name,option:v.options[v.selectedIndex]})
}};
LI.StyledDropdown.loadEvent=new YAHOO.util.CustomEvent("load");
LI.StyledDropdown.itemSelectEvent=new YAHOO.util.CustomEvent("itemSelect");LI.define("GhostLabel");
LI.GhostLabel=function(c,s){var h=YDom.get(c.htmlFor),m=h.type,j,a,g="password",b=!!("placeholder" in document.createElement("input")&&"placeholder" in document.createElement("textarea")),p="ghost-hide",l="ghost-show",e="hint",i="clone-hint",k=this;
s=s||{};
s={placeholder:(YAHOO&&YAHOO.lang&&YAHOO.lang.trim)?YAHOO.lang.trim(s.placeholder||c.firstChild.nodeValue):(s.placeholder||c.firstChild.nodeValue),showLabel:s.showLabel||false,isDefault:s.isDefault||false};
if(b){h.setAttribute("placeholder",s.placeholder)
}var t=function(){if(!b){if(s.placeholder&&h.value===""){if(m===g){if(!j){j=document.createElement("input");
j.type="text";
j.value=s.placeholder;
YDom.addClass(j,e);
YDom.addClass(j,i);
YDom.addClass(j,YDom.getAttribute(h,"class"));
j.setAttribute("tabindex",h.getAttribute("tabindex"));
YDom.insertAfter(j,h);
a=true;
YEvent.on(j,"focus",u)
}if(!a){YDom.removeClass(j,p);
YDom.removeClass(h,l)
}YDom.addClass(j,l);
YDom.addClass(h,p);
a=true
}YDom.addClass(h,e);
if(m!==g){h.value=s.placeholder
}}}};
var u=function(){if(!b){if(s.placeholder&&(m===g||h.value===s.placeholder)&&YDom.hasClass(h,e)){if(j&&m===g){if(a){YDom.removeClass(j,l);
YDom.removeClass(h,p)
}YDom.addClass(j,p);
YDom.addClass(h,l);
a=false;
h.focus()
}if(m!==g){h.value=""
}YDom.removeClass(h,e)
}}};
var d=function(){if(b){if(h.value===""){return true
}}else{if(YDom.hasClass(h,e)){return true
}}return false
};
var q=function(v){s.placeholder=v
};
var r=function(){return s.placeholder
};
var f=function(v){if(b){h.setAttribute("placeholder",s.placeholder)
}else{if(v){if(d()){h.value=s.placeholder
}}else{h.value=s.placeholder;
YDom.addClass(h,e)
}}};
var n=function(){if(s.isDefault){if(h.value===""){h.value=s.placeholder
}}else{u()
}};
var o=function(){var v=h.form;
if(!s.showLabel){LI.hide(c)
}if(!b){if(m!==g){YEvent.on(h,"focus",u)
}YEvent.on(h,"blur",t);
if(s.placeholder&&(h.value===s.placeholder)){h.value="";
YDom.removeClass(h,e)
}t()
}if(v){YEvent.on(v,"submit",n)
}if(v&&v.id&&h.id){LI.GhostLabel.Manager.register(v.id,h.id,k)
}};
o();
this.showGhostLabel=t;
this.hideGhostLabel=u;
this.setLabel=q;
this.getLabel=r;
this.updateLabel=f;
this.isGhostLabelVisible=d
};
LI.GhostLabel.Manager={registry:{},register:function(c,a,b){if(!this.registry[c]){this.registry[c]={}
}this.registry[c][a]=b
},destroy:function(b,a){if(this.registry[b][a]){delete this.registry[b][a]
}},show:function(b){if(this.registry[b]){for(var a in this.registry[b]){if(YAHOO.lang.hasOwnProperty(this.registry[b],a)){this.registry[b][a].showGhostLabel()
}}}},hide:function(b){if(this.registry[b]){for(var a in this.registry[b]){if(YAHOO.lang.hasOwnProperty(this.registry[b],a)){this.registry[b][a].hideGhostLabel()
}}}}};