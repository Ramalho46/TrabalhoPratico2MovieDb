const APIurl = 'https://api.themoviedb.org/3/movie/popular?api_key=82e3160b362bd6e69585ed82fdf77260&language=pt-BR'
const carrossel = document.getElementById('carouselExampleCaptions');

//função imprime
function imprimeCarrossel(filmes){
    var slides = '';
    var indicadores = '';
    
    filmes.forEach((filme, index) => {
        indicadores += `
        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="${index}" ${index === 0 ? 'class="active" aria-current="true"' : ''} aria-label="Slide ${index + 1}"></button>
        `
        
        slides += `
        <div class="carousel-item ${index === 0 ? 'active' : ''}">
        <a href="detalhes.html?id=${filme.id}"><img src="https://image.tmdb.org/t/p/w1280${filme.backdrop_path}" class="d-block w-100" alt="${filme.title}"></a>
        <div class="carousel-caption d-none d-md-block">
        <h5>${filme.title}</h5>
        <p>${limitarTexto(filme.overview, 150)}</p>
        </div>
        </div>
        `;
    });
    
    document.querySelector('.carousel-indicators').innerHTML = indicadores;
    document.querySelector('.carousel-inner').innerHTML = slides;
    
}

//imprimir carrossel no index.html
fetch(APIurl)
.then((response) => response.json())
.then(data => {
    imprimeCarrossel(data.results);
})
.catch(error => {
    console.error("erro:", error);
    document.getElementById('carrossel').textContent = 'erro ao carregar filmes';
});


//Função imprime séries novas
function imprimeNovas(filmes){
    var card = '';

    filmes.forEach((filme) => {
        card += `
            <div class="col">
                <div class="card">
                    <a href="detalhes.html?id=${filme.id}"><img src="https://image.tmdb.org/t/p/w1280${filme.backdrop_path}" alt="${filme.name}"></a>
                    <div class="card-body">
                        <a href="detalhes.html?id=${filme.id}"><h5 class="card-title">${filme.name}</h5></a>
                        <p class="card-text">${limitarTexto(filme.overview, 150) || 'Sem descrição disponível.'}</p>
                    </div>
                </div>
            </div>
        `
    })
    document.getElementById('seriesNovas').innerHTML = card;
}

fetch('https://api.themoviedb.org/3/tv/on_the_air?api_key=82e3160b362bd6e69585ed82fdf77260&language=pt-BR&sort_by=first_air_date.desc')
.then((response) => response.json())
.then(data => {
    imprimeNovas(data.results);
})
.catch(error => {
    console.error("erro:", error);
    document.getElementById('seriesNovas').textContent = 'erro ao carregar filmes';
});

//info aluno
fetch('http://localhost:3000/aluno')
.then((response) => response.json())
.then(data => {
    console.log(data);
    var aluno = data[0]; 
    const infoAluno = document.getElementById('infoAluno');
    const biografia = document.getElementById('miniBio');
    const social = document.getElementById('redesSocial');

    const infoSocial = `
        <p><strong>Facebook:</strong> ${aluno.facebook}</p>
        <p><strong>Twitter:</strong> ${aluno.twitter}</p>
        <p><strong>Instagram:</strong> ${aluno.instagram}</p>
    `

    const info = `
        <img src="${aluno.avatar}" alt="avatarAluno" width="100px">
        <p><strong>Aluno:</strong> ${aluno.nome}</p>
        <p><strong>Curso:</strong> ${aluno.curso}</p>
        <p><strong>Turma:</strong> ${aluno.turma}</p>
    `

    miniBio.innerHTML = aluno.biografia;
    infoAluno.innerHTML = info;
    social.innerHTML = infoSocial;
})
.catch(error => {
    console.error("Erro ao carregar dados do aluno:", error);
});


//funcionalidade da barra de pesquisa

const inputPesquisa = document.getElementById('barraPesquisa');
const botaoPesquisar = document.getElementById('btnPesquisa'); 

if(inputPesquisa && botaoPesquisar){
    botaoPesquisar.addEventListener('click', () => {
        const termo = inputPesquisa.value.trim();
        if(termo !== '') {
            buscarFilmesNaAPI(termo);
        }
    });

    inputPesquisa.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                botaoPesquisar.click();
            }
    });
}

function buscarFilmesNaAPI(termo) {
    const url = `https://api.themoviedb.org/3/search/tv?api_key=82e3160b362bd6e69585ed82fdf77260&language=pt-BR&query=${encodeURIComponent(termo)}`;

    fetch(url)
    .then((response) => response.json())
    .then(data => {
        if(data.results && data.results.length > 0) {
            mostrarFilmes(data.results);
        }else
            document.getElementById('resultadoPesquisa').innerHTML = '<p>Nenhuma série encontrada.</p>';
    })
    .catch(error => {
        document.getElementById('resultadoPesquisa').innerHTML = '<p>Erro ao buscar séries.</p>';
    });
}

function mostrarFilmes(filmes) {
    const container = document.getElementById('resultadoPesquisa');
    let cards = '';

    filmes.forEach(filme => {
        const imagem = filme.backdrop_path ? `https://image.tmdb.org/t/p/w780${filme.backdrop_path}` : 'img/placeholder.jpg';

        cards += `
             <div class="col-6">
                <div class="card">
                    <a href="detalhes.html?id=${filme.id}"><img src="${imagem}" class="card-img-top" alt="${filme.name}"></a>
                    <div class="card-body">
                        <a href="detalhes.html?id=${filme.id}"><h5 class="card-title">${filme.name}</h5></a>
                        <p class="card-text">${limitarTexto(filme.overview, 150) || 'Sem descrição disponível.'}</p>
                    </div>
                </div>
            </div>
        `;
    });
    container.innerHTML = cards;
}

function limitarTexto(texto, limite) {
    if(!texto) return '';
    if(texto.length <= limite) {
        return texto;
    }
    return texto.substring(0,limite) + '...';
}

botaoPesquisar.addEventListener('click', (e) => {
    e.preventDefault();
    const termo = inputPesquisa.value.trim();
    if (termo !== '') {
        buscarFilmesNaAPI(termo);
    }
});