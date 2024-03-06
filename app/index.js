const fs = require('fs');
const { createClient } = require('redis');

async function adicionarAoRedis() {
  const client = createClient();

  // Conectar ao servidor Redis
  await client.connect();

  client.on('error', err => console.log('Redis Client Error', err));

  try {
    // Ler o arquivo JSON
    const data = fs.readFileSync('pini.json', 'utf-8');
    const objects = JSON.parse(data);

    // Nome da lista no Redis
    const redisListName = 'pini';

    // Adicionar cada objeto ao Redis usando o método RPUSH
    for (const obj of objects) {
      const value = JSON.stringify(obj);

      // Adiciona o valor na lista no Redis
      await client.RPUSH(redisListName, value);
    }

    console.log('Objetos adicionados à lista no Redis com sucesso.');
  } catch (error) {
    console.error('Erro ao processar o arquivo JSON ou ao adicionar ao Redis:', error);
  } finally {
    // Fechar a conexão com o Redis
    await client.quit();
  }
}

async function listarDoRedis() {
  const client = createClient();

  // Conectar ao servidor Redis
  await client.connect();

  client.on('error', err => console.log('Redis Client Error', err));

  try {
    // Nome da lista no Redis
    const redisListName = 'pini';

    // Obter todos os valores da lista no Redis
    const values = await client.LRANGE(redisListName, 0, -1);

    // Listar os valores obtidos da lista
    for (const value of values) {
      console.log(`Valor da lista: ${value}`);
    }
  } catch (error) {
    console.error('Erro ao listar os valores no Redis:', error);
  } finally {
    // Fechar a conexão com o Redis
    await client.quit();
  }
}

async function editarPini() {
  const client = createClient();

  // Conectar ao servidor Redis
  await client.connect();

  client.on('error', err => console.log('Redis Client Error', err));

  try {
    const redisListName = 'pini';
    const idToEdit = 1; // Substitua pelo ID que você deseja editar

    // Obter todos os valores da lista
    const values = await client.LRANGE(redisListName, 0, -1);

    // Filtrar os valores para encontrar o ID específico
    const filteredValues = values.filter(value => {
      const parsedValue = JSON.parse(value);
      return parsedValue.ID === idToEdit;
    });

    // Remover todos os itens com base no ID
    for (const valueToDelete of filteredValues) {
      await client.LREM(redisListName, 0, valueToDelete);
    }

    console.log(`Itens com ID ${idToDelete} removidos da lista no Redis.`);
  } catch (error) {
    console.error('Erro ao deletar itens no Redis:', error);
  } finally {
    // Fechar a conexão com o Redis
    await client.quit();
  }
}

async function deletarChaveDoRedis() {
  const client = createClient();

  // Conectar ao servidor Redis
  await client.connect();

  client.on('error', err => console.log('Redis Client Error', err));

  try {
    const redisListName = 'pini';
    const idToDelete = 9; // Substitua pelo ID que você deseja excluir

    // Obter todos os valores da lista
    const values = await client.LRANGE(redisListName, 0, -1);

    // Filtrar os valores para encontrar o ID específico
    const filteredValues = values.filter(value => {
      const parsedValue = JSON.parse(value);
      return parsedValue.ID === idToDelete;
    });

    // Remover todos os itens com base no ID
    for (const valueToDelete of filteredValues) {
      await client.LREM(redisListName, 0, valueToDelete);
    }

    console.log(`Itens com ID ${idToDelete} removidos da lista no Redis.`);
  } catch (error) {
    console.error('Erro ao deletar itens no Redis:', error);
  } finally {
    // Fechar a conexão com o Redis
    await client.quit();
  }
}


// Chamar as funções assíncronas
// adicionarAoRedis();
listarDoRedis();
editarPini();
// deletarChaveDoRedis();

