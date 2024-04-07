const equipes = JSON.parse(localStorage.getItem('equipes')) || []
var rodadas = [];
var rodadasRepescagem = [];
var equipesRepescagem = [];

function adicionarEquipes() {
    const imagemArquivo = document.getElementById("inputLogo").files[0];
    const nomeEquipe = document.getElementById("nome").value.trim();
    const logoPadrao = 'assets/img/logo.webp';

    if (!nomeEquipe) {
        alert("Informe o nome da equipe.");
        return;
    }

    let imagemEquipe = logoPadrao;

    if (imagemArquivo) {
        const extensoesAceitas = ['.png', '.jpeg', '.jpg', '.webp'];
        const extensao = imagemArquivo.name.substring(imagemArquivo.name.lastIndexOf('.')).toLowerCase();

        if (!extensoesAceitas.includes(extensao)) {
            alert("Por favor, selecione um arquivo no formato PNG, JPEG ou WebP.");
            return;
        }

        const tamanhoMaximo = 2 * 1024 * 1024;

        if (imagemArquivo.size > tamanhoMaximo) {
            alert("O arquivo deve ter no máximo 2MB.");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = function () {
            const img = new Image();
            img.src = reader.result;

            img.onload = function () {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = 200;
                canvas.height = 200;
                ctx.drawImage(img, 0, 0, 200, 200);

                const novoLogo = canvas.toDataURL('image/webp');

                const id = Date.now().toString(); // Gerar uma ID única
                equipes.push({
                    id: id,
                    nome: nomeEquipe,
                    imagem: novoLogo,
                    botao: undefined
                });

                document.getElementById("inputLogo").value = "";
                document.getElementById("nome").value = "";
                carregarEquipes();
            };
        };
        reader.readAsDataURL(imagemArquivo);
    } else {
        const id = Date.now().toString(); // Gerar uma ID única
        equipes.push({
            id: id,
            nome: nomeEquipe,
            imagem: imagemEquipe,
            botao: undefined
        });

        document.getElementById("inputLogo").value = "";
        document.getElementById("nome").value = "";
        carregarEquipes();
    }
}


document.getElementById('nome').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        adicionarEquipes()
    }
})


function carregarEquipes() {
    const listaEquipes = document.getElementById("listaEquipes");
    listaEquipes.innerHTML = "";

    const titulo = document.createElement('h3')
    titulo.innerText = 'EQUIPES'
    listaEquipes.appendChild(titulo)

    for (let i = 0; i < equipes.length; i++) {
        let mainContainer = document.createElement("div");
        mainContainer.classList = 'equipe'

        let info = document.createElement('div')
        info.classList = 'info-equipe'
        let remover = document.createElement('div')
        remover.classList = 'remover-btn'
        
        const imagem = document.createElement("img");
        imagem.src = equipes[i].imagem;
        const nome = document.createElement("p");
        nome.innerText = equipes[i].nome;

        const removerButton = document.createElement("i");
        removerButton.classList = `bi bi-trash`
        removerButton.setAttribute('title', `Remover ${equipes[i].nome}`)
        

        removerButton.onclick = function() {
            if (confirm("Tem certeza de que deseja remover esta equipe?")) {
                equipes.splice(i, 1);
                carregarEquipes();
            }
        };

        info.appendChild(imagem);
        info.appendChild(nome);
        remover.appendChild(removerButton)

        mainContainer.appendChild(info);
        mainContainer.appendChild(remover);

        listaEquipes.appendChild(mainContainer);
    }

    localStorage.setItem('equipes', JSON.stringify(equipes));
}

function btnCriarChaves(){
    if(confirm("Tem certeza que deseja gerar uma nova chave? \n(Essa ação apagará qualquer chave ja existente)")){
        rodadas = [];
        rodadasRepescagem = [];
        equipesRepescagem = [];
        var chave = document.getElementById("chave");
        chave.innerHTML = "";
        var repescagem = document.getElementById("repescagem");
        repescagem.innerHTML = "";
        criarChaves();
    }
}

