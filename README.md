# Back-end Teste

## Descrição

Este é o back-end de um sistema de chat inteligente com integração de IA local. Utiliza o Ollama com o modelo Llama 3.2 para processar mensagens dos usuários, classificá-las em setores (Vendas, Suporte, Financeiro) e gerar respostas amigáveis e personalizadas. As conversas são armazenadas em um banco SQLite e agrupadas por sessão.

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução JavaScript.
- **TypeScript**: Superset do JavaScript com tipagem estática.
- **Express**: Framework para criação de APIs REST.
- **SQLite**: Banco de dados leve e embutido.
- **Ollama**: Plataforma para executar modelos de IA localmente.
- **Axios**: Cliente HTTP para integração com Ollama.

## Pré-requisitos

- Node.js (versão 18 ou superior)
- Ollama instalado (baixe em [https://ollama.com/download/windows](https://ollama.com/download/windows))
- Modelo Llama 3.2 instalado via Ollama (`ollama pull llama3.2`)

## Instalação

1. Clone ou baixe o projeto.
2. Navegue até a pasta do back-end: `cd back-end-teste`
3. Instale as dependências: `npm install`
4. Instale o Ollama e o modelo: `ollama pull llama3.2`
5. Execute o servidor: `npm run dev`

O servidor iniciará na porta 3000.

## Estrutura do Projeto

```
back-end-teste/
├── src/
│   ├── controllers/
│   │   └── MessageController.ts    # Controla as requisições de mensagens
│   ├── services/
│   │   ├── AgentService.ts         # Lógica do agente IA
│   │   ├── MessageService.ts       # Serviço de mensagens
│   │   └── botInstructions.json    # Instruções personalizadas para o bot
│   ├── repositories/
│   │   └── MessageRepository.ts    # Acesso ao banco de dados
│   ├── database/
│   │   ├── connection.ts           # Conexão com SQLite
│   │   └── schema.ts               # Criação das tabelas
│   └── routes/
│       └── message.routes.ts       # Definição das rotas
├── app.ts                          # Configuração do Express
├── server.ts                       # Inicialização do servidor
├── package.json                    # Dependências e scripts
└── README.md                       # Este arquivo
```

## Rotas da API

### POST /messages

Envia uma mensagem para o agente IA e recebe uma resposta.

**Parâmetros:**
- `content` (string, obrigatório): O texto da mensagem do usuário.
- `conversationId` (string, obrigatório): ID único da conversa (gerado pelo front-end).

**Exemplo de Requisição:**
```bash
POST http://localhost:3000/messages
Content-Type: application/json

{
  "content": "Olá, quero comprar um produto",
  "conversationId": "uuid-12345"
}
```

**Exemplo de Resposta:**
```json
{
  "sector": "VENDAS",
  "reply": "Oi! Que ótimo que você está interessado em nossos produtos. Estou te transferindo para o setor de Vendas!",
  "transfer": true,
  "summary": "Cliente demonstrou interesse em compra ou negociação."
}
```

**Códigos de Status:**
- 200: Sucesso
- 400: Parâmetros inválidos (ex.: falta content ou conversationId)

### GET /messages

Retorna o histórico de todas as conversas, agrupadas por `conversation_id`.

**Exemplo de Requisição:**
```bash
GET http://localhost:3000/messages
```

**Exemplo de Resposta:**
```json
[
  [
    {
      "id": 1,
      "conversation_id": "uuid-12345",
      "role": "USER",
      "content": "Olá, quero comprar um produto",
      "sector": null,
      "summary": null,
      "created_at": "2025-12-30T12:00:00.000Z"
    },
    {
      "id": 2,
      "conversation_id": "uuid-12345",
      "role": "AGENT",
      "content": "Oi! Que ótimo que você está interessado em nossos produtos. Estou te transferindo para o setor de Vendas!",
      "sector": "VENDAS",
      "summary": "Cliente demonstrou interesse em compra ou negociação.",
      "created_at": "2025-12-30T12:00:01.000Z"
    }
  ]
]
```

**Códigos de Status:**
- 200: Sucesso

## Funcionamento do Agente IA

O agente IA é baseado no modelo Llama 3.2 executado localmente via Ollama. Ele:

1. **Classifica a mensagem**: Analisa o conteúdo para identificar o setor relevante (Vendas, Suporte, Financeiro) com base em palavras-chave.
2. **Gera respostas personalizadas**: Usa instruções definidas em `botInstructions.json` para criar respostas amigáveis, consistentes e específicas para cada setor.
3. **Transfere para setores**: Quando apropriado, indica transferência com mensagens personalizadas (ex.: "Estou te transferindo para o setor de Vendas!").
4. **Armazena conversas**: Salva mensagens no banco, agrupadas por `conversation_id` para manter sessões separadas.

### Personalização do Bot

As instruções do bot podem ser editadas no arquivo `src/services/botInstructions.json`. Cada setor tem sua própria personalidade:

- **Vendas**: Entusiasmado e motivador.
- **Suporte**: Empático e solidário.
- **Financeiro**: Profissional e prestativo.
- **Geral**: Acolhedor e direcionador.

Exemplo:
```json
{
  "vendas": "Você é um assistente de vendas amigável... Quando transferir, diga exatamente: 'Estou te transferindo para o setor de Vendas!'"
}
```

### Limitações

- Respostas são limitadas a 50 palavras para brevidade.
- IA roda localmente, então depende do hardware.
- Sem integração com setores reais (apenas simulação).

## Scripts Disponíveis

- `npm run dev`: Inicia o servidor em modo de desenvolvimento com recarregamento automático.

## Testando a API

Use ferramentas como Postman ou Insomnia:

1. Envie um POST para `/messages` com uma mensagem sobre vendas (ex.: "Quero comprar algo").
2. Verifique a resposta com setor "VENDAS" e transferência.
3. Use GET para ver o histórico agrupado.

## Contribuição

Para contribuir:
1. Faça um fork do projeto.
2. Crie uma branch para sua feature.
3. Commit suas mudanças.
4. Abra um Pull Request.

## Licença

Este projeto é para fins educacionais e de teste. Use sob sua responsabilidade.