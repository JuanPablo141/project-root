function toggleSenha() {
  const senha = document.getElementById("senha");
  senha.type = senha.type === "password" ? "text" : "password";
}

function cadastrar() {
  const nome = document.getElementById("nome").value;
  const matricula = document.getElementById("matricula").value;
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  const confirmar = document.getElementById("confirmarSenha").value;
  const msg = document.getElementById("mensagem");

  if (!nome || !matricula || !email || !senha || !confirmar) {
    msg.innerText = "Preencha todos os campos!";
    msg.style.color = "red";
    return;
  }

  if (senha !== confirmar) {
    msg.innerText = "As senhas não coincidem!";
    msg.style.color = "red";
    return;
  }

  msg.innerText = "Cadastro realizado com sucesso!";
  msg.style.color = "green";
}