# MarketPulse

> Dashboard financeiro em tempo real feito com React e Vite para demonstrar produto, dados vivos, performance e uma identidade visual mais forte.

> [!NOTE]
> Ler em: **[English](README.md)** | **[Português](README-pt.md)**

[![Status](https://img.shields.io/badge/status-pronto--para--produção-success?style=for-the-badge)](https://github.com/rafamolina1/Market-Pulse)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.1.0-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![PWA](https://img.shields.io/badge/PWA-Habilitado-blueviolet?style=for-the-badge)](https://vite-pwa-org.netlify.app/)

## Preview do Dashboard

![Preview do dashboard do MarketPulse](public/marketpulse.png)

## O Que É

O MarketPulse acompanha moedas, criptomoedas e commodities em uma única interface. O projeto reúne atualização em tempo real, gráficos históricos, gerenciamento de portfólio, exportação, múltiplos idiomas e comportamento de PWA.

Além de funcionar como app, ele também serve como peça de portfólio. A estrutura foi pensada para mostrar composição de componentes, fluxo assíncrono, organização de estado e decisões práticas de performance.

## Por Que Este Projeto É Bom Para Um Portfólio Júnior

- Resolve um problema de produto real, e não só uma landing page estática.
- Mostra várias habilidades de front-end no mesmo projeto: dados, gráficos, i18n, persistência e responsividade.
- Tem separação clara entre interface, regra de negócio e camada de serviços.
- Gera bons assuntos para entrevista: performance, estado global, lazy loading e design system.

## Funcionalidades

- Monitoramento ao vivo de moedas, criptoativos e commodities
- Gráficos históricos em modal com múltiplos intervalos
- Portfólio com valor total e lucro/prejuízo
- Exportação em CSV e PDF
- Preferências de tema e idioma persistidas em `localStorage`
- Manifesto PWA e suporte a instalação
- Modais e fluxos pesados carregados sob demanda

## Stack

- `React 18`
- `Vite 5`
- `Chart.js` + `react-chartjs-2`
- `i18next` + `react-i18next`
- `vite-plugin-pwa`
- CSS vanilla com design tokens

## Estrutura do Projeto

```text
src/
├── components/   # Blocos visuais: cards, modais, gráficos e splash screen
├── contexts/     # Estado compartilhado de mercado, tema e portfólio
├── services/     # APIs, websocket e lógica de dados
├── locales/      # Traduções
├── utils/        # Formatadores e helpers
├── App.jsx       # Composição da tela principal
└── index.css     # Tokens globais e base visual
```

## Como Rodar Localmente

Na versão atual, o projeto não precisa de `.env`.

```bash
git clone https://github.com/rafamolina1/MarketPulseOfc.git
cd MarketPulseOfc
npm install
npm run dev
```

Build de produção:

```bash
npm run build
npm run preview
```

## O Que Vale Estudar Neste Código

Se você ainda é dev júnior, começa por estes arquivos:

1. `src/App.jsx`
   Montagem da interface principal e fluxos lazy.
2. `src/contexts/MarketContext.jsx`
   Orquestração de dados, websockets e preferências.
3. `src/components/HistoricalChart.jsx`
   Configuração de gráfico e memoização.
4. `src/index.css`
   Tokens, temas e sistema visual global.

## Notas de Performance

- Modais pesados são carregados com lazy loading.
- Formatação de número e data pode ser cacheada para evitar recriação desnecessária de `Intl`.
- Separação de chunks no build ajuda a reduzir o peso inicial.
- `content-visibility` pode diminuir o custo de render de seções fora da viewport.

## Direção Visual

A interface busca um clima de terminal financeiro premium, com acentos quentes, superfícies translúcidas e leitura mais rápida. A meta é parecer um projeto autoral de portfólio, não apenas mais um template genérico de finanças.

## Autor

**Rafael Molina**

- GitHub: [@rafamolina1](https://github.com/rafamolina1)

O MarketPulse foi pensado para demonstrar execução front-end, clareza de produto e atenção real a performance.
