// Quick test to verify API endpoint
fetch('https://brainrot-me.vercel.app/api/gemini', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    base64ImageData: 'test',
    mimeType: 'image/png',
    mergeObject: '',
    promptTemplate: 'test prompt',
    defaultMergeObject: 'object'
  })
})
.then(r => {
  console.log('Status:', r.status);
  return r.text();
})
.then(console.log)
.catch(console.error);

