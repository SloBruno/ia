const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const capturedImg = document.getElementById('captured-img');
const descriptionElem = document.getElementById('description');
const captureBtn = document.getElementById('capture-btn');

function lerTexto(text){
    var mensagem = new SpeechSynthesisUtterance();
    var vozes = speechSynthesis.getVoices();
    mensagem.text = text;
    mensagem.voice = vozes[1]; 
    mensagem.lang = "pt-BR";
    mensagem.volume = 1; 
    mensagem.rate = 1; 
    mensagem.pitch = 0; 
    speechSynthesis.speak(mensagem);
   }


navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
        video.play();
    })
    .catch(err => {
        console.error('Erro ao acessar a câmera:', err);
        alert('Não foi possível acessar a câmera. Verifique as permissões do navegador.');
    });

captureBtn.addEventListener('click', () => {
 
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.save(); 
    context.scale(-1, 1); 
    context.translate(-canvas.width, 0); 

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    context.restore(); 

    const dataUrl = canvas.toDataURL('image/jpeg');
    
    fetch('/process_image', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ image: dataUrl })
    })
    .then(response => response.json())
    .then(data => {
        capturedImg.src = dataUrl;
        capturedImg.style.display = 'block';
        
        descriptionElem.textContent = data.description;
        lerTexto(descriptionElem.textContent)
    })
    .catch(err => console.error('Erro ao processar a imagem:', err));
});
