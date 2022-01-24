import React, { useState,useEffect } from "react";
import { LinkPreview } from "@dhaiwat10/react-link-preview";
import Linkify from 'linkify-react';

const Test = () => {
  const [links,setLinks] = useState([]);

  var text = "https://www.instagram.com/reel/CZGSxbeAydY https://youtu.be/B-kxUMHBxNo ";
  const content = 'For help with GitHub.com, please email support@github.com';



  function detectURLs(message) {
    var urlRegex = "/((?:(http|https|Http|Https|rtsp|Rtsp):\/\/(?:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,64}(?:\:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,25})?\@)?)?((?:(?:[a-zA-Z0-9][a-zA-Z0-9\-]{0,64}\.)+(?:(?:aero|arpa|asia|a[cdefgilmnoqrstuwxz])|(?:biz|b[abdefghijmnorstvwyz])|(?:cat|com|coop|c[acdfghiklmnoruvxyz])|d[ejkmoz]|(?:edu|e[cegrstu])|f[ijkmor]|(?:gov|g[abdefghilmnpqrstuwy])|h[kmnrtu]|(?:info|int|i[delmnoqrst])|(?:jobs|j[emop])|k[eghimnrwyz]|l[abcikrstuvy]|(?:mil|mobi|museum|m[acdghklmnopqrstuvwxyz])|(?:name|net|n[acefgilopruz])|(?:org|om)|(?:pro|p[aefghklmnrstwy])|qa|r[eouw]|s[abcdeghijklmnortuvyz]|(?:tel|travel|t[cdfghjklmnoprtvwz])|u[agkmsyz]|v[aceginu]|w[fs]|y[etu]|z[amw]))|(?:(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9])\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[0-9])))(?:\:\d{1,5})?)(\/(?:(?:[a-zA-Z0-9\;\/\?\:\@\&\=\#\~\-\.\+\!\*\'\(\)\,\_])|(?:\%[a-fA-F0-9]{2}))*)?(?:\b|$)/gi";
    return message.match(urlRegex)
  }

  useEffect(()=>{
    setLinks(detectURLs(text));
  },[]);

  return (
    <div>
      
      <LinkPreview
        url={links[0]}
        width="350px"
        textAlign="left"
        descriptionLength={40}
        imageHeight={200}
        secondaryTextColor="black"
        borderColor="black"
        openInNewTab={true}
        fallbackImageSrc={"https://as1.ftcdn.net/v2/jpg/01/66/23/90/1000_F_166239056_zSf7gw5cOGWwQuXl6w1C3SuZU16dAKQ0.jpg"}
      />
      <div>
        <Linkify tagName="p" >
          {links[0]}
        </Linkify>
      </div>      
      
    </div>
  );
};

export default Test;