function criarChaves(){
    var chavesTemp = [];
    var equipesTemp =[];

    if(rodadas.length==0)
        equipesTemp = [...equipes];
    else{
        for(let r=0; r<rodadas.length; r++){
            rodadas[r].winners = [];
            for(let c=0; c<rodadas[r].chaves.length; c++){
                rodadas[r].winners.push(rodadas[r].chaves[c].vencedor);
            }
            if(rodadas.length == 1){
                if(rodadasRepescagem[rodadasRepescagem.length-1].chaves[0].equipe2 == undefined){
                    rodadas[rodadas.length-1].winners.push(rodadasRepescagem[rodadasRepescagem.length-1].chaves[0].equipe1);
                }
            }
        }
        equipesTemp = [...rodadas[rodadas.length - 1].winners];
    }

    if(rodadas.length==0 || equipesTemp.length % 2 != 0 && equipesTemp.length != 1){
        for (let i = equipesTemp.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [equipesTemp[i], equipesTemp[j]] = [equipesTemp[j], equipesTemp[i]];
        }
    }

    if (equipesTemp.length % 2 != 0 && equipesTemp.length != 1) {
        var novaEquipePreenchimento = {
            nome: null,
            imagem: "assets/img/icon.ico",
            botao: undefined
        }; 
        equipesTemp.push(novaEquipePreenchimento);
    }
        
    for (let i = 0; i < equipesTemp.length; i+=2) {
        var novaChave = {
            equipe1: equipesTemp[i],
            equipe2: equipesTemp[i+1],
            vencedor: undefined,
        };
        chavesTemp.push(novaChave);
    }

    var novaRodada = {
        chaves: [...chavesTemp],
        winners: []
    }; 
    
    rodadas.push(novaRodada);

    carregarChaves();
    carregarChavesRepescagem();
}
function carregarChaves(){
    var chaveDiv = document.getElementById("chave");
    chaveDiv.innerHTML = "";

    for(let r = 0; r < rodadas.length; r++){
        var mainDiv = document.createElement("div");
        mainDiv.classList.add("rodada")

        for (let c = 0; c < rodadas[r].chaves.length; c++) {
            let chave = rodadas[r].chaves[c];
            var duplaDiv = document.createElement("div");
            duplaDiv.classList.add("dupla");

            if(rodadas[rodadas.length-1].chaves[0].equipe2 != undefined){
                if(rodadasRepescagem.length == 0 || rodadasRepescagem[rodadasRepescagem.length-1].chaves[0].equipe2 == undefined && rodadas.length>1){
                    if(r == rodadas.length - 1){
                        let desfazer = document.createElement('div')
                        desfazer.classList = 'desfazer'
                        var desfazerButton = document.createElement("i");
                        desfazerButton.classList = 'bi bi-arrow-counterclockwise'
                        desfazerButton.setAttribute('title', 'Desfazer')
                        desfazerButton.onclick = criarBotaoDesfazerHandler(chave);
                        desfazer.appendChild(desfazerButton)
                        duplaDiv.appendChild(desfazer)
                    }
                }
            }

            carregarElementosChaves(duplaDiv,chave);

            mainDiv.appendChild(duplaDiv);
        }
        chaveDiv.appendChild(mainDiv);
    }
}
function criarBotaoAvancarHandler(chave,winner) {
    return function() {
        chave.vencedor = winner ? chave.equipe1 : chave.equipe2;
        carregarChaves();
        carregarChavesRepescagem();
    };
}
function criarBotaoDesfazerHandler(chave) {
    return function() {
        if (chave.vencedor && chave.equipe1.nome != null && chave.equipe2.nome != null) {

            const index = rodadas[rodadas.length-1].winners.indexOf(chave.vencedor);
            rodadas[rodadas.length-1].winners.splice(index, 1);

            const perdedor = chave.equipe1 === chave.vencedor ? chave.equipe2 : chave.equipe1;
            const perdedorIndex = equipesRepescagem.findIndex(equipe => equipe.nome === perdedor.nome);

            if (perdedorIndex !== -1) {
                equipesRepescagem.splice(perdedorIndex, 1);
            }
            
            chave.vencedor = undefined;

            if (chave.equipe1Botao) {
                chave.equipe1Botao.disabled = false;
                chave.equipe1Botao.style.backgroundColor = '';
            }
            if (chave.equipe2Botao) {
                chave.equipe2Botao.disabled = false;
                chave.equipe2Botao.style.backgroundColor = '';
            }

                carregarChaves();
                carregarChavesRepescagem();
        } else {
            alert("Não é possível retroceder essa equipe na atual chave");
        }
    };
}

