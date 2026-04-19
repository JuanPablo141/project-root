const faculdades = [
  { nome: "Bloco A", lat: -8.047, lng: -34.877 },
  { nome: "Bloco B", lat: -8.0475, lng: -34.876 },
  { nome: "Bloco C", lat: -8.048, lng: -34.875 },
  { nome: "Bloco D", lat: -8.0485, lng: -34.874 },
  { nome: "Bloco E", lat: -8.049, lng: -34.873 },
  { nome: "Bloco F", lat: -8.0495, lng: -34.872 },
  { nome: "Bloco G", lat: -8.050, lng: -34.871 }
];


function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 7,
    center: { lat: -8.3, lng: -36.0 },
  });

  criarMarcadores();
  popularFaculdades();
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
