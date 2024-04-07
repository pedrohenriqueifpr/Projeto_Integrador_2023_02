// Exportar
function exportarEquipes() {
    const equipes = JSON.parse(localStorage.getItem('equipes')) || [];
    const dadosJSON = JSON.stringify({ equipes });

    const momento = Date.now();
    const nomeArquivo = `dados_${momento}.txt`;

    const blob = new Blob([dadosJSON], { type: 'text/plain' });
    const link = document.createElement('a');

    link.href = window.URL.createObjectURL(blob);
    link.download = nomeArquivo;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

document.getElementById('exportar-btn').addEventListener('click', exportarEquipes);

// Importar 
document.getElementById('importar-btn').addEventListener('click', function () {
    const fileInput = document.getElementById('fileInput')
    const file = fileInput.files[0]

    if (!file) {
        alert('Selecione um arquivo antes de importar.')
        return
    }

    const reader = new FileReader()
    reader.onload = function (e) {
        const conteudo = e.target.result
        const dados = JSON.parse(conteudo)
        localStorage.setItem('equipes', JSON.stringify(dados.equipes))
        alert('Importação bem-sucedida!')
    }
    reader.readAsText(file)
})