function criarChavesRepescagem(){
    var chavesTemp = [];
    var equipesTemp =[];

    if(rodadasRepescagem.length==0){

        equipesRepescagem = [];
        for(let c=0; c<rodadas[0].chaves.length; c++){
            if(rodadas[0].chaves[c].vencedor == rodadas[0].chaves[c].equipe1){
                if(rodadas[0].chaves[c].equipe2.nome){
                    equipesRepescagem.push(rodadas[0].chaves[c].equipe2);
                }
            }
            else if(rodadas[0].chaves[c].vencedor == rodadas[0].chaves[c].equipe2){
                if(rodadas[0].chaves[c].equipe1.nome){
                    equipesRepescagem.push(rodadas[0].chaves[c].equipe1);
                }
            }
        }
        equipesTemp = [...equipesRepescagem];
    }else{
        for(let r=0; r<rodadasRepescagem.length; r++){
            rodadasRepescagem[r].winners = [];
            for(let c=0; c<rodadasRepescagem[r].chaves.length; c++){
                rodadasRepescagem[r].winners.push(rodadasRepescagem[r].chaves[c].vencedor);
            }
        }
        equipesTemp = [...rodadasRepescagem[rodadasRepescagem.length - 1].winners];
    }

    if(rodadasRepescagem.length==0 || equipesTemp.length % 2 != 0 && equipesTemp.length != 1){
        for (let i = equipesTemp.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [equipesTemp[i], equipesTemp[j]] = [equipesTemp[j], equipesTemp[i]];
        }
    }

    if (equipesTemp.length % 2 != 0 && equipesTemp.length != 1) {
        var novaEquipePreenchimento = {
            nome: null,
            imagem: "assets/img/icon.ico",
            botao: undefined
        }; 
        equipesTemp.push(novaEquipePreenchimento);
    }
        
    for (let i = 0; i < equipesTemp.length; i+=2) {
        var novaChave = {
            equipe1: equipesTemp[i],
            equipe2: equipesTemp[i+1],
            vencedor: undefined,
        };
        chavesTemp.push(novaChave);
    }

    var novaRodada = {
        chaves: [...chavesTemp],
        winners: []
    }; 
    rodadasRepescagem.push(novaRodada);

    carregarChavesRepescagem();
    carregarChaves();
}

function carregarChavesRepescagem(){
    var chaveDiv = document.getElementById("repescagem");
    chaveDiv.innerHTML = "";

    for(let r = 0; r < rodadasRepescagem.length; r++){
        var mainDiv = document.createElement("div");
        mainDiv.classList.add("rodada")

        for (let c = 0; c < rodadasRepescagem[r].chaves.length; c++) {
            let chave = rodadasRepescagem[r].chaves[c];
            var duplaDiv = document.createElement("div");
            duplaDiv.classList.add("dupla");
        
            if(rodadasRepescagem[rodadasRepescagem.length-1].chaves[0].equipe2 != undefined){
                if(r == rodadasRepescagem.length - 1 && rodadas.length == 1 ){
                    let desfazer = document.createElement('div')
                    desfazer.classList = 'desfazer'
                    var desfazerButton = document.createElement("i");
                    desfazerButton.classList = 'bi bi-arrow-counterclockwise'
                    desfazerButton.setAttribute('title', 'Desfazer')
                    desfazerButton.onclick = criarBotaoDesfazerHandler(chave);
                    desfazer.appendChild(desfazerButton)
                    duplaDiv.appendChild(desfazer)
                }
            }

            carregarElementosChaves(duplaDiv,chave);

            

            mainDiv.appendChild(duplaDiv);
        }
        chaveDiv.appendChild(mainDiv);
    }
}

