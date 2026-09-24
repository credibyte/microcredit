// JavaScript Document


/*
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
 * in FIPS PUB 180-1
 * Version 2.1a Copyright Paul Johnston 2000 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for details.
 */

/*
 * Configurable variables. You may need to tweak these to be compatible with
 * the server-side, but the defaults work in most cases.
 */
var hexcase = 0;  /* hex output format. 0 - lowercase; 1 - uppercase        */
var b64pad  = ""; /* base-64 pad character. "=" for strict RFC compliance   */
var chrsz   = 8;  /* bits per input character. 8 - ASCII; 16 - Unicode      */

/*
 * These are the functions you'll usually want to call
 * They take string arguments and return either hex or base-64 encoded strings
 */
function hex_sha1(s){return binb2hex(core_sha1(str2binb(s),s.length * chrsz));}
function b64_sha1(s){return binb2b64(core_sha1(str2binb(s),s.length * chrsz));}
function str_sha1(s){return binb2str(core_sha1(str2binb(s),s.length * chrsz));}
function hex_hmac_sha1(key, data){ return binb2hex(core_hmac_sha1(key, data));}
function b64_hmac_sha1(key, data){ return binb2b64(core_hmac_sha1(key, data));}
function str_hmac_sha1(key, data){ return binb2str(core_hmac_sha1(key, data));}

/*
 * Perform a simple self-test to see if the VM is working
 */
function sha1_vm_test()
{
  return hex_sha1("abc") == "a9993e364706816aba3e25717850c26c9cd0d89d";
}

/*
 * Calculate the SHA-1 of an array of big-endian words, and a bit length
 */
function core_sha1(x, len)
{
  /* append padding */
  x[len >> 5] |= 0x80 << (24 - len % 32);
  x[((len + 64 >> 9) << 4) + 15] = len;

  var w = Array(80);
  var a =  1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d =  271733878;
  var e = -1009589776;

  for(var i = 0; i < x.length; i += 16)
  {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;
    var olde = e;

    for(var j = 0; j < 80; j++)
    {
      if(j < 16) w[j] = x[i + j];
      else w[j] = rol(w[j-3] ^ w[j-8] ^ w[j-14] ^ w[j-16], 1);
      var t = safe_add(safe_add(rol(a, 5), sha1_ft(j, b, c, d)),
                       safe_add(safe_add(e, w[j]), sha1_kt(j)));
      e = d;
      d = c;
      c = rol(b, 30);
      b = a;
      a = t;
    }

    a = safe_add(a, olda);
    b = safe_add(b, oldb);
    c = safe_add(c, oldc);
    d = safe_add(d, oldd);
    e = safe_add(e, olde);
  }
  return Array(a, b, c, d, e);

}

/*
 * Perform the appropriate triplet combination function for the current
 * iteration
 */
function sha1_ft(t, b, c, d)
{
  if(t < 20) return (b & c) | ((~b) & d);
  if(t < 40) return b ^ c ^ d;
  if(t < 60) return (b & c) | (b & d) | (c & d);
  return b ^ c ^ d;
}

/*
 * Determine the appropriate additive constant for the current iteration
 */
function sha1_kt(t)
{
  return (t < 20) ?  1518500249 : (t < 40) ?  1859775393 :
         (t < 60) ? -1894007588 : -899497514;
}

/*
 * Calculate the HMAC-SHA1 of a key and some data
 */
function core_hmac_sha1(key, data)
{
  var bkey = str2binb(key);
  if(bkey.length > 16) bkey = core_sha1(bkey, key.length * chrsz);

  var ipad = Array(16), opad = Array(16);
  for(var i = 0; i < 16; i++)
  {
    ipad[i] = bkey[i] ^ 0x36363636;
    opad[i] = bkey[i] ^ 0x5C5C5C5C;
  }

  var hash = core_sha1(ipad.concat(str2binb(data)), 512 + data.length * chrsz);
  return core_sha1(opad.concat(hash), 512 + 160);
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safe_add(x, y)
{
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

/*
 * Bitwise rotate a 32-bit number to the left.
 */
function rol(num, cnt)
{
  return (num << cnt) | (num >>> (32 - cnt));
}

/*
 * Convert an 8-bit or 16-bit string to an array of big-endian words
 * In 8-bit function, characters >255 have their hi-byte silently ignored.
 */
function str2binb(str)
{
  var bin = Array();
  var mask = (1 << chrsz) - 1;
  for(var i = 0; i < str.length * chrsz; i += chrsz)
    bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (32 - chrsz - i%32);
  return bin;
}

/*
 * Convert an array of big-endian words to a string
 */
function binb2str(bin)
{
  var str = "";
  var mask = (1 << chrsz) - 1;
  for(var i = 0; i < bin.length * 32; i += chrsz)
    str += String.fromCharCode((bin[i>>5] >>> (32 - chrsz - i%32)) & mask);
  return str;
}

/*
 * Convert an array of big-endian words to a hex string.
 */
function binb2hex(binarray)
{
  var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
  var str = "";
  for(var i = 0; i < binarray.length * 4; i++)
  {
    str += hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8+4)) & 0xF) +
           hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8  )) & 0xF);
  }
  return str;
}

