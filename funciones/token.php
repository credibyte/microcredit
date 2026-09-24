<?php
function RandomToken($length = 32){
    if(!isset($length) || intval($length) <= 8 ){
      $length = 32;
    }
    if (function_exists('random_bytes')) {
        return bin2hex(random_bytes($length));
    }
    /*if (function_exists('mcrypt_create_iv')) {
        return bin2hex(mcrypt_create_iv($length, MCRYPT_DEV_URANDOM));
    } */
    if (function_exists('openssl_random_pseudo_bytes')) {
        return bin2hex(openssl_random_pseudo_bytes($length));
    }
}

function Salt(){
    //return substr(strtr(base64_encode(hex2bin(RandomToken(32))), '+', '.'), 0, 44);
    return substr(strtr(base64_encode(hextobin(RandomToken(32))), '+', '.'), 0, 44);
}


function hextobin($hexstr) 
{ 
	$n = strlen($hexstr); 
	$sbin="";   
    $i=0; 
    while($i<$n) 
    {       
        $a =substr($hexstr,$i,2);           
        $c = pack("H*",$a); 
        if ($i==0){$sbin=$c;} 
        else {$sbin.=$c;} 
        $i+=2; 
    } 
    return $sbin; 
}

/*
This function is same as above but its only used for debugging
*/
function RandomTokenDebug($length = 32){
    if(!isset($length) || intval($length) <= 8 ){
      $length = 32;
    }
    $randoms = array();
    if (function_exists('random_bytes')) {
        $randoms['random_bytes'] = bin2hex(random_bytes($length));
    }
    if (function_exists('mcrypt_create_iv')) {
        $randoms['mcrypt_create_iv'] = bin2hex(mcrypt_create_iv($length, MCRYPT_DEV_URANDOM));
    }
    if (function_exists('openssl_random_pseudo_bytes')) {
        $randoms['openssl_random_pseudo_bytes'] = bin2hex(openssl_random_pseudo_bytes($length));
    }
    
    return $randoms;
}


