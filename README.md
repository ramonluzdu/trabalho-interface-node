# Vereda | Catálogo de produtos

Aplicação web para cadastrar, consultar, editar e excluir produtos. A interface é servida pelo Express e usa uma API REST com persistência relacional em SQLite por meio do Sequelize.

## Executar

Requer Node.js 20 ou superior.

```bash
npm install
npm start
```

Acesse http://localhost:3000. O banco `database.sqlite` é criado automaticamente na primeira inicialização. Para escolher outro arquivo, defina `DB_STORAGE`; a porta pode ser configurada com `PORT`.

## API

| Método | Rota | Ação |
| --- | --- | --- |
| `GET` | `/produtos` | Listar produtos |
| `GET` | `/produtos/:id` | Consultar produto |
| `POST` | `/produtos` | Criar produto |
| `PUT` | `/produtos/:id` | Atualizar produto |
| `DELETE` | `/produtos/:id` | Excluir produto |

Envie `nome` (texto não vazio) e `preco` (número maior ou igual a zero) no corpo JSON para criar ou atualizar.

## Testes

```bash
npm test
```

Os testes de integração usam SQLite em memória e Supertest. O Jest exige cobertura global superior a 90% em linhas, funções, instruções e branches.