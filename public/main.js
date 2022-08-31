

let saldoTotal = document.getElementById("saldo");
const addContainer = document.getElementById("add-container");
const botoes = Array.from(document.querySelector(".botoes").children);

let transacoes = [];

function trataStringParaNumero(valor) {
    return valor = parseFloat(valor.replace(",", "."));
};

function formataValorUsuario(valor) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 }).format(valor);
};

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

    if (typeof (inputValor.value) === String)
        inputValor.value = trataStringParaNumero(inputValor.value);

    if (botaoFechaForm.addEventListener("click", () => {
        limpaInput(inputDescricao, inputValor)
        toggleShowContainer(addContainer);
    }))
        //return render();

        botaoConfirmacaoContainer.addEventListener("click", async () => {
            const novaTransacao = {
                descricao: inputDescricao.value,
                categoria: tipoInfo,
                valor: inputValor.value
            };

            transacoes.push(novaTransacao);
            //toggleShowContainer(addContainer);
            limpaInput(inputDescricao, inputValor);
            await postDataTransacoes(transacoes.length - 1);
            console.log(novaTransacao)
            //console.log(`${tipoInfo} salva!`);

        });

    console.log(transacoes.length - 1)
    render();
}

function addDadosTabela(transacoes) {
    let conteudoTabela = document.querySelector('tbody');

    let tabela = "";

    //transacoes.reverse().forEach(transacao => {
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

function toggleShowContainer(addContainer) {
    //addContainer.classList.add("visible");  
    addContainer.classList.toggle("visible")
    return console.log(addContainer.classList.value)
}

function desabilitaBotao(botao) {
    addContainer.classList.contains("visible") ? botao.disabled = false : botao.disabled = true;

    //return console.log(botao.disabled.value)

}

/*function atualizaValorSaldo(saldo, categoria, valor) {
    if (categoria == "Despesa") {
        saldo = saldo - valor;
    }
    if (categoria == "Receita") {
        saldo = saldo + valor;
    }

    return saldo;
}*/
let tipoInfo = "";
let botaoClicado;
let outroBotao;

function getBtnClicado(botoes) {

    botoes.forEach(btn => {
        btn.addEventListener("click", showForm);
    })
};
getBtnClicado(botoes);

function showForm(e) {

    let classBtnClicado = e.target.getAttribute("class");

    if (classBtnClicado === 'despesa') {
        tipoInfo = "Despesa";
        botaoClicado = e.target;
        outroBotao = botaoClicado.nextElementSibling;
        toggleShowContainer(addContainer);
    }
    if (classBtnClicado === 'receita') {
        tipoInfo = "Receita";
        botaoClicado = e.target;
        outroBotao = botaoClicado.previousElementSibling;
        toggleShowContainer(addContainer);
    };

    //toggleShowContainer(addContainer);
    desabilitaBotao(outroBotao);
    addInfo(addContainer);
};

function setSaldo(saldoFinancas) {
    if (saldoFinancas !== saldoTotal)
        saldoTotal.innerText = `Saldo atual ${formataValorUsuario(saldoFinancas)}`;
};

async function getDataTransacoes() {
    const url = '/transacoes';
    const resposta = await fetch(url);
    const financas = await resposta.json();
    console.log(financas)
    setSaldo(financas.saldo)
    formataValorUsuario(financas.transacoes.valor);
    addDadosTabela(financas.transacoes);

    //atualizaTabela(financas)

    //return financas;
}

/* function atualizaTabela(financas) {
    setSaldo(financas.saldo)
    formataValorUsuario(financas.transacoes.valor);
    addDadosTabela(financas.transacoes);
}*/


async function postDataTransacoes(transacao) {

    const requisicao = {
        method: 'POST',
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(transacao)
    };
    await fetch('/transacoes', requisicao);
}

function render() {
    window.addEventListener("load", getDataTransacoes);
}

render();

