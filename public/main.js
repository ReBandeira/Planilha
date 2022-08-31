

let saldoTotal = document.getElementById("saldo");
const addContainer = document.getElementById("add-container");
const botoes = Array.from(document.querySelector(".botoes").children);
const closeBtn = document.getElementById("close-btn");

let transacoes = [];

function trataStringParaNumero(valor) {
    return valor = parseFloat(valor.replace(",", "."));
};

function formataValorUsuario(valor) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 }).format(valor);
};

function addDadosTabela(transacoes) {
    let conteudoTabela = document.querySelector('tbody');

    let tabela = "";

    transacoes.forEach(transacao => {
        let colunaDescricao = `<td class="coluna-descricao">${transacao.descricao}</td>`;
        let colunaCategoria = `<td class="coluna-categoria">${transacao.categoria}</td>`;
        let colunaValor = `<td class="coluna-valor">${formataValorUsuario(transacao.valor)}</td>`;
        let linhaTabela = `<tr>${colunaDescricao}${colunaCategoria}${colunaValor}</tr>`;
        tabela += linhaTabela;
    });

    conteudoTabela.innerHTML = tabela;
}

function limpaInput(descricao, valor) {
    descricao.innerText = "";
    valor.innerText = "";
}

/*function cancelForm (botao) {
    botao.addEventListener("click", toggleShowContainer)

    return botao.currentTarget ? true : false;
}*/

function toggleShowContainer() {
    addContainer.classList.toggle("visible")
    return console.log(addContainer.classList.value)
}

function desabilitaBotao(botao) {
    addContainer.classList.contains("visible") ? botao.disabled = false : botao.disabled = true;
}

function getBtnClicado(botoes) {

    botoes.forEach(btn => {
        btn.addEventListener("click", showForm);
    })
};
getBtnClicado(botoes);

    let tipoInfo = "";
    let botaoClicado;
    let outroBotao;

function showForm(e) {
    
    let classBtnClicado = e.target.getAttribute("class");

    if (classBtnClicado === 'despesa') {
        tipoInfo = "Despesa";
        botaoClicado = e.target;
        outroBotao = botaoClicado.nextElementSibling;
        
    }
    if (classBtnClicado === 'receita') {
        tipoInfo = "Receita";
        botaoClicado = e.target;
        outroBotao = botaoClicado.previousElementSibling;
    };

    toggleShowContainer();
    desabilitaBotao(outroBotao);
    addInfo(addContainer);
};

function setSaldo(saldoFinancas) {
    if (saldoFinancas !== saldoTotal)
        saldoTotal.innerText = `Saldo atual: ${formataValorUsuario(saldoFinancas)}`;
};

function atualizaTabela(saldo, valor, transacoes) {
    setSaldo(saldo);    
    addDadosTabela(transacoes);
    formataValorUsuario(valor);
}

async function getDataTransacoes() {
    const resposta = await fetch('/transacoes');
    const financas = await resposta.json();
    console.log(financas)
    atualizaTabela(financas.saldo, financas.transacoes.valor, financas.transacoes)
}

async function postDataTransacoes(descricao, categoria, valor) {

    const transacao = { descricao, categoria, valor: trataStringParaNumero(valor)};

    const requisicao = {
        method: 'POST',
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(transacao)
    };
    await fetch('/transacoes', requisicao);
}

async function addInfo() {

    let tituloContainer = document.getElementById("titulo-container");
    const labelDescricao = document.getElementById("label-descricao");
    const labelValor = document.getElementById("label-valor");
    const inputDescricao = document.getElementById("descricao");
    let inputValor = document.getElementById("valor");
    const botaoConfirmacaoContainer = document.getElementById("botao-confirmacao");
    const botaoFechaForm = document.querySelector(".fa-circle-xmark");

    tituloContainer.innerText = `Adicione sua ${tipoInfo} aqui!`;
    labelDescricao.innerText = `Descreva sua ${tipoInfo}:`;
    labelValor.innerText = `Agora insira o valor:`;
    inputValor.setAttribute("placeholder", "R$  ");
    botaoConfirmacaoContainer.innerText = `Salvar ${tipoInfo}!`;

    if (closeBtn.addEventListener("click", () => {
        limpaInput(inputDescricao.value, inputValor.value)
        toggleShowContainer();
        return;
    }));

   /* if (typeof (inputValor.value) === String) {
        inputValor.value = trataStringParaNumero(inputValor.value);        
    }
    */
    
    let novaTransacao = [
        inputDescricao.value,
        tipoInfo,
        inputValor.value
    ]

    botaoConfirmacaoContainer.addEventListener("click", async () => {
        
        //transacoes.push(novaTransacao);                      
        await postDataTransacoes(inputDescricao.value,
            tipoInfo,
            inputValor.value);
        limpaInput(inputDescricao.value, inputValor.value);
        toggleShowContainer();
        console.log(novaTransacao)
        console.log(`${tipoInfo} salva!`);
        await getDataTransacoes()
    });   
}

async function render() {
    window.addEventListener("load", getDataTransacoes);
}

render();

