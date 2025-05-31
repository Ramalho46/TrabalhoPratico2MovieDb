const APIurl = 'https://api.themoviedb.org/3/tv/popular?api_key=82e3160b362bd6e69585ed82fdf77260&language=pt-BR'
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
        <h5>${filme.name}</h5>
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
    var aluno = data[0]; 
    const infoAluno = document.getElementById('infoAluno');
    const biografia = document.getElementById('miniBio');
    const social = document.getElementById('redesSocial');

    const infoSocial = `
        <p><strong>Facebook:</strong> <a href="facebook.com">${aluno.facebook}</a></p>
        <p><strong>Twitter:</strong> <a href="x.com">${aluno.twitter}</a></p>
        <p><strong>Instagram:</strong> <a href="instagram.com">${aluno.instagram}</a></p>
    `

    const info = `
        <img src="${aluno.avatar}" alt="avatarAluno" width="100px">
        <div>
            <p><strong>Aluno:</strong> ${aluno.nome}</p>
            <p><strong>Curso:</strong> ${aluno.curso}</p>
            <p><strong>Turma:</strong> ${aluno.turma}</p>
        </div>
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


document.addEventListener('DOMContentLoaded', function () {
    var id = new URLSearchParams(location.search).get('id');
    
    fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=82e3160b362bd6e69585ed82fdf77260&language=pt-BR`)
    .then(response => response.json())
    .then(filme => {
        const generos = filme.genres.map(g => g.name).join(', ');
        const dataFormatada = formatarDataBR(filme.first_air_date);

        document.getElementById('visaoGeral').innerHTML = `
        <div class="col">
            <div class="card">
                <img src="https://image.tmdb.org/t/p/w1280${filme.backdrop_path}" alt="${filme.name}">
                <div class="card-body">
                    <h5 class="card-title">${filme.name}</h5>
                    <p class="card-text">${limitarTexto(filme.overview, 150) || 'Sem descrição disponível.'}</p>
                    <p>${dataFormatada}</p>
                    <p>${generos}</p>
                    <button onclick="favoritarSerie(${id})" data-id="${filme.id} type="button" class="btn btn-primary">Favoritar</button>
                </div>
            </div>
        </div>
        `;
    })
    .catch(error => {
        console.error('Erro ao buscar série:', error);
        document.getElementById('visaoGeral').innerHTML = '<p class="text-danger">Erro ao carregar os dados.</p>';
    });
});

function formatarDataBR(dataISO) {
  if (!dataISO) return 'Data não disponível';

  const partes = dataISO.split('-');
  if (partes.length !== 3) return dataISO; // caso a data venha errada
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function favoritarSerie(tmdbId){
    const id = parseInt(tmdbId);
    fetch(`http://localhost:3000/preferidas?tmdbId=${id}`)
    .then(response => response.json())
    .then(data => {
        const jaFavoritado = data.some(item => parseInt(item.tmdbId) === id);
        if(jaFavoritado){
            alert('Este item já está nos seus favoritos!');
    }else{
        fetch('http://localhost:3000/preferidas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({tmdbId: id})
        })
        .then(response => response.json())
        .then(() => alert('Adicionado aos favoritos!'))
        .catch(error => console.error('Erro ao adicionar favorito:', error));
        }
    })
    .catch(error => console.error('Erro ao verificar favoritos:', error));
}
   
function imprimeElenco(atores){
     if (!atores || atores.length === 0) {
        elenco.innerHTML = `<p class="text-danger">Elenco não encontrado.</p>`;
        return;
    }
    
    var card = '';

    atores.forEach((atores) => {
        card += `
            <div class="col">
            <div class="card">
              <img src="https://image.tmdb.org/t/p/w185${atores.profile_path}" class="card-img-top" alt="${atores.name}">
              <div class="card-body">
                <h5 class="card-title">${atores.name}</h5>
                <p class="card-text"><strong>Personagem: </strong>${atores.character}</p>
              </div>
            </div>
          </div>
        `;
    })
    document.getElementById('elenco').innerHTML = card;
}

const params = new URLSearchParams(window.location.search);
const id = params.get('id');

fetch(`https://api.themoviedb.org/3/tv/${id}/credits?api_key=82e3160b362bd6e69585ed82fdf77260&language=pt-BR`)
    .then(response => response.json())
    .then(data => {
        imprimeElenco(data.cast);
    })
    .catch(error => console.error('Erro ao carregar elenco:', error));

    botaoPesquisar.addEventListener('click', (e) => {
    e.preventDefault();
    const termo = inputPesquisa.value.trim();
    if (termo !== '') {
        buscarFilmesNaAPI(termo);
    }
});