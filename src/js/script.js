// DECLARAÇÕES DOS ELEMENTOS USANDO DOM
const videoElemento = document.getElementById("video");
const botaoScanear= document.getElementById("btn-texto");
const resultado = document.getElementById("resultado");
const canvas = document.getElementById("canvas");


//FUNÇÃO QUE HABILITA A CÂMERA

async function configurarCamera(){
    try{
        const midia = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" },// aciona a camera traseira
            audio:false
        });
        // recebe a função midi para habilitar a camera
        videoElemento.srcObject = midia;
        //garante que o video comece
        videoElemento.play();

    }catch(erro){
        resultado.innerText="Erro ao acessar a camera",erro
    }
}
//executa a função da câmera
configurarCamera();

// Função para ler o texto que câmera pegar

botaoScanear.onclick = async ()=>{
    botaoScanear.disable=true; // habilita a câmera
    resultado.innerText="Fazendo a leitura...aguarde";

    //preparando o canvas para criar estrutura da câmera
    const contexto = canvas.getContext("2d");

    //ajustar o tamanho do canvas
    canvas.width = videoElemento.videoWidth; //largura
    canvas.height = videoElemento.videoHeight; //altura

    //reset para garantir que a foto não saia invertida
    contexto.setTransform(1, 0, 0, 1, 0, 0);

    //filtro de contraste e escala de cinza antes de tirar a foto
    //ajuda a evitar as letras aleatorias

    contexto.filter = 'contrast(1.2) grayscale(1)';
    try{
        //consumindo api
        const { data: { text }} =await Tesseract.recognize(
            canvas, //aonde o texto vai aparecer
            'por' //idioma do texto
        );
        // Remove espaços excessivos e caracteres especiais 
        const textoFinal = text.trim();
        resultado.innerText = textoFinal.length > 0 ? textoFinal : "Não foi possivel identificar o textp";

    }catch(erro){
        console.error(erro);
        resultado.innerText="Erro ao processar",erro
    }
    finally{
        // desabilita a câmera para fazer uma nova captura
        botaoScanear.disable=false; 
    }
