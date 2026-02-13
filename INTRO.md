# Intro: Hva er MCP? (10 min)

## Hvordan utvide Claude?

Det finnes flere måter å gi Claude nye evner på:

| Metode | Hva er det? | Når bruke det? |
|--------|-------------|----------------|
| **MCP Server** | Egen prosess som eksponerer tools via protokoll | Integrasjon med eksterne systemer/APIer |
| **Custom Slash Command** | Prompt-mal som kjøres med `/kommando` | Gjentakende oppgaver med fast mønster |
| **Skill** | Pakke med prompts og logikk | Komplekse workflows, deling med andre |
| **Agent** | Autonom Claude som jobber selvstendig | Langvarige, multi-step oppgaver |

## Når velge MCP Server?

**Velg MCP når du trenger:**
- ✅ Koble til eksterne systemer (APIer, databaser, tjenester)
- ✅ Hente sanntidsdata Claude ikke har tilgang til
- ✅ Utføre handlinger i andre systemer
- ✅ Dele integrasjonen med flere brukere/verktøy
- ✅ Gjenbruke på tvers av MCP-klienter (Claude Code, Cursor, etc.)

**Velg noe annet når:**
- ❌ Du bare trenger en prompt-mal → Bruk Custom Slash Command
- ❌ Du vil pakke en workflow → Bruk Skill
- ❌ Oppgaven er ren tekstbehandling → Claude klarer det selv

## Beslutningstre

```
Trenger du data fra et eksternt system?
├── JA → MCP Server
└── NEI → Trenger du en gjenbrukbar prompt-mal?
          ├── JA → Custom Slash Command
          └── NEI → Claude klarer det uten utvidelser
```

## Eksempler på valget

| Oppgave | Valg | Hvorfor |
|---------|------|---------|
| "Hent status fra Kubernetes" | **MCP** | Trenger kobling til eksternt system |
| "Formater alltid commit-meldinger sånn" | Slash Command | Bare en prompt-mal |
| "Sjekk saldo i bankkonto" | **MCP** | Sanntidsdata fra API |
| "Generer release notes fra commits" | Slash Command | Tekstbehandling av lokal data |
| "Søk i intern dokumentasjon" | **MCP** | Kobling til Confluence/wiki |
| "Kjør standard code review" | Skill | Pakket workflow |

## Model Context Protocol (MCP)

MCP er en åpen protokoll som lar AI-assistenter (som Claude) kommunisere med eksterne systemer på en standardisert måte.

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Claude    │ ◄─────► │ MCP Server  │ ◄─────► │  Ditt API   │
│  (klient)   │   MCP   │  (broker)   │  HTTP   │  (backend)  │
└─────────────┘         └─────────────┘         └─────────────┘
```

## Hvorfor MCP?

1. **Standardisert** - Én protokoll for alle integrasjoner
2. **Sikkert** - Claude får kun tilgang til det du eksponerer
3. **Enkelt** - Definer tools, og Claude bruker dem automatisk
4. **Gjenbrukbart** - Samme server fungerer med alle MCP-klienter
5. **Økosystem** - Mange ferdige MCP-servere finnes allerede

## Hva kan du gjøre med MCP?

Tenk på MCP som en bro mellom Claude og systemene du bruker daglig:

### Effektivisere hverdagen
- **Slippe å bytte kontekst** - Spør Claude i stedet for å åpne dashboards
- **Samle info fra flere steder** - Claude henter det du trenger
- **Automatiske oppslag** - Svar på sekunder, ikke minutter

### Automatisere prosesser
- **Generere rapporter** - Sprint-status, changelog, metrics
- **Validere før deploy** - Sjekk config, dependencies, compliance
- **Trigge workflows** - Start builds, oppdater tickets, send varsler

### Skape verdi
- **Raskere svar** - Finn informasjon umiddelbart
- **Bedre kvalitet** - Konsistente, oppdaterte data
- **Del med teamet** - Alle får tilgang til samme verktøy

### Eksempler på MCP-servere folk har laget
- Slack - send meldinger, søk i kanaler
- Jira - hent issues, oppdater status
- GitHub - PRs, issues, actions
- Kubernetes - pods, logs, deployments
- Confluence - søk i dokumentasjon
- Databaser - spørringer (read-only!)
- Interne APIer - hva som helst med et API

## MCP-konsepter

### Tools
Funksjoner Claude kan kalle:
```json
{
  "name": "get_weather",
  "description": "Hent værdata for en by",
  "inputSchema": {
    "type": "object",
    "properties": {
      "city": { "type": "string" }
    }
  }
}
```

### Resources (valgfritt)
Data Claude kan lese:
```json
{
  "uri": "config://app-settings",
  "name": "App Settings",
  "mimeType": "application/json"
}
```

### Prompts (valgfritt)
Forhåndsdefinerte maler Claude kan bruke.

## Transport

MCP støtter to transport-metoder:

1. **stdio** - Kommunikasjon via stdin/stdout (enklest)
2. **HTTP/SSE** - For web-baserte servere

## Demo

La oss se på et enkelt eksempel...

```bash
# Start MCP Inspector
npx @anthropic-ai/mcp-inspector node examples/node-mcp-server/index.js
```
