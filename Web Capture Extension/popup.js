const captureWeb=()=>{

  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    
    const currentUrl = tabs[0].url;

    let mode="web";

    fetch("http://localhost:3000/generate-pdf?mode="+mode+"&url="+currentUrl,{
      method:"GET",
      credentials:"include",
      headers:{
        "content-type":"application/pdf"
      }
    }).then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.blob();
    })
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'webpage.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    })
    .catch(error => {
      console.error('Error fetching PDF:', error);
    });

  });
}
document.querySelector("#webCaptureBtn").addEventListener("click",captureWeb);