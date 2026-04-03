// 1. Definição das Perguntas
const perguntas = [
  {
    texto: "Qual área da sua vida está tirando mais a sua paz hoje?",
    opcoes: ["Meu Casamento / Relacionamento", "Maternidade e Filhos", "Ansiedade e Emoções", "Minha Vida espiritual"]
  },
  {
    texto: "Há quanto tempo você sente que precisa de ajuda profissional para lidar com isso?",
    opcoes: ["É algo recente (menos de 1 mês)", "Já faz alguns meses", "Há mais de 1 ano", "Sinto que estou no meu limite agora"]
  },
  {
    texto: "A 1ª sessão é um presente para nos conhecermos. Caso faça sentido continuar, você possui orçamento para investir no seu tratamento mensalmente?",
    opcoes: ["Sim, priorizo minha saúde emocional.", "Tenho interesse, mas o orçamento é apertado", "Não, busco apenas atendimento gratuito/social."]
  },
  {
    texto: "o Atendimento é 100% Online por vídeo. Você possui um local reservado e internet estável para realizar as sessões?",
    opcoes: ["Sim, tenho total privacidade.", "Consigo me organizar para ter privacidade.", "Não tenho privacidade em casa."]
  },
  {
    texto: "Se você gostar da metodologia da Bea Paes na sessão experimental, o que te impediria de iniciar o tratamento?",
    opcoes: ["Nada, eu decido sozinho(a).", "Precisaria conversar com meu esposo(a).", "Apenas a questão financeira.", "Não pretendo continuar, quero apenas a grátis."]
  }
];

// 2. Variáveis de Controle
let atual = 0;
let respostas = [];
let selecionado = "";
let dadosUsuario = { nome: "", email: "", telefone: "" };

// --- MÁSCARA DE TELEFONE ---
const inputTelefone = document.getElementById("telefone");
const erroMsg = document.getElementById("erro-telefone");

inputTelefone.addEventListener("input", (e) => {
    // 1. Limpa o estado de erro ao começar a digitar
    if (erroMsg) erroMsg.style.display = "none";
    e.target.style.borderColor = "#eee";

    // 2. Remove tudo que não é número
    let valor = e.target.value.replace(/\D/g, ""); 
    
    // 3. Limita a 11 dígitos (DDD + 9 + 8 dígitos)
    if (valor.length > 11) valor = valor.slice(0, 11); 

    // 4. Aplica a formatação dinâmica (48)99954-8935
    if (valor.length > 0) {
        valor = "(" + valor;
    }
    if (valor.length > 3) {
        valor = valor.slice(0, 3) + ")" + valor.slice(3);
    }
    if (valor.length > 9) {
        // Insere o hífen após o 5º dígito do número (que é a 9ª posição na string formatada)
        valor = valor.slice(0, 9) + "-" + valor.slice(9);
    }

    e.target.value = valor;
});

// Garante que o usuário não digite letras (bloqueio físico)
inputTelefone.addEventListener("keypress", (e) => {
    // Permite apenas números de 0-9
    if (!/[0-9]/.test(e.key)) {
        e.preventDefault();
    }
});

// Impede colar textos que contenham letras
inputTelefone.addEventListener("paste", (e) => {
    const pasteData = e.clipboardData.getData('text');
    if (/[^0-9]/.test(pasteData)) {
        setTimeout(() => {
            e.target.value = e.target.value.replace(/\D/g, "");
            // Dispara o evento de input manualmente para formatar o que foi colado
            e.target.dispatchEvent(new Event('input'));
        }, 0);
    }
});

// --- VALIDAÇÃO E INÍCIO DO QUIZ ---
function iniciarQuiz() {
    const nomeInput = document.getElementById("nome");
    const telefoneInput = document.getElementById("telefone");
    const erroNome = document.getElementById("erro-nome");
    const erroTelefone = document.getElementById("erro-telefone");
    
    const nome = nomeInput.value.trim();
    const telefoneRaw = telefoneInput.value;
    const apenasNumeros = telefoneRaw.replace(/\D/g, "");

    // Resetar estados de erro
    erroNome.style.display = "none";
    erroTelefone.style.display = "none";
    nomeInput.style.borderColor = "#eee";
    telefoneInput.style.borderColor = "#eee";

    let temErro = false;

    // Validação do Nome (Obrigatório)
    if (!nome) {
        erroNome.style.display = "block";
        nomeInput.style.borderColor = "#d93025";
        temErro = true;
    }

    // Validação do Telefone (Obrigatório e Completo)
    if (apenasNumeros.length < 11) {
        erroTelefone.style.display = "block";
        telefoneInput.style.borderColor = "#d93025";
        temErro = true;
    }

    if (temErro) return;

    // Salva os dados e avança
    dadosUsuario = { 
        nome: nome, 
        email: document.getElementById("email").value, 
        telefone: telefoneRaw 
    };

    document.getElementById("tela-dados").style.display = "none";
    document.getElementById("conteudo-quiz").style.display = "block";
    document.getElementById("barra").style.display = "flex";

    render();
}

