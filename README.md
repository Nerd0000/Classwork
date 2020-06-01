# Classwork
Sistema que permite ao usuário acessar todos os seus repositórios, criar ou participar de turma, entrar em equipes de uma determinada
turma e cumprir as metas da sua equipe dadas pelo professor. A ideia se baseia em uma relação de professor para aluno, onde o responsável 
pela turma tem acesso direto as informações do repositório da equipe, que é gerênciado por um de seus membros.

## Mas o Github já não nos permite isso?
**Não.** O Github possui sim uma estrutura que fornece suporte a organizações, times, equipes etc... Mas o objetivo do Classwork é gerar um
**relatório do desempenho de cada membro da equipe** que pode ser visualizado pelo professor (ou de um respoitório próprio do usuário que 
poderá ser acessado somente por ele)

## Conteúdo em destaque
![alt text](https://github.com/L-Marcel/Classwork/raw/master/frontend/public/images/Login.gif "Login")
![alt text](https://github.com/L-Marcel/Classwork/raw/master/frontend/public/images/Relatorio.gif "Relatório")

## Status do projeto
Em desenvolvimento...

## Metas atuais
- Geral
  - [x] Criar repositório do projeto no Github;
  - [x] Criar README.md;
  - [ ] Atualizar estrutura para suportar o Typescript;
  
- Backend
  - [x] Implementar a API do Github;
  - [x] Criar entidades;
  - [x] Implementar gerênciamento básico das informações do usuário;
  - [ ] Implementar gerênciamento básico das informações das turmas (Em desenvolvimento);
  - [ ] Implementar gerênciamento básico das informações das equipes.
  
- Frontend
  - [x] Página de login;
  - [x] Menu lateral expansivo;
  - [x] Página de ajuda, sucesso e erro;
  - [x] Listagem de repositórios publicos;
  - [X] Relatório do repositório;
  - [X] Relatório de um commit especifico;
  - [X] Implementar graficos;
  - [X] Leitura de arquivos do diretório;
  - [ ] Página de criação e listagem de turmas;
  - [ ] Página da turma;
  - [ ] Página de criação e listagem de equipes;
  - [ ] Página da equipe.
  
- Mobile 
  - Aguardando conclusão das funcionalidades do Backend e Frontend;

## Informações adicionais
A aplicação só funcionará com um arquivo .env que armazene as seguintes variáveis:
```
REACT_APP_GH_BASIC_CLIENT_ID=[ID DO CLIENT DA SUA APLICAÇÂO NO GITHUB]
REACT_APP_GH_BASIC_SECRET_ID=[ID SECRETO DA SUA APLICAÇÃO NO GITHUB]
REACT_APP_STATE=[ESCOLHA PESSOAL]
REACT_APP_URL_BACK=http://localhost:3333
REACT_APP_URL_FRONT=http://localhost:3000
REACT_APP_PORT_BACK=3333
REACT_APP_PORT_FRONT=3000
REACT_APP_DB_IDENTITY=[RECOMENDADO]
```
Obs: Tanto a pasta Frontend quanto a Backend devem possuir esse arquivo.