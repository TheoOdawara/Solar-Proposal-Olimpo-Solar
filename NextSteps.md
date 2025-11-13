# **Descrição**
    Como fizemos uma migração para usar um backend em node, com o postgresql normal, precisamos adaptar o projeto todo a isso. Além de mudar o copilot instructions para se adaptar a isso também. 

# **O que usar?**
## copilot-instructions.md.
## Todas as pastas do projeto (Sem exceção).
## docker-compose.yml.
## .gitignore.
## MiGRATION_PLAN.md e MIGRATION_README.md

# **O que fazer?**
## Primeiro deverá olhar para o copilot-instructions.md, analisar ele linha a linha e mudar o que for necessário para nossos novos padrões, stack e estrutura de projeto nova.
## Varrer pasta a pasta, todos os arquivos linha a linha. No final da varredura e análise detalhada de cada arquivo, colocar dentro da pasta ./Analises a análise dividido por pasta.
### Exemplo: Análise da pasta backend - será criado um arquivo analiseBackend.md e dentro a análise detalhada. 
## Ajuste, de acordo com a análise completa do projeto, do projeto para que esteja alinhado e funcional. Tudo de acordo com a nova arquitetura.
## Faça uma análise final para correção de erros e avisos(não é só excluir, tem que resolver. Só excluir se for inútil de verdade). Além da análise se está tudo usando a arquitetura nova mesmo, que no caso é: backend em nodejs, banco de dados postgresql, front em react e tailwind, com docker separando backend, banco de dados e frontend.

# **Ordem de ação**
## Primeiro passo -> Ajustar o copilot-instruction.md.
## Segundo passo -> Varredura de todas as pastas com a criação da documentação de cada uma: 
### ./backend
### ./database
### ./docker
### ./docs
### ./frontend
## Terceiro passo -> Criação de um plano de ação detalhado e eficiente de acordo com a análise feita.
## Último passo -> Análise final para homologação. 

# **Observações**
## Sempre que necessário separe cada passo em quantas etapas forem neceessárias para que a requisição seja atendida 100% e de forma eficiente.
## Não seja preguiçoso, realize as ações da forma que devem ser feitas e como foi pedido. 