/*function controlCookie(cname){
	var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            alert(c.substring(name.length,c.length));
			return c.substring(name.length,c.length);
        }
		
		if (valor!=1)
			document.getElementById("cookie1").style.display='block';
    }
    return "";
}*/

function denyCookies(val) {
  	var now = new Date();
  	var time = now.getTime();
  	var expireTime = time + 3600 * 1000 * 24 * 365;
  	now.setTime(expireTime);

	document.cookie = escape(val) + "=" + escape("NO")+"; expires="+now.toUTCString();
    // si variable no existe se crea (al clicar en Aceptar)
    localStorage.controlcookie = (localStorage.controlcookie || 0);
	
    localStorage.controlcookie++; // incrementamos cuenta de la cookie
    cookie1.style.display='none'; // Esconde la política de cookies
    cookie1.style.visibility='hidden'; // Esconde la política de cookies
	document.getElementById("mapFrame").innerHTML="";
	document.getElementById("contactForm").style.display="none";
	document.getElementById("contactFormTel").style.display="block";
	document.getElementById("funcCoo").checked=false;
}

function acceptCookies(val) {
  	var now = new Date();
  	var time = now.getTime();
  	var expireTime = time + 3600 * 1000 * 24 * 365;
  	now.setTime(expireTime);

	document.cookie = escape(val) + "=" + escape("SI")+"; expires="+now.toUTCString();
    // si variable no existe se crea (al clicar en Aceptar)
    localStorage.controlcookie = (localStorage.controlcookie || 0);
	
    localStorage.controlcookie++; // incrementamos cuenta de la cookie
    cookie1.style.display='none'; // Esconde la política de cookies
    cookie1.style.visibility='hidden'; // Esconde la política de cookies

	document.getElementById("mapFrame").innerHTML="<p class=\"w3-center\"><iframe width=\"100%\" height=\"400\" frameborder=\"0\" scrolling=\"no\" marginheight=\"0\" marginwidth=\"0\" src=\"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2993.4971839967952!2d2.174999315425725!3d41.38500787926444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x3ba8a426b43eb363!2sMicrocredit%2C+S.A.!5e0!3m2!1sca!2ses!4v1551089216967\" style=\"border:0\" allowfullscreen></iframe></p>";
	document.getElementById("contactForm").style.display="block";
	document.getElementById("contactFormTel").style.display="none";
	document.getElementById("funcCoo").checked=true;
}

function checkCookieControl() {
	if (document.getElementById("funcCoo").checked==true){
		acceptCookies("CookieConsent");
		document.getElementById("mapFrame").innerHTML="<p class=\"w3-center\"><iframe width=\"100%\" height=\"400\" frameborder=\"0\" scrolling=\"no\" marginheight=\"0\" marginwidth=\"0\" src=\"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2993.4971839967952!2d2.174999315425725!3d41.38500787926444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x3ba8a426b43eb363!2sMicrocredit%2C+S.A.!5e0!3m2!1sca!2ses!4v1551089216967\" style=\"border:0\" allowfullscreen></iframe></p>";
		document.getElementById("contactForm").style.display="block";
		document.getElementById("contactFormTel").style.display="none";
	}
	else
	{
		denyCookies("CookieConsent");
		document.getElementById("mapFrame").innerHTML="";
		document.getElementById("contactForm").style.display="none";
		document.getElementById("contactFormTel").style.display="block";
	}
}
