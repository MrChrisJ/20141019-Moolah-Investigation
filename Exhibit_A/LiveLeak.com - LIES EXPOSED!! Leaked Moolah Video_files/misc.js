function insertText(cleditor, insertText){
	cleditor.execCommand("inserthtml", insertText);
	cleditor.updateTextArea();
	cleditor.updateFrame();
}  //end function insertText(textBox, insertText){
	
  function generate_embed_code(file_token)
  {	 
     var form = $('#generate_embed_code_form_'+file_token)[0];
	 var extra_part = '';
	 var size_array = form.size_string.value.split("x");
	 
	 if(form.start.value>0)extra_part += '&start='+form.start.value;
	 
	 form.embed_code.value = '<iframe width="'+size_array[0]+'" height="'+size_array[1]+'" src="http://www.liveleak.com/ll_embed?f='+file_token+extra_part+'" frameborder="0" allowfullscreen></iframe>';
  }
  
  function generate_embed_code_generator_html(file_token)
  {
	  html_code = '<form id="generate_embed_code_form_'+file_token+'" onsubmit="return false;"><textarea name="embed_code" id="embed_code" rows="3" onclick="this.select();" style="width:625px">&lt;iframe width=&quot;640&quot; height=&quot;360&quot; src=&quot;http://www.liveleak.com/ll_embed?f='+file_token+'&quot; frameborder=&quot;0&quot; allowfullscreen&gt;&lt;/iframe&gt;</textarea><br />After making your selection below, copy and paste the above code.<br />Size: <label for="select"></label><select name="size_string" id="size_string" onchange="generate_embed_code(\''+file_token+'\')"><option value="560x315">560x315</option><option value="640x360" selected="selected">640x360</option><option value="853x480">853x480</option><option value="1280x720">1280x720</option></select> | start time <input type="text" name="start" id="start" value="0" size="4" onchange="generate_embed_code(\''+file_token+'\');" /> seconds | <input type="button" name="button" id="button" value="Generate Code" onclick="generate_embed_code(\''+file_token+'\');" /></form>';
	  return html_code; 
  }
  
  function createCookie(name,value) {
	var date = new Date();
	date.setTime(date.getTime()+(10000*24*60*60*1000));
	var expires = "; expires="+date.toGMTString();

	document.cookie = name+"="+value+expires+"; domain=liveleak.com; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function eraseCookie(name) {
	createCookie(name,"",-1);
}

