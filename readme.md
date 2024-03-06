

### Dias 7 e 8 de março
- Implementar um CRUD em javascript/nodejs utilizando redis. (funções: editar, atualizar, remover e listar)
- Ao iniciar, o script deverá carregar um arquivo .json e armazenar os objetos em uma lista.
- Salvar os resultados em uma pasta e escrever um pequeno relatório explicando o que foi aprendido e como executar o código.

## Instruções para Uso

Para iniciar um projeto Node.js com JavaScript na WSL 2 (Windows Subsystem for Linux) usando Redis e seguindo a estrutura de pastas com um arquivo index.js.
Consulte o código-fonte  no repositório:\
**https://github.com/ruthmira-1risjc/crud.git**

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
### Listar
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

### Editar 
### Atualizar

### Remover
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

## Conhecimentos Adquiridos