// getElementById: botões, campo de nome e placar
const nome = document.getElementById('nome');
const btnIniciar = document.getElementById('btnIniciar');
const btnProximo = document.getElementById('btnProximo');
const inicio = document.getElementById('inicio');
const quiz = document.getElementById('quiz');
const placar = document.getElementById('placar');

// getElementsByTagName: título e blocos de perguntas
const titulo = document.getElementsByTagName('h1')[0];
const perguntas = document.getElementsByTagName('section');
const enunciados = document.getElementsByTagName('p');

let atual = 0;
let acertos = 0;
let respondida = false;

// input: valida o nome em tempo real e mostra no título
nome.addEventListener('input', () => {
  const n = nome.value.trim();
  btnIniciar.disabled = n === '';
  titulo.textContent = n ? `Quiz de Informática - ${n}` : 'Quiz de Informática';
});

// click: iniciar quiz (altera o título)
btnIniciar.addEventListener('click', () => {
  titulo.textContent = `Boa sorte, ${nome.value.trim()}!`;
  inicio.hidden = true;
  quiz.hidden = false;
  mostrar(0);
});

// mouseover/mouseout: pergunta fica vermelha
for (const p of enunciados) {
  p.addEventListener('mouseover', () => p.classList.add('destaque'));
  p.addEventListener('mouseout', () => p.classList.remove('destaque'));
}

// querySelectorAll: todas as alternativas de forma unificada
document.querySelectorAll('.alternativa').forEach(li => {
  li.addEventListener('mouseover', () => li.classList.add('hover'));
  li.addEventListener('mouseout', () => li.classList.remove('hover'));
  li.addEventListener('click', () => responder(li));
});

function mostrar(i) {
  for (let j = 0; j < perguntas.length; j++) perguntas[j].hidden = j !== i;
  respondida = false;
  btnProximo.disabled = true;
  btnProximo.textContent = i === perguntas.length - 1 ? 'Ver resultado' : 'Próxima';
}

function responder(li) {
  if (respondida) return;
  respondida = true;

  // getElementsByClassName: alternativas da pergunta atual
  const opcoes = perguntas[atual].getElementsByClassName('alternativa');
  for (const o of opcoes) {
    o.classList.add('bloqueada');
    if (o.hasAttribute('data-correta')) o.classList.add('certa');
  }

  if (li.hasAttribute('data-correta')) acertos++;
  else li.classList.add('errada');

  btnProximo.disabled = false;
}

function proxima() {
  if (!respondida) return;
  atual++;
  if (atual < perguntas.length) {
    mostrar(atual);
  } else {
    quiz.hidden = true;
    placar.hidden = false;
    titulo.textContent = 'Fim do Quiz!';
    placar.textContent = `${nome.value.trim()}, você acertou ${acertos} de ${perguntas.length} perguntas.`;
  }
}

// click: avançar para a próxima questão
btnProximo.addEventListener('click', proxima);

// keydown: mostra a tecla no console, 1-4 respondem, Enter avança
document.addEventListener('keydown', e => {
  console.log('Tecla pressionada:', e.key);

  // Enter num botão focado já dispara o click nativo
  if (e.key === 'Enter' && e.target.tagName === 'BUTTON') return;

  if (!inicio.hidden) {
    if (e.key === 'Enter' && !btnIniciar.disabled) btnIniciar.click();
    return;
  }
  if (quiz.hidden) return;

  if (e.key === 'Enter') proxima();
  else if (e.key >= '1' && e.key <= '4') {
    responder(perguntas[atual].getElementsByClassName('alternativa')[e.key - 1]);
  }
});
