const hamburguer = document.querySelector(".hamburguer");
const navMenu = document.querySelector("ul");

hamburguer.addEventListener("click", () => {
    hamburguer.classList.toggle('active');
    navMenu.classList.toggle('active');
})

function toggleAside() {
    var section = document.querySelector('section')
    var aside = document.getElementById('aside');

    if (aside.classList.contains('mostrar')) {
        aside.classList.remove('mostrar');
        aside.classList.add('esconder');
        section.style.marginLeft = '5px'

    } else {
        aside.classList.remove('esconder');
        aside.classList.add('mostrar');
        section.style.marginLeft = '300px'

    }
}

function captureScreen() {
    const mainElement = document.querySelector('main');
    html2canvas(mainElement).then(function(canvas) {
        const screenshotUrl = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.href = screenshotUrl;
        downloadLink.download = 'historico.png'; 
        downloadLink.click();
    });
}