function avancarChaves(){
    if(rodadas.length>0){
        if(rodadas.length == 1){
            if(!rodadas[rodadas.length - 1].chaves.every(chaves => chaves.vencedor )){
                alert("Não é possivel avançar as chaves antes que todas tenham um vencedor definido");
                return;
            }
            if(rodadasRepescagem.length>0){
                if(rodadasRepescagem[rodadasRepescagem.length-1].chaves[0].equipe2 == undefined){
                    criarChaves();
                }else if( rodadasRepescagem[rodadasRepescagem.length - 1].chaves.every(chaves => chaves.vencedor )){
                    criarChavesRepescagem();
                    if(rodadasRepescagem[rodadasRepescagem.length-1].chaves[0].equipe2 == undefined)
                        criarChaves();
                }else
                    alert("Não é possivel avançar a repescagem antes que todas as equipes tenham um vencedor definido")
            }else
                criarChavesRepescagem();   
        }else if(rodadas[rodadas.length - 1].chaves.every(chaves => chaves.vencedor )){
            criarChaves();
        }else
            alert("Não é possivel avançar as chaves antes que todas tenham um vencedor definido")
    }else
        alert("É necessario ter chaves geradas antes de avança-las");
}
function voltarChaves(){
    if(rodadas.length == 1 && rodadasRepescagem.length == 0){
        alert("Não é possivel retroceder na primeira chave");
    }else if(rodadas.length>0){
        if(confirm("Tem certeza que deseja retroceder a chave atual? \n(Essa ação apagará qualquer vencedor na chave atual\n(Se retrocedido na primeira rodada ou se houver equipe de descanso as equipes serão sorteadas denovo quando as chaves forem avançadas)")){
            if(rodadas.length == 2 && rodadasRepescagem[rodadasRepescagem.length-1].chaves[0].equipe2 == undefined){
                rodadas.pop();
                rodadasRepescagem.pop();
                carregarChaves();
                carregarChavesRepescagem();
            }else if(rodadas.length == 1 && rodadasRepescagem[rodadasRepescagem.length-1].chaves[0].equipe2 != undefined){
                rodadasRepescagem.pop();
                carregarChavesRepescagem();
            }else{
                rodadas.pop();
                carregarChaves();
            }
            carregarChaves();
        }
    }else{
        alert("É necessario ter chaves geradas antes de retrocede-las");
    }
}

function carregarElementosChaves(duplaDiv,chave){
    var equipe1Imagem = document.createElement("img");
            equipe1Imagem.src = chave.equipe1.imagem;
            var equipe1Nome = document.createElement("p");
            equipe1Nome.textContent = chave.equipe1.nome;
            var equipe1MainContainer = document.createElement("div");
            equipe1MainContainer.classList = 'equipe1'
            var equipe1Botao = document.createElement("i");
            equipe1Botao.classList = 'bi bi-arrow-right-circle'
            equipe1Botao.onclick = criarBotaoAvancarHandler(chave, true);
            chave.equipe1Botao = equipe1Botao;

            equipe1MainContainer.appendChild(equipe1Imagem);
            equipe1MainContainer.appendChild(equipe1Nome);
            equipe1MainContainer.appendChild(equipe1Botao);
            duplaDiv.appendChild(equipe1MainContainer);

            if(chave.equipe2){
                var equipe2Imagem = document.createElement("img");
                equipe2Imagem.src = chave.equipe2.imagem;
                var equipe2Nome = document.createElement("p");
                equipe2Nome.textContent = chave.equipe2.nome;
                var equipe2MainContainer = document.createElement("div");
                equipe2MainContainer.classList = 'equipe2'
                var equipe2Botao = document.createElement("i");
                equipe2Botao.classList = 'bi bi-arrow-right-circle'
                equipe2Botao.onclick = criarBotaoAvancarHandler(chave, false);
                chave.equipe2Botao = equipe2Botao;

                equipe2MainContainer.appendChild(equipe2Imagem);
                equipe2MainContainer.appendChild(equipe2Nome);
                equipe2MainContainer.appendChild(equipe2Botao);
                duplaDiv.appendChild(equipe2MainContainer);
            }else{
                equipe1Botao.classList = 'bi bi-trophy-fill'
                equipe1MainContainer.style.backgroundColor = 'green';
                equipe1Botao.onclick = null;
            }
            
            if(!chave.vencedor && chave.equipe2){
                if(chave.equipe1.nome == null){
                    chave.vencedor = chave.equipe2;
                }else if(chave.equipe2.nome == null){
                    chave.vencedor = chave.equipe1;
                }
            }

            if (chave.vencedor) {
                if (chave.vencedor == chave.equipe1) {
                    equipe1Botao.classList = 'bi bi-arrow-right-circle-fill'
                    equipe1Botao.style.display = 'block';

                    equipe2Imagem.style.filter = "grayscale(100%)"
                    equipe2Botao.style.opacity = '0'
                    equipe2Botao.style.cursor = 'default';
                    equipe2MainContainer.style.backgroundColor = '#24272a';
                }else if (chave.vencedor == chave.equipe2){
                    equipe1Imagem.style.filter = "grayscale(100%)"
                    equipe1Botao.style.opacity = '0'
                    equipe1Botao.style.cursor = 'default';
                    equipe1MainContainer.style.backgroundColor = '#24272a';

                    equipe2Botao.classList = 'bi bi-arrow-right-circle-fill'
                    equipe2Botao.style.display = 'block'
                }
                equipe1Botao.onclick = null;
                equipe2Botao.onclick = null;
            }
}

carregarEquipes();
