### Dias 7 e 8 de março 
- Implementar um CRUD em javascript/nodejs utilizando redis. (funções: editar, atualizar, remover e listar)
- Ao iniciar, o script deverá carregar um arquivo .json e armazenar os objetos em uma lista.
- Salvar os resultados em uma pasta e escrever um pequeno relatório explicando o que foi aprendido e como executar o código.

![Static Badge](https://img.shields.io/badge/build-Finalizado-brightgreen?style=for-the-badge&label=STATUS&labelColor=black)

## Instruções para Uso

Para iniciar um projeto Node.js com JavaScript na WSL 2 (Windows Subsystem for Linux) usando Redis e seguindo a estrutura de pastas com um arquivo index.js.
Consulte o código-fonte  no repositório:\
**https://github.com/ruthmira-1risjc/crud-redis.git**

## Requisitos

No terminal do WSL instale os programas:

``` bash
#Instalando o Node.js
sudo snap install node --classic --channel=edge

# Verificando a versão
node -v
#Instalar o NVM:
# Abra o terminal e execute o seguinte comando para baixar o script de instalação do NVM:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh
# Feche e reabra o terminal ou execute o seguinte comando para carregar as configurações do NVM:
source ~/.bashrc
# ou
source ~/.zshrc
# Instalar ou Atualizar o Node.js:
nvm install node
# Esse comando instalará a versão mais recente do Node.js. Se você já tiver o NVM instalado, ele também atualizará para a versão mais recente.
# Verificando a versão
node -v

#Instalando o server do redis
sudo apt update
sudo apt install redis-server
```

## Preparando ambiente

``` bash
# Cria a pasta
mkdir crud-redis

# Movimenta o terminal para a pasta
cd crud-redis
mkdir app
cd app

# Criar o package.json -> dar enter, enter, ...
npm init

# Instalação de módulos, incluindo o módulo fs
npm install sequelize
npm install tedious
npm install redis
npm install fs

# Criar um arquivo index.js
echo "" > index.js
echo "" > pini.json

# Abrir o VSCode
code .
```

## Como executar o código

Use o comando no terminal 
 ``` bash
 node index.js 
 ```

## Conectando ao server do Redis nosso BD

``` bash
const fs = require('fs');
const { createClient } = require('redis');

client.on('error', err => console.log('Redis Client Error', err));
await client.connect();
```
## Criando carga inicial de um arquivo .json para objetos em uma lista

Essa função é responsável por ler as informaçoes do Json e criar um objeto para cada pini em uma lista manipulável.
```JavaScript
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
      await client.RPUSH(redisListName,);
    }

    console.log('Objetos adicionados à lista no Redis com sucesso.');
  } catch (error) {
    console.error('Erro ao processar o arquivo JSON ou ao adicionar ao Redis:', error);
  } finally {
    // Fechar a conexão com o Redis
    await client.quit();
  }
}
adicionarAoRedis();
```

## CRUD
### Read - LRANGE - Listar
``` JavaScript
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
listarDoRedis();
```

### Editar - LRANGE/LREM/RPUSH - Upgrade 
```JavaScript
async function atualizarItem(updatedItem) {
  const client = createClient();

  // Conectar ao servidor Redis
  await client.connect();

  client.on('error', err => console.log('Redis Client Error', err));

  try {
    const redisListName = 'pini';

    // Obter todos os valores da lista
    const values = await client.LRANGE(redisListName, 0, -1);

    // Procurar o item a ser atualizado pelo ID
    for (const value of values) {
      const parsedValue = JSON.parse(value);
      if (parsedValue.ID === updatedItem.ID) {
        // Remover o item antigo
        await client.LREM(redisListName, 0, value);
        // Adicionar o item atualizado
        const updatedValue = JSON.stringify(updatedItem);
        await client.RPUSH(redisListName, updatedValue);
        console.log(`Item com ID ${updatedItem.ID} atualizado no Redis.`);
        return;
      }
    }

    console.log(`Item com ID ${updatedItem.ID} não encontrado no Redis.`);
  } catch (error) {
    console.error('Erro ao atualizar item no Redis:', error);
  } finally {
    // Fechar a conexão com o Redis
    await client.quit();
  }
}

atualizarItem({ "ID":1,"Nome":"Item Atualizado","Descricao":"Atualizado","DescricaoCombo":"R.1 Até 85,00 m²","Valor":3000.00 });

```
### Adicionar - RPUSH - Creat
```JavaScript
async function adicionarItem(item) {
  const client = createClient();

  // Conectar ao servidor Redis
  await client.connect();

  client.on('error', err => console.log('Redis Client Error', err));

  try {
    // Nome da lista no Redis
    const redisListName = 'pini';

    // Adicionar o novo item ao Redis usando o método RPUSH
    const value = JSON.stringify(item);
    await client.RPUSH(redisListName, value);

    console.log('Novo item adicionado à lista no Redis com sucesso.');
  } catch (error) {
    console.error('Erro ao adicionar novo item ao Redis:', error);
  } finally {
    // Fechar a conexão com o Redis
    await client.quit();
  }
}
adicionarItem({"ID":10,"Nome":"Residencial R3","Descricao":null,"DescricaoCombo":"R.3 Até 75,00 m²","Valor":1485.97});
```

### Remover - LREM - Delete
```JavaScript
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
deletarChaveDoRedis();
```

## Salvando os resultados
``` JavaScript
// Função para salvar a lista em um novo arquivo JSON em uma pasta específica
async function salvarListaEmNovaPasta(redisListName, nomeArquivo, pastaDestino) {
  const client = createClient();

  return new Promise(async (resolve, reject) => {
    // Conectar ao servidor Redis
    await client.connect();

    client.on('error', err => {
      console.log('Redis Client Error', err);
      reject(err);
    });

    try {
      // Obter valores da lista no Redis
      const values = await client.LRANGE(redisListName, 0, -1);

      // Cria a pasta de destino se não existir
      if (!fs.existsSync(pastaDestino)) {
        fs.mkdirSync(pastaDestino, { recursive: true });
      }

      const caminhoCompleto = path.join(pastaDestino, `${nomeArquivo}.json`);
      const jsonLista = JSON.stringify(values.map(value => JSON.parse(value)), null, 2);
      fs.writeFileSync(caminhoCompleto, jsonLista);
      console.log(`Lista salva em ${caminhoCompleto}`);
      resolve();
    } catch (erro) {
      console.error('Erro ao salvar o arquivo JSON:', erro);
      reject(erro);
    } finally {
      // Fechar a conexão com o Redis
      await client.quit();
    }
  });
}
// Função para executar todas as operações desejadas
async function adicionarAoRedisEsalvar() {
  await salvarListaEmNovaPasta('pini', 'ListaPiniRedis', './resultado');
  await salvarListaEmNovaPasta('pini', 'ListaPini', './resultado');
  await salvarListaEmNovaPasta('pini', 'ListaPiniAdicionado', './resultado');
  await salvarListaEmNovaPasta('pini', 'ListaPiniAtualizado', './resultado');
  await salvarListaEmNovaPasta('pini', 'ListaPiniDeletado', './resultado');
}

// Chamar a função que realiza todas as operações
adicionarAoRedisEsalvar();
```

## Conhecimentos Adquiridos

O código em questão tem como objetivo principal realizar operações de manipulação de dados utilizando o banco de dados em memória Redis. Ele é estruturado em funções que abrangem desde a leitura e escrita de dados em arquivos JSON até operações avançadas no Redis, como adicionar, listar, atualizar e excluir elementos de uma lista.

1. **RedisDataManager:**
   - Este é o módulo central do código, encapsulando a lógica de manipulação de dados no Redis. Ele utiliza a biblioteca `redis` para criar um cliente Redis, conectando-se ao servidor.
   - As funções `connect` e `disconnect` cuidam da abertura e fechamento da conexão com o Redis, garantindo uma prática segura e eficiente.
   - Funções como `adicionarAoRedis`, `listarDoRedis`, `adicionarItem`, `atualizarItem`, `deletarChaveDoRedis` e `salvarListaEmNovaPasta` abstraem operações comuns no Redis, fornecendo métodos claros e reutilizáveis para adicionar, listar, atualizar, deletar e salvar dados.

2. **Operações com o Arquivo JSON:**
   - A função `adicionarAoRedis` inicia o processo lendo um arquivo JSON (`pini.json`) e transformando seus dados em objetos JavaScript.
   - Em seguida, os objetos são armazenados no Redis como strings JSON utilizando a função `adicionarAoRedis` do `RedisDataManager`.

3. **Operações Básicas no Redis:**
   - Funções como `listarDoRedis`, `adicionarItem`, `atualizarItem` e `deletarChaveDoRedis` realizam operações básicas no Redis, como listar todos os elementos, adicionar novos elementos, atualizar elementos existentes e excluir elementos com base em condições específicas.

4. **Persistência de Dados:**
   - A função `salvarListaEmNovaPasta` persiste os dados presentes no Redis em um arquivo JSON, seguindo as melhores práticas ao criar uma pasta de destino se não existir e fornecendo uma estrutura legível e formatada para o arquivo.


**Conclusão:**
O `RedisDataManager` é uma classe ou módulo que facilita a interação com o Redis, ele oferece métodos para adicionar, recuperar e excluir dados no Redis. O código cria uma instância do `RedisDataManager`, ele define funções para adicionar e recuperar dados no Redis.
Quando manipulamos dados em memória fica mais rápido do que acessar um banco de dados em disco.\
Aqui optamos por manipular dados em memória antes de persisti-los permanentemente no Redis.