#!/usr/bin/env node

/**
 * Eksempel MCP-server i Node.js
 *
 * Denne serveren demonstrerer hvordan man lager en MCP-server
 * som Claude kan bruke til å hente data fra et eksternt API.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// Opprett MCP-server
const server = new McpServer({
  name: "example-server",
  version: "1.0.0",
});

// ============================================
// TOOLS - Funksjoner Claude kan kalle
// ============================================

// Tool 1: Hent værdata (simulert)
server.tool(
  "get_weather",
  "Hent værdata for en gitt by",
  {
    city: {
      type: "string",
      description: "Navnet på byen",
    },
  },
  async ({ city }) => {
    // I virkeligheten ville du kalt et vær-API her
    const weatherData = {
      city: city,
      temperature: Math.round(Math.random() * 30 - 5),
      conditions: ["Solskinn", "Overskyet", "Regn", "Snø"][Math.floor(Math.random() * 4)],
      humidity: Math.round(Math.random() * 100),
    };

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(weatherData, null, 2),
        },
      ],
    };
  }
);

// Tool 2: Søk i dokumenter (simulert)
server.tool(
  "search_documents",
  "Søk etter dokumenter basert på en spørring",
  {
    query: {
      type: "string",
      description: "Søketekst",
    },
    limit: {
      type: "number",
      description: "Maks antall resultater (default: 5)",
    },
  },
  async ({ query, limit = 5 }) => {
    // Simulerte søkeresultater
    const results = [
      { id: 1, title: "Årsrapport 2024", snippet: "Finansielle resultater..." },
      { id: 2, title: "Produktdokumentasjon", snippet: "Brukerveiledning for..." },
      { id: 3, title: "API-spesifikasjon", snippet: "REST endpoints for..." },
    ].slice(0, limit);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(results, null, 2),
        },
      ],
    };
  }
);

// Tool 3: Kalkuler tall
server.tool(
  "calculate",
  "Utfør en matematisk beregning",
  {
    expression: {
      type: "string",
      description: "Matematisk uttrykk (f.eks. '2 + 2 * 3')",
    },
  },
  async ({ expression }) => {
    try {
      // OBS: I produksjon, bruk en sikker expression parser!
      const result = Function(`"use strict"; return (${expression})`)();
      return {
        content: [
          {
            type: "text",
            text: `Resultat: ${result}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Feil: Kunne ikke beregne uttrykket`,
          },
        ],
        isError: true,
      };
    }
  }
);

// ============================================
// RESOURCES - Data Claude kan lese
// ============================================

server.resource(
  "config://settings",
  "Applikasjonskonfigurasjon",
  "application/json",
  async () => {
    return {
      contents: [
        {
          uri: "config://settings",
          mimeType: "application/json",
          text: JSON.stringify({
            environment: "development",
            features: {
              darkMode: true,
              notifications: true,
            },
          }, null, 2),
        },
      ],
    };
  }
);

// ============================================
// START SERVER
// ============================================

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP Server startet og klar!");
}

main().catch(console.error);
