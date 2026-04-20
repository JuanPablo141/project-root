let nota = 0;

function avaliar(valor) {
  nota = valor;

  const emojis = document.querySelectorAll(".avaliacao span");
  emojis.forEach(e => e.style.transform = "scale(1)");
  emojis[valor - 1].style.transform = "scale(1.5)";
}

let comentarios = JSON.parse(localStorage.getItem("comentarios")) || [];

function enviar() {
  const curso = document.getElementById("curso").value;
  const bloco = document.getElementById("bloco").value;
  const texto = document.getElementById("comentario").value;

  if (!texto && nota === 0) {
    alert("Digite um comentário ou escolha uma avaliação!");
    return;
  }

  const novo = {
    curso,
    bloco,
    texto: texto || "Sem comentário",
    nota
  };

  comentarios.push(novo);

  localStorage.setItem("comentarios", JSON.stringify(comentarios));

  // ❌ renderizar(); REMOVIDO
  limpar();
}

function limpar() {
  document.getElementById("comentario").value = "";
  nota = 0;

  const emojis = document.querySelectorAll(".avaliacao span");
  emojis.forEach(e => e.style.transform = "scale(1)");
}

// ❌ renderizar(); REMOVIDO