// --- LIMPAR ERRO DO NOME AO DIGITAR ---
document.getElementById("nome").addEventListener("input", (e) => {
    document.getElementById("erro-nome").style.display = "none";
    e.target.style.borderColor = "#eee";
});

// --- MÁSCARA E LIMPAR ERRO DO TELEFONE ---
inputTelefone.addEventListener("input", (e) => {
    // Limpa erro
    document.getElementById("erro-telefone").style.display = "none";
    e.target.style.borderColor = "#eee";

    // Lógica da máscara (mantida)
    let valor = e.target.value.replace(/\D/g, "");
    if (valor.length > 11) valor = valor.slice(0, 11);
    if (valor.length > 0) valor = "(" + valor;
    if (valor.length > 3) valor = valor.slice(0, 3) + ")" + valor.slice(3);
    if (valor.length > 9) valor = valor.slice(0, 9) + "-" + valor.slice(9);
    e.target.value = valor;
});
// 4. Lógica do Quiz (MANTIDA)
function render() {
  document.getElementById("pergunta").innerText = perguntas[atual].texto;

  let opHTML = "";
  perguntas[atual].opcoes.forEach(op => {
    opHTML += `<div class="option" onclick="selecionar(this)">${op}</div>`;
  });
  document.getElementById("opcoes").innerHTML = opHTML;

  renderBarra();
}

function selecionar(el) {
  document.querySelectorAll(".option").forEach(o => o.classList.remove("selected"));
  el.classList.add("selected");
  selecionado = el.innerText;
}

function renderBarra() {
  let barra = "";
  for (let i = 0; i < perguntas.length; i++) {
    barra += `<div class="${i <= atual ? 'ativo' : ''}"></div>`;
  }
  document.getElementById("barra").innerHTML = barra;
}

function proximo() {
  if (!selecionado) {
    alert("Selecione uma opção");
    return;
  }

  respostas[atual] = selecionado;
  selecionado = "";

  if (atual < perguntas.length - 1) {
    atual++;
    render();
  } else {
    enviar();
    mostrarTelaFinal(); 
  }
}

function voltar() {
    // Se estiver na primeira pergunta do quiz, volta para a tela de dados pessoais
    if (atual === 0) {
        document.getElementById("conteudo-quiz").style.display = "none";
        document.getElementById("tela-dados").style.display = "block";
        
        // Opcional: esconder a barra de progresso ao voltar para os dados
        document.getElementById("barra").style.display = "none"; 
        return;
    }

    // Se estiver em qualquer outra pergunta, volta para a anterior normalmente
    if (atual > 0) {
        atual--;
        render();
    }
}

/**
 * 5. ENVIO: Agora inclui os dados do usuário + as respostas
 */
function enviar() {
  const params = new URLSearchParams();
  
  // Coluna A: Data
  params.append("data", new Date().toLocaleString("pt-BR"));
  
  // Colunas B, C, D: Dados do Usuário
  params.append("nome", dadosUsuario.nome);  
  params.append("telefone", dadosUsuario.telefone);
  params.append("email", dadosUsuario.email);
  
  // Colunas E em diante: Respostas do Quiz
  perguntas.forEach((_, index) => {
    params.append(`r${index + 1}`, respostas[index] || "");
  });

  fetch("https://script.google.com/macros/s/AKfycbzh932c5NlnBtYCeMoGBgh8tgjaMe61oP34ZnVTCIuV4wzKZ6OpAsj5_e3VL3e9E3f3gA/exec", {
    method: "POST",
    mode: "no-cors", 
    body: params 
  })
  .then(() => {
    console.log("Dados enviados com sucesso");
  })
  .catch((err) => {
    console.error("Erro ao enviar:", err);
  });
}

function mostrarTelaFinal() {
    // Esconde tudo do quiz
    document.getElementById("conteudo-quiz").style.display = 'none';
    document.querySelector('.topo').style.display = 'none';
    document.querySelector('.barra').style.display = 'none';

    // Mostra a tela final estilizada
    document.getElementById('tela-final').style.display = 'block';
}

function fechar() {
  window.location.href = "https://google.com";
}

// IMPORTANTE: Removi o render() daqui para que ele só comece após a tela de dados.