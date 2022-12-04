# mutex-server

O servidor criado tem o intuito de realizar a troca de mensagens com clientes simulando o algoritmo de Exclusão Mútua.

Os endpoints podem ser utilizados a partir da collection do postman em `/src/collection_postman.json`.

## Como rodar

Primeiramente, deve-se ter instalado o [node.js](https://nodejs.org/en/download/) e o [yarn](https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable) em sua máquina.

Tendo feito isso, basta clonar o repositório, entrar na raiz e rodar o comando `yarn` para a instalação das dependências.

Por último, rodar o comando `yarn start` na raiz.

Estando os servidores de pé, basta fazer as requisições pelo postman.
