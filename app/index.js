const fs = require('fs');
const path = require('path');
const { createClient } = require('redis');

// Criando carga inicial de um arquivo .json para objetos em uma lista
async function adicionarAoRedis() {
  const client = createClient();

  await client.connect();

  client.on('error', err => console.log('Redis Client Error', err));

  try {
    const data = fs.readFileSync('pini.json', 'utf-8');
    const objects = JSON.parse(data);
    const redisListName = 'pini';

    for (const obj of objects) {
      const value = JSON.stringify(obj);
      await client.RPUSH(redisListName, value);
    }
  } catch (error) {
    console.error('Erro ao processar o arquivo JSON ou ao adicionar ao Redis:', error);
  } finally {
    await client.quit();
  }
}

// Funçao para listar os PINI
async function listarDoRedis() {
  const client = createClient();

  await client.connect();

  client.on('error', err => console.log('Redis Client Error', err));

  try {
    const redisListName = 'pini';
    const values = await client.LRANGE(redisListName, 0, -1);

    for (const value of values) {
      console.log(`Valor da lista: ${value}`);
    }
  } catch (error) {
    console.error('Erro ao listar os valores no Redis:', error);
  } finally {
    await client.quit();
  }
}

// Função para Adicionar um novo PINI
async function adicionarItem(item) {
  const client = createClient();

  await client.connect();

  client.on('error', err => console.log('Redis Client Error', err));

  try {
    const redisListName = 'pini';
    const value = JSON.stringify(item);
    await client.RPUSH(redisListName, value);
  } catch (error) {
    console.error('Erro ao adicionar novo item ao Redis:', error);
  } finally {
    await client.quit();
  }
}

// Função para Atualizar os valores do PINI
async function atualizarItem(updatedItem) {
  const client = createClient();

  await client.connect();

  client.on('error', err => console.log('Redis Client Error', err));

  try {
    const redisListName = 'pini';
    const values = await client.LRANGE(redisListName, 0, -1);

    for (const value of values) {
      const parsedValue = JSON.parse(value);
      if (parsedValue.ID === updatedItem.ID) {
        await client.LREM(redisListName, 0, value);
        const updatedValue = JSON.stringify(updatedItem);
        await client.RPUSH(redisListName, updatedValue);
        return;
      }
    }

    console.log(`Item com ID ${updatedItem.ID} não encontrado no Redis.`);
  } catch (error) {
    console.error('Erro ao atualizar item no Redis:', error);
  } finally {
    await client.quit();
  }
}

// Função para Deletar um PINI
async function deletarChaveDoRedis() {
  const client = createClient();

  await client.connect();

  client.on('error', err => console.log('Redis Client Error', err));

  try {
    const redisListName = 'pini';
    const idToDelete = 10;
    const values = await client.LRANGE(redisListName, 0, -1);
    const filteredValues = values.filter(value => {
      const parsedValue = JSON.parse(value);
      return parsedValue.ID === idToDelete;
    });

    for (const valueToDelete of filteredValues) {
      await client.LREM(redisListName, 0, valueToDelete);
    }
  } catch (error) {
    console.error('Erro ao deletar itens no Redis:', error);
  } finally {
    await client.quit();
  }
}

// Função para salvar em Nova pasta
async function salvarListaEmNovaPasta(redisListName, nomeArquivo, pastaDestino) {
  const client = createClient();

  return new Promise(async (resolve, reject) => {
    await client.connect();

    client.on('error', err => {
      console.log('Redis Client Error', err);
      reject(err);
    });

    try {
      const values = await client.LRANGE(redisListName, 0, -1);

      if (!fs.existsSync(pastaDestino)) {
        fs.mkdirSync(pastaDestino, { recursive: true });
      }

      const caminhoCompleto = path.join(pastaDestino, `${nomeArquivo}.json`);
      const jsonLista = JSON.stringify(values.map(value => JSON.parse(value)), null, 2);
      fs.writeFileSync(caminhoCompleto, jsonLista);
      resolve();
    } catch (erro) {
      console.error('Erro ao salvar o arquivo JSON:', erro);
      reject(erro);
    } finally {
      await client.quit();
    }
  });
}

// Chamando as Funções
async function adicionarAoRedisEsalvar() {
  await adicionarAoRedis();
  await listarDoRedis();
  await adicionarItem({"ID":10,"Nome":"Residencial R3","Descricao":null,"DescricaoCombo":"R.3 Até 75,00 m²","Valor":1485.97});
  await atualizarItem({ "ID":1,"Nome":"Item Atualizado","Descricao":"Atualizado","DescricaoCombo":"R.1 Até 85,00 m²","Valor":3000.00 });
  await deletarChaveDoRedis();
  await salvarListaEmNovaPasta('pini', 'ListaPiniRedis', './resultado');
  await salvarListaEmNovaPasta('pini', 'ListaPini', './resultado');
  await salvarListaEmNovaPasta('pini', 'ListaPiniAdicionado', './resultado');
  await salvarListaEmNovaPasta('pini', 'ListaPiniAtualizado', './resultado');
  await salvarListaEmNovaPasta('pini', 'ListaPiniDeletado', './resultado');
}

adicionarAoRedisEsalvar();