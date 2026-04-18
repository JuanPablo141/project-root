const faculdades = [
  { nome: "UNINASSAU Graças (Recife)", lat: -8.047, lng: -34.89 },
  { nome: "UNINASSAU Boa Viagem (Recife)", lat: -8.125, lng: -34.904 },
  { nome: "UNINASSAU Caxangá (Recife)", lat: -8.034, lng: -34.95 },
  { nome: "UNINASSAU Paulista", lat: -7.94, lng: -34.87 },
  { nome: "UNINASSAU Olinda", lat: -8.008, lng: -34.855 },
  { nome: "UNINASSAU Cabo", lat: -8.29, lng: -35.03 },
  { nome: "UNINASSAU Caruaru", lat: -8.283, lng: -35.976 },
  { nome: "UNINASSAU Petrolina", lat: -9.389, lng: -40.503 },
  { nome: "UNINASSAU Garanhuns", lat: -8.89, lng: -36.49 },
  { nome: "UNINASSAU Carpina", lat: -7.85, lng: -35.25 }
];

const cursos = [
  "Administração",
  "Análise e Desenvolvimento de Sistemas",
  "Arquitetura e Urbanismo",
  "Banco de Dados",
  "Biomedicina",
  "Ciência da Computação",
  "Ciências Aeronáuticas",
  "Ciências Contábeis",
  "Ciências Econômicas",
  "Coaching e Mentoring",
  "Design de Interiores",
  "Direito",
  "Educação Física - Bacharelado",
  "Enfermagem",
  "Engenharia Ambiental e Sanitária",
  "Engenharia Civil",
  "Engenharia da Computação",
  "Engenharia de Telecomunicações",
  "Engenharia Mecânica",
  "Estética e Cosmética",
  "Farmácia",
  "Fisioterapia",
  "Fonoaudiologia",
  "Gastronomia",
  "Gestão Comercial",
  "Gestão da Qualidade",
  "Gestão da Tecnologia da Informação",
  "Gestão de Recursos Humanos",
  "Gestão de Serviços Judiciais e Notariais",
  "Gestão de Trânsito",
  "Gestão Financeira",
  "Gestão Pública",
  "Jogos Digitais",
  "Jornalismo",
  "Logística",
  "Marketing",
  "Material de Construção",
  "Medicina",
  "Medicina Veterinária",
  "Negócios Imobiliários",
  "Nutrição",
  "Odontologia",
  "Pedagogia",
  "Processos Gerenciais",
  "Produção Audiovisual",
  "Psicologia",
  "Publicidade e Propaganda",
  "Relações Internacionais",
  "Segurança da Informação",
  "Segurança Pública",
  "Sistemas de Informação",
  "Teologia",
  "Terapia Ocupacional"
];

const avaliacoes = [
  // ADMINISTRAÇÃO
  { nome:"João M.", faculdade:"UNINASSAU Graças (Recife)", curso:"Administração", nota:5, comentario:"Professores ótimos 😍" },
  { nome:"Carla S.", faculdade:"UNINASSAU Boa Viagem (Recife)", curso:"Administração", nota:3, comentario:"Curso ok 🙂" },

  // DIREITO
  { nome:"Ana C.", faculdade:"UNINASSAU Boa Viagem (Recife)", curso:"Direito", nota:1, comentario:"Muito ruim 😭" },
  { nome:"Bruno R.", faculdade:"UNINASSAU Paulista", curso:"Direito", nota:4, comentario:"Bom curso 😀" },

  // CIÊNCIA DA COMPUTAÇÃO
  { nome:"Pedro S.", faculdade:"UNINASSAU Graças (Recife)", curso:"Ciência da Computação", nota:5, comentario:"Perfeito! 😍" },
  { nome:"Lucas T.", faculdade:"UNINASSAU Caruaru", curso:"Ciência da Computação", nota:2, comentario:"Estrutura fraca 😕" },

  // ENFERMAGEM
  { nome:"Mariana L.", faculdade:"UNINASSAU Petrolina", curso:"Enfermagem", nota:4, comentario:"Muito bom 😀" },
  { nome:"Juliana P.", faculdade:"UNINASSAU Olinda", curso:"Enfermagem", nota:3, comentario:"Regular 🙂" },

  // PSICOLOGIA
  { nome:"Fernanda A.", faculdade:"UNINASSAU Boa Viagem (Recife)", curso:"Psicologia", nota:5, comentario:"Amei o curso 😍" },
  { nome:"Rafael G.", faculdade:"UNINASSAU Garanhuns", curso:"Psicologia", nota:2, comentario:"Precisa melhorar 😕" },

  // ENGENHARIA CIVIL
  { nome:"Carlos D.", faculdade:"UNINASSAU Caruaru", curso:"Engenharia Civil", nota:4, comentario:"Boa estrutura 😀" },
  { nome:"Thiago M.", faculdade:"UNINASSAU Cabo", curso:"Engenharia Civil", nota:1, comentario:"Péssimo 😭" },

  // ARQUITETURA E URBANISMO
  { nome:"Beatriz F.", faculdade:"UNINASSAU Graças (Recife)", curso:"Arquitetura e Urbanismo", nota:5, comentario:"Top demais 😍" },
  { nome:"Amanda K.", faculdade:"UNINASSAU Paulista", curso:"Arquitetura e Urbanismo", nota:3, comentario:"Legal 🙂" },

  // FISIOTERAPIA
  { nome:"Diego N.", faculdade:"UNINASSAU Petrolina", curso:"Fisioterapia", nota:4, comentario:"Gostei bastante 😀" },
  { nome:"Paula V.", faculdade:"UNINASSAU Olinda", curso:"Fisioterapia", nota:2, comentario:"Ruim 😕" },

  // ODONTOLOGIA
  { nome:"Camila E.", faculdade:"UNINASSAU Graças (Recife)", curso:"Odontologia", nota:5, comentario:"Excelente 😍" },
  { nome:"André B.", faculdade:"UNINASSAU Cabo", curso:"Odontologia", nota:3, comentario:"Normal 🙂" },

  // MARKETING
  { nome:"Eduardo H.", faculdade:"UNINASSAU Paulista", curso:"Marketing", nota:4, comentario:"Curso atualizado 😀" },
  { nome:"Larissa Q.", faculdade:"UNINASSAU Caruaru", curso:"Marketing", nota:1, comentario:"Não gostei 😭" }
];

