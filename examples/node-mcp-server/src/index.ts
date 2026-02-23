#!/usr/bin/env node

/**
 * Eksempel MCP-server i TypeScript
 *
 * Denne serveren demonstrerer hvordan man lager en MCP-server
 * som Claude kan bruke til å hente data fra et eksternt API.
 */

import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Opprett MCP-server
const server = new McpServer({
  name: "example-server",
  version: "1.0.0",
});

// ============================================
// Simulerte data
// ============================================

interface TeamMember {
  name: string;
  role: string;
  email: string;
}

interface Document {
  id: number;
  title: string;
  snippet: string;
  category: string;
  updatedAt: string;
}

const teamMembers: TeamMember[] = [
  { name: "Kari Nordmann", role: "Tech Lead", email: "kari@example.com" },
  { name: "Ola Hansen", role: "Backend-utvikler", email: "ola@example.com" },
  { name: "Liv Johansen", role: "Frontend-utvikler", email: "liv@example.com" },
  { name: "Per Olsen", role: "DevOps", email: "per@example.com" },
];

const documents: Document[] = [
  { id: 1, title: "Årsrapport 2024", snippet: "Finansielle resultater og nøkkeltall...", category: "rapport", updatedAt: "2024-12-15" },
  { id: 2, title: "Produktdokumentasjon", snippet: "Brukerveiledning for kjernesystemet...", category: "dokumentasjon", updatedAt: "2024-11-20" },
  { id: 3, title: "API-spesifikasjon v2", snippet: "REST endpoints for betalingstjenester...", category: "teknisk", updatedAt: "2025-01-10" },
  { id: 4, title: "Onboarding-guide", snippet: "Slik kommer du i gang som ny utvikler...", category: "dokumentasjon", updatedAt: "2025-02-01" },
  { id: 5, title: "Sikkerhetsretningslinjer", snippet: "Krav til autentisering og autorisasjon...", category: "teknisk", updatedAt: "2025-01-25" },
];

// ============================================
// TOOLS - Funksjoner Claude kan kalle
// ============================================

// Tool 1: Hent værdata (simulert)
server.registerTool(
  "get_weather",
  {
    description: "Hent værdata for en gitt by",
    inputSchema: { city: z.string().describe("Navnet på byen") },
  },
  async ({ city }) => {
    const weatherData = {
      city,
      temperature: Math.round(Math.random() * 30 - 5),
      conditions: ["Solskinn", "Overskyet", "Regn", "Snø"][Math.floor(Math.random() * 4)],
      humidity: Math.round(Math.random() * 100),
    };

    return {
      content: [{ type: "text" as const, text: JSON.stringify(weatherData, null, 2) }],
    };
  }
);

// Tool 2: Søk i dokumenter (simulert)
server.registerTool(
  "search_documents",
  {
    description: "Søk etter dokumenter basert på en spørring",
    inputSchema: {
      query: z.string().describe("Søketekst"),
      limit: z.number().optional().default(5).describe("Maks antall resultater"),
    },
  },
  async ({ query, limit }) => {
    const results = documents
      .filter(d =>
        d.title.toLowerCase().includes(query.toLowerCase()) ||
        d.snippet.toLowerCase().includes(query.toLowerCase()) ||
        d.category.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, limit);

    return {
      content: [{ type: "text" as const, text: JSON.stringify(results, null, 2) }],
    };
  }
);

// Tool 3: Kalkuler tall
server.registerTool(
  "calculate",
  {
    description: "Utfør en matematisk beregning",
    inputSchema: { expression: z.string().describe("Matematisk uttrykk (f.eks. '2 + 2 * 3')") },
  },
  async ({ expression }) => {
    try {
      // OBS: I produksjon, bruk en sikker expression parser!
      const result = Function(`"use strict"; return (${expression})`)();
      return {
        content: [{ type: "text" as const, text: `Resultat: ${result}` }],
      };
    } catch {
      return {
        content: [{ type: "text" as const, text: "Feil: Kunne ikke beregne uttrykket" }],
        isError: true,
      };
    }
  }
);

// ============================================
// RESOURCES - Data Claude kan lese
// ============================================

// Resource 1: Applikasjonskonfigurasjon
server.registerResource(
  "settings",
  "config://settings",
  { mimeType: "application/json", description: "Applikasjonskonfigurasjon" },
  async () => ({
    contents: [{
      uri: "config://settings",
      mimeType: "application/json",
      text: JSON.stringify({
        environment: "development",
        version: "1.0.0",
        features: {
          darkMode: true,
          notifications: true,
          betaFeatures: false,
        },
        limits: {
          maxUploadSizeMb: 50,
          maxRequestsPerMinute: 100,
        },
      }, null, 2),
    }],
  })
);

// Resource 2: Team-oversikt
server.registerResource(
  "team-members",
  "team://members",
  { mimeType: "application/json", description: "Oversikt over teammedlemmer" },
  async () => ({
    contents: [{
      uri: "team://members",
      mimeType: "application/json",
      text: JSON.stringify(teamMembers, null, 2),
    }],
  })
);

// Resource 3: System-status
server.registerResource(
  "system-health",
  "status://health",
  { mimeType: "application/json", description: "Systemhelse og status" },
  async () => ({
    contents: [{
      uri: "status://health",
      mimeType: "application/json",
      text: JSON.stringify({
        status: "healthy",
        uptime: `${Math.floor(process.uptime())}s`,
        services: {
          database: { status: "up", latencyMs: Math.round(Math.random() * 20 + 5) },
          cache: { status: "up", latencyMs: Math.round(Math.random() * 5 + 1) },
          messageQueue: { status: "up", latencyMs: Math.round(Math.random() * 10 + 2) },
        },
        memoryUsage: {
          heapUsedMb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
          heapTotalMb: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        },
      }, null, 2),
    }],
  })
);

// Resource 4: Dokument-katalog
server.registerResource(
  "document-catalog",
  "docs://catalog",
  { mimeType: "application/json", description: "Katalog over tilgjengelige dokumenter" },
  async () => ({
    contents: [{
      uri: "docs://catalog",
      mimeType: "application/json",
      text: JSON.stringify({
        totalDocuments: documents.length,
        categories: [...new Set(documents.map(d => d.category))],
        documents: documents.map(({ id, title, category, updatedAt }) => ({
          id, title, category, updatedAt,
        })),
      }, null, 2),
    }],
  })
);

// Resource 5 (template): Enkeltdokument via ID
server.registerResource(
  "document-by-id",
  new ResourceTemplate("docs://document/{id}", { list: undefined }),
  { mimeType: "application/json", description: "Hent et spesifikt dokument" },
  async (uri, variables) => {
    const id = Array.isArray(variables.id) ? variables.id[0] : variables.id;
    const doc = documents.find(d => d.id === Number(id));
    if (!doc) {
      return {
        contents: [{
          uri: uri.href,
          mimeType: "application/json",
          text: JSON.stringify({ error: `Dokument ${id} ikke funnet` }),
        }],
      };
    }
    return {
      contents: [{
        uri: uri.href,
        mimeType: "application/json",
        text: JSON.stringify(doc, null, 2),
      }],
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
