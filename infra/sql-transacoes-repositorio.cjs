const { Pool } = require('pg')

const pool = new Pool()

class SqlTransacoesRepositorio {

    async listarTransacoes() {
        const resultado = await pool.query('SELECT * FROM transacoes')
        console.log(resultado.rows)
        return {
            transacoes: resultado.rows
        }
    }

    async criarTransacoes(transacao) {
        const consulta = `INSERT INT transacoes(descricao, categoria, valor)
             VALUES ($1, $2, $3) RETURNING * `;
        const valores = [transacao.descricao, transacao.categoria, transacao.valor];
        await Pool.query(consulta, valores);
    }


}

module.exports = SqlTransacoesRepositorio