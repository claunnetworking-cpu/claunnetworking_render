# ClaunNetworking - Plataforma de Recrutamento e Educação

## 🚀 Projeto Pronto para Produção no Render

Este é o projeto ClaunNetworking configurado especificamente para implantação na plataforma Render, com separação de domínios e otimizações para produção.

### 📋 Estrutura do Projeto

```
claunnetworking_render/
├── backend/              # API Flask para claunnet-api.onrender.com
├── main-site/           # Site principal para claunnet.com.br
├── admin-site/          # Painel admin para admin.claunnet.com.br
├── docs/                # Documentação de implantação
├── scripts/             # Scripts de inicialização
└── render.yaml          # Configuração do Render
```

### 🌐 Domínios Configurados

- **Site Principal**: `https://claunnet.com.br`
- **Painel Administrativo**: `https://admin.claunnet.com.br`
- **API Backend**: `https://claunnet-api.onrender.com`

### 🔧 Implantação no Render

1. **Conecte este repositório ao Render**
2. **Crie um Blueprint** usando o arquivo `render.yaml`
3. **Configure os domínios personalizados** conforme documentação
4. **Execute o script de inicialização** do banco de dados

Para instruções detalhadas, consulte: [docs/DEPLOY_ON_RENDER.md](docs/DEPLOY_ON_RENDER.md)

### 🔐 Credenciais de Administrador

- **Email**: `admin@claunnet.com.br`
- **Senha**: Definida pela variável de ambiente `ADMIN_PASSWORD`

### 📚 Funcionalidades

- Sistema completo de autenticação
- Gestão de vagas e candidaturas
- Plataforma educacional com cursos
- Painel administrativo com métricas
- Sistema de planos de assinatura
- APIs RESTful completas

### 🛡️ Segurança

- Separação de domínios para admin
- Certificados SSL automáticos
- Headers de segurança configurados
- Dados de teste removidos
- Senhas com hash seguro

### 📞 Suporte

Para questões técnicas sobre a implantação, consulte a documentação em `docs/` ou os comentários no código-fonte.

---

**Desenvolvido por**: Manus AI  
**Versão**: 1.0.0 - Produção  
**Data**: Outubro 2024
