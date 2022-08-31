import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import SqlTransacoesRepositorio from "./infra/sql-transacoes-repositorio.cjs";
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = 4040;
const servidor = express();

function mostraReq(req) {
    console.log(`${req.method} ${req.url} ${JSON.stringify(req.body)}`)
}

servidor.use(express.json());

servidor.use(express.static(`${__dirname}/public`));

servidor.get('/transacoes', async (req, res) => {
    mostraReq(req)
    const repositorio = new SqlTransacoesRepositorio();
    const transacoes = await repositorio.listarTransacoes();
    console.log(transacoes)
    
    let saldo = 0;
    transacoes.transacoes.forEach((transacao) => {
        if (transacao.categoria == "Despesa") {
            saldo = saldo - transacao.valor;
        }
        if (transacao.categoria == "Receita") {
            saldo = saldo + transacao.valor;
        }

    })

    transacoes.saldo = saldo;
    res.send(transacoes);
})

servidor.post('/transacoes', async (req, res) => {
    mostraReq(req)
    const repositorio = new SqlTransacoesRepositorio();
    console.log("corpo " + JSON.stringify(req.body))
    const transacao = req.body
    await repositorio.criarTransacao(transacao)
    res.status(201).send(transacao)
})

servidor.listen(port, () => {

    console.log(`Server running at http://localhost:${port}/`)
});


