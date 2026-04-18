const formLogin = document.getElementById("formLogin");
const login = document.getElementById("login");
const senha = document.getElementById("senha");
const btnLogin = document.getElementById("btnLogin");

const erroLogin = document.getElementById("erro-login");
const erroSenha = document.getElementById("erro-senha");

const toggleSenha = document.getElementById("toggleSenha");

const btnRecuperarAcesso = document.getElementById("btnRecuperarAcesso");
const btnRedefinirSenha = document.getElementById("btnRedefinirSenha");

/*
  AJUSTE AQUI CONFORME O BACK-END DE VOCÊS
*/
const API_URL = "http://localhost:3000/login";


function montarPayload(loginValor, senhaValor) {
  return {
    login: loginValor,
    senha: senhaValor
  };
}

/*
  Se o backend devolve token, usuário, mensagem etc,
  você pode adaptar aqui depois.
*/
function tratarSucesso(dados) {
  console.log("Login realizado com sucesso:", dados);

  // Exemplo: salvar token se vier do backend
  if (dados?.token) {
    localStorage.setItem("token", dados.token);
  }

  // Troque a rota abaixo para a página correta do seu projeto
  window.location.href = "tela-inicial.html";
}

function tratarErroResposta(dados) {
  const mensagem =
    dados?.message ||
    dados?.mensagem ||
    "Login ou senha inválidos";

  erroSenha.textContent = mensagem;
  senha.classList.add("input-erro");
  senha.classList.remove("input-sucesso");
}

function mostrarErro(campo, elementoErro, mensagem) {
  campo.classList.add("input-erro");
  campo.classList.remove("input-sucesso");
  elementoErro.textContent = mensagem;
}

function limparErro(campo, elementoErro) {
  campo.classList.remove("input-erro");
  elementoErro.textContent = "";
}

function marcarSucesso(campo, elementoErro) {
  campo.classList.remove("input-erro");
  campo.classList.add("input-sucesso");
  elementoErro.textContent = "";
}

function validarLogin() {
  const valor = login.value.trim();

  if (valor === "") {
    mostrarErro(login, erroLogin, "Campo obrigatório");
    return false;
  }

  if (valor.length < 4) {
    mostrarErro(login, erroLogin, "Digite uma matrícula válida");
    return false;
  }

  marcarSucesso(login, erroLogin);
  return true;
}

function validarSenha() {
  const valor = senha.value.trim();

  if (valor === "") {
    mostrarErro(senha, erroSenha, "Campo obrigatório");
    return false;
  }

  if (valor.length < 6) {
    mostrarErro(senha, erroSenha, "A senha deve ter pelo menos 6 caracteres");
    return false;
  }

  marcarSucesso(senha, erroSenha);
  return true;
}

function atualizarBotao() {
  const loginValido = login.value.trim().length >= 4;
  const senhaValida = senha.value.trim().length >= 6;

  btnLogin.disabled = !(loginValido && senhaValida);
}

login.addEventListener("input", () => {
  if (login.value.trim() === "") {
    limparErro(login, erroLogin);
    login.classList.remove("input-sucesso");
  } else {
    validarLogin();
  }

  atualizarBotao();
});

senha.addEventListener("input", () => {
  if (senha.value.trim() === "") {
    limparErro(senha, erroSenha);
    senha.classList.remove("input-sucesso");
  } else {
    validarSenha();
  }

  atualizarBotao();
});

toggleSenha.addEventListener("click", () => {
  if (senha.type === "password") {
    senha.type = "text";
    toggleSenha.textContent = "Ocultar";
  } else {
    senha.type = "password";
    toggleSenha.textContent = "Mostrar";
  }
});

/*
  Links clicáveis, sem função real aqui no front.
  Estão prontos para receber rota ou modal depois.
*/
btnRecuperarAcesso.addEventListener("click", () => {
  console.log("Recuperar acesso clicado");
});

btnRedefinirSenha.addEventListener("click", () => {
  console.log("Redefinir senha clicado");
});

formLogin.addEventListener("submit", async (e) => {
  e.preventDefault();

  const loginOk = validarLogin();
  const senhaOk = validarSenha();

  atualizarBotao();

  if (!loginOk || !senhaOk) {
    return;
  }

  const loginValor = login.value.trim();
  const senhaValor = senha.value.trim();

  btnLogin.textContent = "Entrando...";
  btnLogin.disabled = true;

  limparErro(login, erroLogin);
  limparErro(senha, erroSenha);

  try {
    const resposta = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(montarPayload(loginValor, senhaValor))
    });

    let dados = {};
    const contentType = resposta.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      dados = await resposta.json();
    }

    if (resposta.ok) {
      tratarSucesso(dados);
      return;
    }

    tratarErroResposta(dados);
  } catch (erro) {
    console.error("Erro ao conectar com o servidor:", erro);
    erroSenha.textContent = "Erro ao conectar com o servidor";
    senha.classList.add("input-erro");
    senha.classList.remove("input-sucesso");
  } finally {
    btnLogin.textContent = "Entrar";
    atualizarBotao();
  }
});