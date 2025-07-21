# Dashboard Administrativo - Olimpo Solar

## 📊 Visão Geral

O dashboard administrativo foi criado para monitorar o desempenho da equipe de vendas da Olimpo Solar com base nas propostas geradas pela plataforma. Oferece uma visão clara e em tempo real da performance de cada vendedor.

## 🔐 Sistema de Permissões

### Roles Implementados:
- **Admin**: Acesso completo ao dashboard e relatórios
- **User**: Acesso padrão apenas à geração de propostas

### Configuração Automática:
- O primeiro usuário cadastrado no sistema recebe automaticamente permissão de **Admin**
- Usuários subsequentes recebem permissão de **User** por padrão
- Admins podem gerenciar roles através do banco de dados

## 📋 Dados Coletados por Proposta

Cada proposta agora registra automaticamente:
- ✅ Nome do vendedor (extraído do email do usuário logado)
- ✅ Data e hora da proposta
- ✅ Nome do cliente
- ✅ Potência do sistema (kWp)
- ✅ Valor total da proposta

## 📈 Funcionalidades do Dashboard

### 🔎 Filtros Disponíveis:
- **Por vendedor**: Filtrar dados de um vendedor específico
- **Por período**: 
  - Botões rápidos: Hoje, 7 dias, 30 dias
  - Seletor de período personalizado com calendário
- **Dados em tempo real**: Atualização automática dos dados

### 📌 Indicadores por Vendedor:
- **Total de propostas geradas**
- **Soma total em R$ das propostas**
- **Média de kWp por proposta**
- **Média de valor por proposta**

### 📊 Visualizações:
- **Cards de resumo geral**: Totais consolidados de toda equipe
- **Tabela de performance**: Ranking dos vendedores ordenado por valor total
- **Histórico de propostas**: Listagem das propostas mais recentes
- **Destaque automático**: "Vendedor do Mês" baseado no maior volume

### ✅ Recursos Extras:
- **Exportar para Excel**: Download de relatório em formato CSV
- **Design responsivo**: Interface otimizada para desktop e mobile
- **Indicadores visuais**: Badges de ranking e troféus para destaque

## 🚀 Como Acessar

1. **Login como Admin**: O primeiro usuário cadastrado tem acesso automático
2. **Menu de Navegação**: Após login, clique em "Relatórios" no menu superior
3. **URL Direta**: Acesse `/dashboard` (requer autenticação como Admin)

## 🛡️ Segurança

- **RLS (Row Level Security)**: Implementado em todas as tabelas
- **Verificação de permissões**: Acesso restrito apenas para Admins
- **Políticas do Supabase**: 
  - Usuários só visualizam suas próprias propostas
  - Admins podem visualizar dados de todos os vendedores

## 🗄️ Estrutura do Banco de Dados

### Tabelas Criadas:
- `user_roles`: Gerenciamento de permissões (admin/user)
- `proposals`: Atualizada com campos `seller_name` e `seller_id`

### Funções Implementadas:
- `has_role()`: Verificação segura de permissões
- `get_user_role()`: Obtenção da role do usuário
- `update_updated_at_column()`: Atualização automática de timestamps

## 📱 Interface do Usuario

### Para Admins:
- Acesso completo ao dashboard
- Botão "Relatórios" visível no menu
- Todas as funcionalidades de análise

### Para Usuários Comuns:
- Acesso apenas ao gerador de propostas
- Menu "Relatórios" não é exibido
- Suas propostas são automaticamente registradas com seus dados

## 🔄 Fluxo de Dados

1. **Usuário gera proposta** → Dados são salvos com informações do vendedor
2. **Admin acessa dashboard** → Visualiza dados consolidados em tempo real
3. **Filtros aplicados** → Dados são filtrados conforme seleção
4. **Exportação disponível** → Relatórios podem ser baixados em CSV

## 🎯 Métricas Acompanhadas

- **Volume de propostas** por vendedor e período
- **Valor total em vendas** por vendedor
- **Média de potência** dos sistemas propostos
- **Performance comparativa** entre vendedores
- **Tendências temporais** de geração de propostas

---

**Desenvolvido para Olimpo Solar** - Sistema de monitoramento de performance comercial integrado ao gerador de propostas.