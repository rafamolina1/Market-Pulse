# MarketPulse 📊

> **Dashboard Financeiro Moderno em Tempo Real** - Uma vitrine técnica sofisticada de rastreamento de ativos com design premium e arquitetura de nível industrial.

> [!NOTE]
> Ler em: **[English](README.md)** | **[Português](README-pt.md)**

[![Status](https://img.shields.io/badge/status-pronto--para--produção-success?style=for-the-badge)](https://github.com/rafamolina1/Market-Pulse)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.1.0-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![i18n](https://img.shields.io/badge/i18n-Multilíngue-FF6633?style=for-the-badge)](https://www.i18next.com/)
[![PWA](https://img.shields.io/badge/PWA-Habilitado-blueviolet?style=for-the-badge)](https://vite-pwa-org.netlify.app/)

---

## 🌟 Visão Geral

O MarketPulse é um dashboard financeiro de alta performance projetado para investidores modernos. Ele oferece uma aula técnica e visual em gerenciamento de dados em tempo real, apresentando uma estética inspirada em TRON com glassmorphism avançado.

### 🚀 Principais Funcionalidades

- 📁 **Rastreamento de Portfólio Avançado** - Gerencie seus ativos com cálculos de P&L (Lucro e Perda) em tempo real para moedas, criptos e commodities.
- 📱 **Progressive Web App (PWA)** - Instalável em qualquer dispositivo com capacidades offline e uma experiência nativa.
- 🌐 **Interface Globalizada** - Totalmente localizado em **Inglês** e **Português (BR)** com formatação de moeda precisa.
- 📊 **Visualizações Dinâmicas** - Gráficos históricos interativos alimentados por **Chart.js** com gradientes premium e animações suaves.
- 📥 **Exportação de Nível Empresarial** - Gere relatórios profissionais em **PDF** e conjuntos de dados **CSV** do seu portfólio instantaneamente.
- 🛡️ **Arquitetura Tolerante a Falhas** - Tratamento de erros robusto com React Error Boundaries e recuperação graciosa.
- ⚡ **Performance Otimizada** - Carregamento em menos de um segundo via lazy loading, memoização e gerenciamento de estado eficiente com Context API.
- 💱 **Conversor Integrado** - Lógica de conversão de moeda em tempo real para pares globais.

## 🛠️ Stack Técnica

- **Framework**: React 18 (Hooks & Context API)
- **Ferramentas**: Vite (HMR ultra-rápido)
- **Estilização**: Vanilla CSS (Design Tokens Customizados, Glassmorphism)
- **Gerenciamento de Estado**: Arquitetura Multi-Context (Market, Portfolio, Theme)
- **Persistência de Dados**: LocalStorage com sincronização automática
- **Dados em Tempo Real**: Integração WebSocket (API Binance para Criptos)
- **PWA**: `vite-plugin-pwa` com Service Workers customizados
- **Exportação**: `jsPDF` & `jsPDF-AutoTable` (Carregados via Lazy-load)

## 📁 Estrutura do Projeto

```text
MarketPulseOfc/
├── src/
│   ├── components/        # Componentes de UI Especializados
│   │   ├── PortfolioModal.jsx  # CRUD Complexo & Lógica
│   │   ├── HistoricalChart.jsx # Visualização de Dados
│   │   └── SplashScreen.jsx    # Animação de Intro Premium
│   ├── contexts/          # Arquitetura Baseada em Estado
│   │   ├── MarketContext.jsx   # Lógica WebSocket Tempo Real
│   │   └── PortfolioContext.jsx# Operações CRUD & Persistência
│   ├── services/          # Camada de Dados (APIs & Simulações)
│   │   ├── websocketService.js # Abstração WS de alto nível
│   │   ├── exportService.js    # Geração de PDF/CSV
│   │   └── portfolioService.js # Lógica de Negócio & Matemática
│   ├── locales/           # Internacionalização (JSON)
│   ├── utils/             # Utilitários Técnicos (Formatadores)
│   ├── index.css          # Design System & Tokens
│   └── main.jsx           # Configuração de Entrada
```

## 🎨 Filosofia de Design: "TRON Modern"

A interface foi construída sobre um sistema de design customizado focado em alto contraste e profundidade técnica:
- **Cor Primária**: `#FF7F3E` (Laranja TRON)
- **Fundo**: Camadas Profundas de Obsidiana (`#0A0A0F`, `#121218`)
- **Efeitos**: Backdrop blur (20px), gradientes lineares e pulsos de energia na interação.

## 🔧 Instalação & Configuração

1. **Clonar & Instalar**
   ```bash
   git clone https://github.com/rafamolina1/Market-Pulse.git
   npm install
   ```

2. **Ambiente**
   ```bash
   cp .env.example .env
   ```

3. **Desenvolvimento**
   ```bash
   npm run dev
   ```

4. **Build de Produção**
   ```bash
   npm run build
   npm run preview
   ```

## 👤 Autor

**Rafael Molina**
- GitHub: [@rafamolina1](https://github.com/rafamolina1)

---
⭐ **MarketPulse** - Projetado proativamente para clareza e performance.