function NormalizeStr($rb){ 
	$rb=str_replace("�", "&#160;", $rb);
	$rb=str_replace("¡", "&#161;", $rb);
	$rb=str_replace("¢", "&#162;", $rb);
	$rb=str_replace("£", "&#163;", $rb);
	$rb=str_replace("¤", "&#164;", $rb);
	$rb=str_replace("¥", "&#165;", $rb);
	$rb=str_replace("¦", "&#166;", $rb);
	$rb=str_replace("§", "&#167;", $rb);
	$rb=str_replace("¨", "&#168;", $rb);
	$rb=str_replace("©", "&#169;", $rb);
	$rb=str_replace("ª", "&#170;", $rb);
	$rb=str_replace("«", "&#171;", $rb);
	$rb=str_replace("�", "&#172;", $rb);
	$rb=str_replace("­", "&#173;", $rb);
	$rb=str_replace("®", "&#174;", $rb);
	$rb=str_replace("¯", "&#175;", $rb);
	$rb=str_replace("°", "&#176;", $rb);
	$rb=str_replace("±", "&#177;", $rb);
	$rb=str_replace("²", "&#178;", $rb);
	$rb=str_replace("³", "&#179;", $rb);
	$rb=str_replace("´", "&#180;", $rb);
	$rb=str_replace("µ", "&#181;", $rb);
	$rb=str_replace("�", "&#182;", $rb);
	$rb=str_replace("·", "&#183;", $rb);
	$rb=str_replace("¸", "&#184;", $rb);
	$rb=str_replace("¹", "&#185;", $rb);
	$rb=str_replace("º", "&#186;", $rb);
	$rb=str_replace("»", "&#187;", $rb);
	$rb=str_replace("¼", "&#188;", $rb);
	$rb=str_replace("½", "&#189;", $rb);
	$rb=str_replace("¾", "&#190;", $rb);
	$rb=str_replace("¿", "&#191;", $rb);
	$rb=str_replace("À", "&#192;", $rb);
	$rb=str_replace("Á", "&#193;", $rb);
	$rb=str_replace("Â", "&#194;", $rb);
	$rb=str_replace("Ã", "&#195;", $rb);
	$rb=str_replace("Ä", "&#196;", $rb);
	$rb=str_replace("Å", "&#197;", $rb);
	$rb=str_replace("Æ", "&#198;", $rb);
	$rb=str_replace("Ç", "&#199;", $rb);
	$rb=str_replace("È", "&#200;", $rb);
	$rb=str_replace("É", "&#201;", $rb);
	$rb=str_replace("Ê", "&#202;", $rb);
	$rb=str_replace("Ë", "&#203;", $rb);
	$rb=str_replace("Ì", "&#204;", $rb);
	$rb=str_replace("Í", "&#205;", $rb);
	$rb=str_replace("Î", "&#206;", $rb);
	$rb=str_replace("Ï", "&#207;", $rb);
	$rb=str_replace("Ð", "&#208;", $rb);
	$rb=str_replace("Ñ", "&#209;", $rb);
	$rb=str_replace("Ò", "&#210;", $rb);
	$rb=str_replace("Ó", "&#211;", $rb);
	$rb=str_replace("Ô", "&#212;", $rb);
	$rb=str_replace("Õ", "&#213;", $rb);
	$rb=str_replace("Ö", "&#214;", $rb);
	$rb=str_replace("×", "&#215;", $rb);
	$rb=str_replace("Ø", "&#216;", $rb);
	$rb=str_replace("Ù", "&#217;", $rb);
	$rb=str_replace("Ú", "&#218;", $rb);
	$rb=str_replace("Û", "&#219;", $rb);
	$rb=str_replace("Ü", "&#220;", $rb);
	$rb=str_replace("Ý", "&#221;", $rb);
	$rb=str_replace("Þ", "&#222;", $rb);
	$rb=str_replace("ß", "&#223;", $rb);
	$rb=str_replace("�", "&#224;", $rb);
	$rb=str_replace("á", "&#225;", $rb);
	$rb=str_replace("â", "&#226;", $rb);
	$rb=str_replace("ã", "&#227;", $rb);
	$rb=str_replace("ä", "&#228;", $rb);
	$rb=str_replace("å", "&#229;", $rb);
	$rb=str_replace("æ", "&#230;", $rb);
	$rb=str_replace("ç", "&#231;", $rb);
	$rb=str_replace("è", "&#232;", $rb);
	$rb=str_replace("é", "&#233;", $rb);
	$rb=str_replace("ê", "&#234;", $rb);
	$rb=str_replace("ë", "&#235;", $rb);
	$rb=str_replace("�", "&#236;", $rb);
	$rb=str_replace("í", "&#237;", $rb);
	$rb=str_replace("î", "&#238;", $rb);
	$rb=str_replace("ï", "&#239;", $rb);
	$rb=str_replace("ð", "&#240;", $rb);
	$rb=str_replace("ñ", "&#241;", $rb);
	$rb=str_replace("ò", "&#242;", $rb);
	$rb=str_replace("ó", "&#243;", $rb);
	$rb=str_replace("ô", "&#244;", $rb);
	$rb=str_replace("õ", "&#245;", $rb);
	$rb=str_replace("�", "&#246;", $rb);
	$rb=str_replace("÷", "&#247;", $rb);
	$rb=str_replace("ø", "&#248;", $rb);
	$rb=str_replace("ù", "&#249;", $rb);
	$rb=str_replace("ú", "&#250;", $rb);
	$rb=str_replace("û", "&#251;", $rb);
	$rb=str_replace("ü", "&#252;", $rb);
	$rb=str_replace("ý", "&#253;", $rb);
	$rb=str_replace("þ", "&#254;", $rb);
	$rb=str_replace("ÿ", "&#255;", $rb);
    return $rb;
}
?>