/*
 * Convert an array of big-endian words to a base-64 string
 */
function binb2b64(binarray)
{
  var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var str = "";
  for(var i = 0; i < binarray.length * 4; i += 3)
  {
    var triplet = (((binarray[i   >> 2] >> 8 * (3 -  i   %4)) & 0xFF) << 16)
                | (((binarray[i+1 >> 2] >> 8 * (3 - (i+1)%4)) & 0xFF) << 8 )
                |  ((binarray[i+2 >> 2] >> 8 * (3 - (i+2)%4)) & 0xFF);
    for(var j = 0; j < 4; j++)
    {
      if(i * 8 + j * 6 > binarray.length * 32) str += b64pad;
      else str += tab.charAt((triplet >> 6*(3-j)) & 0x3F);
    }
  }
  return str;
}
/***************************************************************************************************/
function envia(formId)
{
	//alert("Servicio inactivo por tareas de mantenimiento en servidores. En breve quedará restablecido. Disculpen las molestias.")
	//return false;
	var id="";
	if (formId=="form1")
		id="texErr";
	else if (formId=="form2")
		id="texErr2";
	var form = document.getElementById(formId);
	if (form.nom.value=='' || form.pass.value=='')
	{	
		if (form.nom.value=='' && form.pass.value=='')
		{	document.getElementById(id).innerHTML="Indicar usuario y clave";form.nom.focus();}
		else if (form.nom.value=='')
		{	document.getElementById(id).innerHTML="Indicar usuario"; form.nom.focus();}
		else if (form.pass.value=='')
		{	document.getElementById(id).innerHTML="Indicar clave"; form.pass.focus();}
		if (formId=="form1")
			document.getElementById('id02').style.display='block';
	}
	else
	{
		document.getElementById(id).innerHTML="";
		var w = 500;
		var h = 300;
		var LeftPosition = (screen.width) ? (screen.width-w)/2 : 0;
		var TopPosition = (screen.height) ? (screen.height-h)/2 : 0;
		var settings = 'height='+h+',width='+w+',top='+(TopPosition-100)+',left='+LeftPosition+',status=no,toolbar=no,menubar=no,directories=no,location=no,resizable=yes,scrollbars=no'
		var url = "https://secure.micro-credit.com/mc_wan/jsp/Ini.jsp?pass="+ sha1(form.pass.value) + "&pass256=" + sha256(form.pass.value) + "&nom=" + form.nom.value + "&ip=" + form.ip.value + "&intUser=" + form.intUser.value;
		window.open(url, "_blank", settings);
	}
}
/***************************************************************************************************/
function ShowDiv(lay)
{
	var capa;
	capa = document.getElementById(lay);
	capa = capa.style;

	if(capa.display == "none" || capa.visibility == "hidden") 
	{
    	capa.display="";
		capa.visibility = ""
	}
	else
    {
    	capa.display ="none";
		capa.visibility = "hidden";
    }
}
/***************************************************************************************************/
function Show_Lay(lay)
{
	var capa;		
	capa = document.getElementById(lay);
	capa = capa.style;

	if(capa.visibility == "hidden")
		capa.visibility="";		
	if (capa.display == "none")
		capa.display = "block";
	//else
	//	capa.visibility ="hidden";
}
/***************************************************************************************************/
function Hide_Lay(lay)
{
	var capa;
	capa = document.getElementById(lay);
	capa = capa.style;
	
	if(capa.visibility == "" || capa.visibility=="visible")
		capa.visibility = "hidden";
	if (capa.display == "block")
		capa.display = "none";
}
/***************************************************************************************************/
function SetOpacity(object,opacityPct)
{
  // IE.
  object.style.filter = 'alpha(opacity=' + opacityPct + ')';
  // Old mozilla and firefox
  object.style.MozOpacity = opacityPct/100;
  // Everything else.
  object.style.opacity = opacityPct/100;
}
//------------------------------------------------------------------
var FadeDurationMS=3000;
/***************************************************************************************************/
function ChangeOpacity(id,msDuration,msStart,fromO,toO)
{
  var element=document.getElementById(id);
  var msNow = (new Date()).getTime();
  var opacity = fromO + (toO - fromO) * (msNow - msStart) / msDuration;
  if (opacity>=100)
  {
    SetOpacity(element,100);
    element.timer = undefined;
  }
  else if (opacity<=0)
  {
    SetOpacity(element,0);
    element.timer = undefined;
  }
  else 
  {
	SetOpacity(element,opacity);
    element.timer = window.setTimeout("ChangeOpacity('" + id + "'," + msDuration + "," + msStart + "," + fromO + "," + toO + ")",10);
  }
}
/***************************************************************************************************/
function FadeInImage(foregroundID,newImage,backgroundID)
{
  var foreground=document.getElementById(foregroundID);
  if (foreground.timer) window.clearTimeout(foreground.timer);
  if (backgroundID)
  {
    var background=document.getElementById(backgroundID);
    if (background)
    {
      if (background.src)
      {
        foreground.src = background.src; 
        SetOpacity(foreground,100);
      }
      background.src = newImage;
      background.style.backgroundImage = 'url(' + newImage + ')';
      background.style.backgroundRepeat = 'no-repeat';
      var startMS = (new Date()).getTime();
      foreground.timer = window.setTimeout("ChangeOpacity('" + foregroundID + "'," + FadeDurationMS + "," + startMS + ",100,0)",10);
    }
  } else {
    foreground.src = newImage;
  }
}
var slideCache = new Array();
function RunSlideShow(pictureID,backgroundID,imageFiles,displaySecs)
{
  var imageSeparator = imageFiles.indexOf(";");
  var nextImage = imageFiles.substring(0,imageSeparator);

  if (slideCache[nextImage] && slideCache[nextImage].loaded)
  {
    FadeInImage(pictureID,nextImage,backgroundID);
    var futureImages = imageFiles.substring(imageSeparator+1,imageFiles.length)
      + ';' + nextImage;
    setTimeout("RunSlideShow('"+pictureID+"','"+backgroundID+"','"+futureImages+"',"+displaySecs+")",displaySecs*1000);
    // Identify the next image to cache.
    imageSeparator = futureImages.indexOf(";");
    nextImage = futureImages.substring(0,imageSeparator);
  } else {
    setTimeout("RunSlideShow('"+pictureID+"','"+backgroundID+"','"+imageFiles+"',"+displaySecs+")",250);
  }
  // Cache the next image to improve performance.
  if (slideCache[nextImage] == null)
  {
    slideCache[nextImage] = new Image;
    slideCache[nextImage].loaded = false;
    slideCache[nextImage].onload = function(){this.loaded=true};
    slideCache[nextImage].src = nextImage;
  }
}
/***************************************************************************************************/
function ocultaaviso()
{
	Hide_Lay('aviso_legal');
	document.getElementById('scrollholder').style.visibility="hidden";
	document.getElementById('scroll').style.visibility="hidden";
}
/***************************************************************************************************/
function muestraaviso()
{
	Show_Lay('aviso_legal');
	document.getElementById('scrollholder').style.visibility="visible";
	document.getElementById('scroll').style.visibility="visible";
}
/***************************************************************************************************/
function DivFadeIn(lay,max_opac)
{
	var capa;
	capa = document.getElementById(lay);
	capa = capa.style;
	if(capa.visibility == "hidden")
		capa.visibility = "";
	else if (capa.display == "none")
		capa.display = "block";
	setOpacity(document.getElementById(lay), 0);
	fadeIn(lay,0,max_opac);
}
/***************************************************************************************************/
function fadeIn(objId,opacity,max_opac)
{
	obj = document.getElementById(objId);
	if (opacity <= max_opac)
	{
		setOpacity(obj, opacity);
   		opacity += 20;
   		window.setTimeout("fadeIn('"+objId+"',"+opacity+","+max_opac+")", 100);
   	}
}
/***************************************************************************************************/
function DivFadeOut(lay,min_opac)
{
	var capa;
	capa = document.getElementById(lay);
	capa = capa.style;
	
	setOpacity(document.getElementById(lay), 100);
	fadeOut(lay,100,min_opac);
	if(capa.visibility == "" || capa.display == "block")
	{
		setOpacity(document.getElementById(lay), 100);
		fadeOut(lay,100,min_opac);
	}
}
/***************************************************************************************************/
function fadeOut(objId,opacity,min_opac)
{
	obj = document.getElementById(objId);
	if (opacity >= 0)
	{
		setOpacity(obj, opacity);
  		opacity -= 20;
  		window.setTimeout("fadeOut('"+objId+"',"+opacity+","+min_opac+")", 100);
		if (obj.style.opacity==0)
			obj.style.visibility="hidden";
   	}
}
/***************************************************************************************************/
function a_clientes()
{
	window.open("mailto:sac@micro-credit.com?subject=Atencion cliente Microcredit, S.A.")
}
/***************************************************************************************************/
function a_rrhh()
{
	window.open("mailto:rrhh@micro-credit.com?subject=Departamento de Recursos Humanos Microcredit, S.A.")
}
/***************************************************************************************************/
function check_Form(val)
{
	var color = "#F0F0F0";
	var colorOK = "#FFFFFF";
	if (val==1) //Contacto
	{
		ok = 1;
		if (document.form_contacto.Nombre.value=="")
		{
			document.form_contacto.Nombre.style.backgroundColor = color;
			ok=0;
		}
		else
			document.form_contacto.Nombre.style.backgroundColor = colorOK;
		
		if (document.form_contacto.Cargo_Empresa.value=="")
		{
			document.form_contacto.Cargo_Empresa.style.backgroundColor = color;
			ok=0;
		}
		else
			document.form_contacto.Cargo_Empresa.style.backgroundColor = colorOK;
		
		if (document.form_contacto.Nombre_Empresa.value=="")
		{
			document.form_contacto.Nombre_Empresa.style.backgroundColor = color;
			ok=0;
		}
		else
			document.form_contacto.Nombre_Empresa.style.backgroundColor = colorOK;
		
		if (document.form_contacto.Sector_Empresa.value=="")
		{
			document.form_contacto.Sector_Empresa.style.backgroundColor = color;
			ok=0;
		}
		else
			document.form_contacto.Sector_Empresa.style.backgroundColor = colorOK;

		/*if (document.form_contacto.Direccion_Empresa.value=="")
		{
			document.form_contacto.Direccion_Empresa.style.backgroundColor = color;
			ok=0;
		}
		else
			document.form_contacto.Direccion_Empresa.style.backgroundColor = colorOK;
		*/
		if (document.form_contacto.Telefono.value=="")
		{
			document.form_contacto.Telefono.style.backgroundColor = color;
			ok=0;
		}
		else
			document.form_contacto.Telefono.style.backgroundColor = colorOK;
		
		if (document.form_contacto.Email.value=="")
		{
			document.form_contacto.Email.style.backgroundColor = color;
			ok=0;
		}
		else
			document.form_contacto.Email.style.backgroundColor = colorOK;
		
		var str = document.form_contacto.Comentario.value;
		
		if (str.indexOf("www")>=0 || str.indexOf("http")>=0 || str.indexOf("WWW")>=0 || str.indexOf("HTTP")>=0)
		{
			document.form_contacto.Comentario.style.backgroundColor = color;
			ok=0;
		}

		if (ok==0)
		{
			document.getElementById("texErr3").innerHTML="Debe rellenar los campos sombreados";
			document.getElementById("err3").style.display="block";
		}
		else
		{
			document.getElementById("texErr3").innerHTML="";
			document.getElementById("err3").style.display="none";
			document.form_contacto.submit();
		}
		
	}
}
/***************************************************************************************************/
function conform(formulario)
{
	var x = document.getElementById("sendForm");
	if (formulario.conforme.checked==true)
	{	
		document.getElementById("sendForm").disabled = false;
		x.className = x.className.replace(" w3-disabled", "");
		x.className += " w3-enabled";
		formulario.aviso.value="El remitente ha leido y Acepta las condiciones de uso y Privacidad del website de Microcredit, S.A.";
	}
	else
	{	
		document.getElementById("sendForm").disabled = true;
		x.className = x.className.replace(" w3-enabled", "");
		x.className += " w3-disabled";
		formulario.aviso.value="";
	}
}
/***************************************************************************************************/
function rest_form(val)
{
	if (val==1)
	{
		for (i=1;i<=9;i++)
		{
			switch(i)
			{
				case 1:
					element = document.form_contacto.Nombre;
				break;
				case 2:
					element = document.form_contacto.Comentario;
				break;
				case 3:
					element = document.form_contacto.Cargo_Empresa;
				break;
				case 4:
					element = document.form_contacto.Nombre_Empresa;
				break;
				case 5:
					element = document.form_contacto.Sector_Empresa;
				break;
				case 6:
					element = document.form_contacto.Importe_Ventas;
				break;
				//case 7:
				//	element = document.form_contacto.Direccion_Empresa;
				//break;
				case 8:
					element = document.form_contacto.Telefono;
				break;
				case 9:
					element = document.form_contacto.Email;
				break;
			}
			if (element!=null)
			{
				element.value="";
				element.style.backgroundColor = "#E21B19";
			}
		}
		document.form_contacto.conforme.checked=false;
	}
	else if (val==2)
	{
		for (i=1;i<=9;i++)
		{
			switch(i)
			{
				case 1:
					element = document.form_empleo.Nombre;
				break;
				case 2:
					element = document.form_empleo.Direccion;
				break;
				case 3:
					element = document.form_empleo.Telefono;
				break;
				case 4:
					element = document.form_empleo.Email;
				break;
				case 5:
					element = document.form_empleo.F_Nacimiento;
				break;
			}
			element.value="";
			element.style.backgroundColor = "#E21B19";
		}
		document.form_empleo.conforme.checked=false;
	}
}
/***************************************************************************************************/
function Check_Email(email) 
{
	var msg = "";
	var string1=email.value;
	if (string1.indexOf("@")==-1 && string1!="")
	{
		msg  = "La direcci&oacute;n de correo elctr&oacute;nico introducida no es correcta";
		email.value="";
		email.focus();
	}
	if (msg.length!=0)
	{
		document.getElementById('texErr3').innerHTML = msg;
		document.getElementById('err3').style.display = "block";
	}
	else
	{
		document.getElementById('texErr3').innerHTML = "";
		document.getElementById('err3').style.display = "none";
	}
}
/***************************************************************************************************/
function Caracteres(valor,op)
{
	var ok=1;
	var tel = valor.value;
	var msg = "";
	if (op == 1) //Nombre, apellido, apellido2
		var ueh = new RegExp("[^A-Za-zçÇñÑ ]");
	else if (op == 2) //Fechas
		var ueh = new RegExp("[^0-9/]");
	else if (op == 3) //Solo Numeros
		var ueh = new RegExp("[^0-9]");
	else if (op == 4) //Numeros con coma flotante
		var ueh = new RegExp("[^0-9\.\,]");
	else if (op == 5) //Telefono
		var ueh = new RegExp("[^0-9]");
	else if (op == 6)
		var ueh = new RegExp("[ºª]");
	else if (op == 7) //
		var ueh = new RegExp("[^0-9A-Za-zºª ]");
	else if (op == 8) //Alfanumerico
		var ueh = new RegExp("[^A-Za-zçÇñÑ\,\(\)0-9\.\, ]");
	
	if (ueh.test(valor.value))
	{
		msg  = "Ha introducido algún carácter no válido";
		valor.value = "";
		valor.focus();
	}
	else if (op == 5)
	{
		if (tel.length > 0 && tel.length < 9)
		{
			msg = "Longitud incorrecta para el campo teléfono";
			valor.value = "";
		}
	}

	if (msg.length!=0)
	{
		ok=0;
		document.getElementById('msg_Err').innerHTML = msg;
		Show_Err();
	}
	return ok;
}
/***************************************************************************************************/
function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}
/***************************************************************************************************/
function isAlfa(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 65 || charCode > 90) && (charCode < 97 || charCode > 122)) {
        return false;
    }
    return true;
}
/***************************************************************************************************/
function isImport(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode!=44) {
        return false;
    }
    return true;
}
/***************************************************************************************************/
function isNumberAlfa(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 32 && (charCode < 65 || charCode > 90) && (charCode < 97 || charCode > 122) && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}
/***************************************************************************************************/
function switchCookieDet(val){
	var capa;
	capa = document.getElementById(val);
	var capaTXT;
	capaTXT = document.getElementById(val+"TXT");
	ShowDiv(val);
	if(capa.style.display == "none") {
    	capaTXT.innerHTML="Mostrar";
	}else{
    	capaTXT.innerHTML ="Ocultar";
    }

}