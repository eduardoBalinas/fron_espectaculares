'use client';
import { usePathname } from 'next/navigation';
import { toPng } from 'html-to-image';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

export default function Template() {
  const pathname = usePathname();
  const [phrase, setPhrase] = useState([])
  const [isLoad, setIsLoad] = useState(false)
  const id = pathname.split("/")[2];
  const size = pathname.split("/")[3] 

  axios.defaults.headers.common['Authorization'] = `Bearer ${typeof window !== "undefined" ?  localStorage.getItem("authorization") : null}`;
  axios.defaults.headers.common['X-CSRF-TOKEN'] = typeof window !== "undefined" ?  localStorage.getItem("token") : null
  axios.defaults.headers.common['Content-Type'] = "application/json";



  useEffect(() => {
    axios.get("http://localhost:8000/api/getPhraseById/" + id)
      .then(data => {
        setPhrase(data.data.data)
        console.log(data.data);
        setIsLoad(true)
      })
  },[])

  const elementRef = useRef(null);


  useEffect(() => {
    if(isLoad) {
      setTimeout(() => {
        htmlToImageConvert()
      },1000)
    }
  },[isLoad])

  const htmlToImageConvert = () => {
    toPng(elementRef.current, { cacheBust: false })
      .then((dataUrl) => {
        var jpegFile64 = dataUrl.replace(/^data:image\/(png|jpeg);base64,/, "");
        var jpegBlob = base64ToBlob(jpegFile64, 'image/png');  
          basicUpload({
            //El id se debe de cambiar
            accountId: "12a1yMU",
            //El api key lo debo de cambiar
            apiKey: "public_12a1yMU4s52UarCh1oFyDsTMz9wU",
            requestBody: new Blob( 
              [ jpegBlob ],
              { type: "image/png", },
              
            )
          })
          .then(response => {
            axios.post("http://localhost:8000/api/create/images", {
              "phraseId": id,
              "url": response["fileUrl"],
              "size": size
            })
              .then(data => console.log(data))
              .catch(error => console.log(error))
          })
      })
      .catch((err) => {
        console.log(err);
      });
  };

  async function basicUpload(params) {  
    const baseUrl  = "https://api.upload.io";
    const path     = `/v2/accounts/${params.accountId}/uploads/binary`;
    const entries  = obj => Object.entries(obj).filter(([,val]) => (val ?? null) !== null);
    const query    = entries(params.querystring ?? {})
                       .flatMap(([k,v]) => Array.isArray(v) ? v.map(v2 => [k,v2]) : [[k,v]])
                       .map(kv => kv.join("=")).join("&");
    const response = await fetch(`${baseUrl}${path}${query.length > 0 ? "?" : ""}${query}`, {
      method: "POST",
      body: params.requestBody,
      headers: Object.fromEntries(entries({
        "Authorization": `Bearer ${params.apiKey}`,
        "X-Upload-Metadata": JSON.stringify(params.metadata)
      }))
    });
    const result = await response.json();
    if (Math.floor(response.status / 100) !== 2)
      throw new Error(`Upload API Error: ${JSON.stringify(result)}`);
    return result;
  }

  // This function is used to convert base64 encoding to mime type (blob)
function base64ToBlob(base64, mime) 
{
    mime = mime || '';
    var sliceSize = 1024;
    var byteChars = window.atob(base64);
    var byteArrays = [];

    for (var offset = 0, len = byteChars.length; offset < len; offset += sliceSize) {
        var slice = byteChars.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, {type: mime});
}
const div1920x1080 = () => {
  return (
    <div>
      <img src={phrase.background} style={{ width:"1920px" ,height:"1080px" }} />
      <img src={phrase.avatar} width="300" style={{ position: "absolute", bottom: "40vh",zIndex: "2", left: "40%" }} />
      <h1 style={{ position: "absolute", zIndex: "2332", bottom:"20vh", left: "35%", width: "600px", color: "white" }}>{ phrase.phrase }</h1>
    </div>
  )
}

const div1280x720 = () => {
  return(
    <div>
      <img src={phrase.background} style={{ width:"1280px", height: "720px"}} />
      <img src={phrase.avatar} width="400" style={{ position: "relative", right: "60%"}} />
      <h1 style={{ position: "relative", bottom: "55vh", left: "40%" ,width: "200px" }}>{ phrase.phrase }</h1>
    </div>
  )
}


const div720x480 = () => {
  return(
    <div>
      <img src={phrase.background} style={{ width:"720px", height:"480px" }} />
      <img src={phrase.avatar} width="200" style={{ position: "absolute", left:"13%" , top: "20px" }}/>
      <h2 style={{ position: "absolute", top: "30vh", left:"15%", color: "white" }}>{ phrase.phrase }</h2>
    </div>
  )
}
  return(
    <div ref={elementRef} >
       { size === "1920X1080" ? (div1920x1080())
        : size === "1280X720" ? (div1280x720())
        : size === "720X480" ? (div720x480())
        : null
      }
    </div>
  )
}