let map;
let filtroNota = 5;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 7,
    center: { lat: -8.3, lng: -36.0 },
  });

  criarMarcadores();
  popularFaculdades();
  popularCursos();
  configurarFiltro();
  renderAvaliacoes();
}

function criarMarcadores() {
  let infoAberta = null;

  faculdades.forEach(f => {

    const marker = new google.maps.Marker({
      position: { lat: f.lat, lng: f.lng },
      map,
      icon: {
        url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
      }
    });

    
    const info = new google.maps.InfoWindow({
      content: `
        <div style="
          background: white;
          border-radius: 16px;
          padding: 16px;
          width: 240px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          font-family: Arial;
        ">
          <div style="font-weight: bold; font-size: 16px; margin-bottom: 6px;">
            ${f.nome}
          </div>

          <div style="font-size: 13px; color: #555; margin-bottom: 10px;">
            📍 Recife - PE
          </div>

          <div style="margin-bottom: 10px;">
            ⭐ <b>4.2</b> (120 avaliações)
          </div>

          <button style="
            background: #4f7cff;
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 8px;
            cursor: pointer;
            width: 100%;
            font-weight: bold;
          ">
            Ver avaliações
          </button>
        </div>
      `
    });

    // 🔥 ABRE AO PASSAR O MOUSE 
    marker.addListener("mouseover", () => {
      if (infoAberta) infoAberta.close();
      info.open(map, marker);
      infoAberta = info;
    });

    marker.addListener("mouseout", () => {
      info.close();
    });

  });
}

function popularFaculdades() {
  const select = document.getElementById("faculdade");

  faculdades.forEach(f => {
    const option = document.createElement("option");
    option.value = f.nome;
    option.textContent = f.nome;
    select.appendChild(option);
  });

  select.addEventListener("change", () => {
    const f = faculdades.find(x => x.nome === select.value);
    map.setCenter({ lat: f.lat, lng: f.lng });
    map.setZoom(12);
  });
}

function popularCursos() {
  const select = document.getElementById("curso");

  cursos.forEach(c => {
    const option = document.createElement("option");
    option.value = c;
    option.textContent = c;
    select.appendChild(option);
  });
}

function configurarFiltro() {
  const botoes = document.querySelectorAll(".rating-filter button");

  botoes.forEach(btn => {
    btn.addEventListener("click", () => {
      filtroNota = parseInt(btn.dataset.rating);

      botoes.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      renderAvaliacoes(); // 🔥 ESSENCIAL
    });
  });
}

function renderAvaliacoes() {
  const container = document.querySelector(".reviews-container");
  container.innerHTML = "";

  const faculdadeSelecionada = document.getElementById("faculdade").value;
  const cursoSelecionado = document.getElementById("curso").value;

  const emojiMap = {
    1: "😭",
    2: "😐",
    3: "🙂",
    4: "😀",
    5: "😍"
  };

  const filtradas = avaliacoes.filter(a => {

    const matchNota = filtroNota ? a.nota === filtroNota : true;

    const matchFaculdade = faculdadeSelecionada
      ? a.faculdade === faculdadeSelecionada
      : true;

    const matchCurso = cursoSelecionado
      ? a.curso === cursoSelecionado
      : true;

    return matchNota && matchFaculdade && matchCurso;
  });

  if (filtradas.length === 0) {
    container.innerHTML = "<p>Nenhuma avaliação encontrada 😭</p>";
    return;
  }

  filtradas.forEach(a => {
    const div = document.createElement("div");
    div.className = "review";

    div.innerHTML = `
      <img src="https://i.pravatar.cc/40">
      <div>
        <strong>${a.nome}</strong><br>
        <span>${a.curso}</span><br>
        <p>${a.comentario}</p>
        <div class="emoji">${emojiMap[a.nota]}</div>
      </div>
    `;

    container.appendChild(div);
  });
}
