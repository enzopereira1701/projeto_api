// DECLARAÇÕES DOS ELEMENTOS USANDO DOM
const videoElemento = document.getElementById("video");
const botaoScanear = document.getElementById("btn-texto");
const resultado = document.getElementById("resultado");
const canvas = document.getElementById("canvas");

// FUNÇÃO QUE HABILITA A CÂMERA
async function configurarCamera() {
    try {
        const midia = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" },
            audio: false
        });

        videoElemento.srcObject = midia;
        videoElemento.play();

    } catch (erro) {
        resultado.innerText = "Erro ao acessar a câmera";
        console.error(erro);
    }
}

// executa a função da câmera
configurarCamera();

// Função para ler o texto que câmera pegar
botaoScanear.onclick = async () => {

    botaoScanear.disabled = true;
    resultado.innerText = "Fazendo a leitura... aguarde";

    const contexto = canvas.getContext("2d");

    // ajustar tamanho
    canvas.width = videoElemento.videoWidth;
    canvas.height = videoElemento.videoHeight;

    // reset transformação
    contexto.setTransform(1, 0, 0, 1, 0, 0);

    // filtros
    contexto.filter = 'contrast(1.2) grayscale(1)';

    // DESENHA O VÍDEO NO CANVAS
    contexto.drawImage(videoElemento, 0, 0, canvas.width, canvas.height);

    try {

        const { data: { text } } = await Tesseract.recognize(
            canvas,
            'por'
        );

        const textoFinal = text.trim();

        resultado.innerText =
            textoFinal.length > 0
                ? textoFinal
                : "Não foi possível identificar o texto";

    } catch (erro) {

        console.error(erro);
        resultado.innerText = "Erro ao processar";

    } finally {

        botaoScanear.disabled = false;

    }

};