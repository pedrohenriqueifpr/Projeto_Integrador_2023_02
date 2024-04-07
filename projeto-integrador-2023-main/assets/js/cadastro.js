const inputFile = document.querySelector("#logoInput");
const imagem = document.querySelector(".imagemPreview");
const textoImagem = "Escolha a imagem";
imagem.innerHTML = textoImagem;

inputFile.addEventListener("change", function (e) {
  const inputTarget = e.target;
  const file = inputTarget.files[0];

  if (file) {
    const reader = new FileReader();

    reader.addEventListener("load", function (e) {
      const readerTarget = e.target;

      const img = document.createElement("img");
      img.src = readerTarget.result;
      img.classList.add("imagem");

      imagem.innerHTML = "";
      imagem.appendChild(img);
    });

    reader.readAsDataURL(file);
  } else {
    imagem.innerHTML = textoImagem;
  }
});

function adicionarEquipe() {
    const nomeInput = document.getElementById('nome');
    const nome = nomeInput.value.trim();
    const logoInput = document.getElementById('logoInput')
    const logoArquivo = logoInput.files[0]
    const logoPadrao = 'assets/img/logo.webp'

    if (nome.trim() === "") {
        alert("O nome da equipe é obrigatório.")
        return
    }

    let equipes = JSON.parse(localStorage.getItem('equipes')) || []
    const nomeJaExiste = equipes.some(equipe => equipe.nome.toLowerCase() === nome.toLowerCase())

    if (nomeJaExiste) {
        alert("Este nome de equipe já está em uso.")
        return
    }

    if (logoArquivo) {
        const extensoesAceitas = ['.png', '.jpeg', '.jpg', '.webp']
        const extensao = logoArquivo.name.substring(logoArquivo.name.lastIndexOf('.')).toLowerCase()

        if (!extensoesAceitas.includes(extensao)) {
            alert("Por favor, selecione um arquivo no formato PNG, JPEG ou WebP.")
            return
        }

        const tamanhoMaximo = 2 * 1024 * 1024 
        if (logoArquivo.size > tamanhoMaximo) {
            alert("O arquivo deve ter no máximo 2MB.")
            return
        }

        const reader = new FileReader()
        reader.onloadend = function () {
            const img = new Image()
            img.src = reader.result

            img.onload = function () {
                const canvas = document.createElement('canvas')
                const ctx = canvas.getContext('2d')
                canvas.width = 200
                canvas.height = 200
                ctx.drawImage(img, 0, 0, 200, 200)

                const novoLogo = canvas.toDataURL('image/webp')

                adicionarEquipeNoLocalStorage(nome, novoLogo)
            }
        }
        reader.readAsDataURL(logoArquivo)
    } else {
        adicionarEquipeNoLocalStorage(nome, logoPadrao)
    }

    document.getElementById('nome').value = ""
    logoInput.value = ""
    imagem.innerHTML = textoImagem;
}

document.getElementById('nome').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        adicionarEquipe()
    }
})

function selecionarArquivo() {
    document.getElementById('logoInput').click()
}

function adicionarEquipeNoLocalStorage(nome, imagem) {
    const id = Date.now().toString()
    const equipe = { id, nome, imagem }

    let equipes = JSON.parse(localStorage.getItem('equipes')) || []
    equipes.push(equipe)
    localStorage.setItem('equipes', JSON.stringify(equipes))

    mostrarEquipes()

    setTimeout(() => {
        alert(`Você adicionou: ${nome}`)
    }, 50)
}

function editarEquipe(id) {
    const equipes = JSON.parse(localStorage.getItem('equipes')) || []
    const equipeAtual = equipes.find(equipe => equipe.id === id)

    if (!equipeAtual) return

    const novoNome = prompt("Qual é o novo nome da equipe?", equipeAtual.nome).trim()

    if (novoNome === null || novoNome.trim() === "" || novoNome === equipeAtual.nome) {
        return
    }
    
    const nomeJaExistente = equipes.some(equipe => equipe.nome === novoNome)

    if (nomeJaExistente) {
        alert("Este nome de equipe já está em uso.")
        return
    }

    equipeAtual.nome = novoNome
    localStorage.setItem('equipes', JSON.stringify(equipes))

    mostrarEquipes()
}

function excluirEquipe(id) {
    if (confirm("Tem certeza que deseja excluir esta equipe?")) {
        let equipes = JSON.parse(localStorage.getItem('equipes'))
        equipes = equipes.filter(equipe => equipe.id !== id)
        localStorage.setItem('equipes', JSON.stringify(equipes))

        mostrarEquipes()
    }
}

function trocarLogo(id) {
    const logoInput = document.createElement('input')
    logoInput.type = 'file'
    logoInput.accept = '.png, .jpeg, .jpg, .webp'
    logoInput.addEventListener('change', function() {
        const novoLogoArquivo = logoInput.files[0]

        if (novoLogoArquivo) {
            const reader = new FileReader()
            reader.onloadend = function() {
                const img = new Image()
                img.src = reader.result

                img.onload = function() {
                    const canvas = document.createElement('canvas')
                    const ctx = canvas.getContext('2d')
                    canvas.width = 200
                    canvas.height = 200
                    ctx.drawImage(img, 0, 0, 200, 200)

                    const novoLogo = canvas.toDataURL('image/webp')

                    let equipes = JSON.parse(localStorage.getItem('equipes')) || []
                    equipes = equipes.map(equipe => {
                        if (equipe.id === id) {
                            equipe.imagem = novoLogo
                        }
                        return equipe
                    })

                    localStorage.setItem('equipes', JSON.stringify(equipes))
                    
                    mostrarEquipes()
                }
            }
            reader.readAsDataURL(novoLogoArquivo)
        }
    })
    logoInput.click()
}

function mostrarEquipes() {
    let equipes = JSON.parse(localStorage.getItem('equipes')) || []
    const tabelaEquipes = document.getElementById('tabela-equipes').getElementsByTagName('tbody')[0]
    tabelaEquipes.innerHTML = ""

    equipes.forEach((equipe, index) => {
        const row = tabelaEquipes.insertRow()
        const cellSequencial = row.insertCell(0)
        const cellId = row.insertCell(1)
        const cellLogo = row.insertCell(2)
        const cellNome = row.insertCell(3)
        const cellAcoes = row.insertCell(4)

        cellSequencial.textContent = index + 1
        cellId.textContent = equipe.id
        cellNome.textContent = equipe.nome

        const logoImg = document.createElement('img')
        logoImg.src = equipe.imagem
        logoImg.alt = "Logo da Equipe"
        logoImg.classList.add('logo-equipe')
        logoImg.addEventListener('click', function() {
            trocarLogo(equipe.id)
        })
        cellLogo.appendChild(logoImg)

        const editarBtn = document.createElement('button')
        editarBtn.textContent = "Editar"
        editarBtn.className = "editar-btn"
        editarBtn.onclick = function() {
            editarEquipe(equipe.id)
        }
        cellAcoes.appendChild(editarBtn)

        const excluirBtn = document.createElement('button')
        excluirBtn.textContent = "Excluir"
        excluirBtn.className = "excluir-btn"
        excluirBtn.onclick = function() {
            excluirEquipe(equipe.id)
        }
        cellAcoes.appendChild(excluirBtn)
    })
}

mostrarEquipes()
