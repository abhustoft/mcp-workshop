# Intro: Hva er MCP? (10 min)

## Hvordan utvide Claude?

Det finnes flere måter å gi Claude nye evner på:

| Metode                   | Hva er det?                                     | Når bruke det?                          |
| ------------------------ | ----------------------------------------------- | --------------------------------------- |
| **MCP Server**           | Egen prosess som eksponerer tools via protokoll | Integrasjon med eksterne systemer/APIer |
| **Custom Slash Command** | Prompt-mal som kjøres med `/kommando`           | Gjentakende oppgaver med fast mønster   |
| **Skill**                | Pakke med prompts og logikk                     | Komplekse workflows, deling med andre   |
| **Agent**                | Autonom Claude som jobber selvstendig           | Langvarige, multi-step oppgaver         |

## Custom Slash Command

En markdown-fil med en prompt-mal som kjøres med `/kommando`. Ligger i `.claude/commands/`.

```markdown
# Fil: .claude/commands/review.md
Gjør en code review av endringene i denne branchen.
Fokuser på sikkerhet, ytelse og lesbarhet.
Gi konkrete forslag til forbedringer.
```

Bruk: `/review` i Claude Code - det er alt.

**Kort sagt:** En gjenbrukbar prompt du slipper å skrive på nytt hver gang.

---

## Skill

En slash command som er delt som en pakke - typisk fra et open source-repo eller npm.

- Installeres fra GitHub eller lokalt
- Kan inneholde flere prompts og logikk
- Deles på tvers av team og prosjekter

**Kort sagt:** En slash command som er pakket for deling.

---

## Når velge hva?

```
Trenger du data fra et eksternt system?
├── JA → MCP Server
└── NEI → Trenger du en gjenbrukbar prompt-mal?
          ├── JA → Custom Slash Command
          └── NEI → Claude klarer det uten utvidelser
```

| Oppgave                                 | Valg          | Hvorfor                             |
| --------------------------------------- | ------------- | ----------------------------------- |
| "Hent status fra Kubernetes"            | **MCP**       | Trenger kobling til eksternt system |
| "Formater alltid commit-meldinger sånn" | Slash Command | Bare en prompt-mal                  |
| "Sjekk saldo i bankkonto"              | **MCP**       | Sanntidsdata fra API                |
| "Søk i intern dokumentasjon"            | **MCP**       | Kobling til Confluence/wiki         |
| "Kjør standard code review"             | Skill         | Pakket workflow                     |

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

- **Slippe å bytte kontekst** - Spør Claude i stedet for å åpne dashboards
- **Automatisere prosesser** - Rapporter, validering, trigge workflows
- **Raskere og mer konsistente svar** - Oppdaterte data på sekunder

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
npx @modelcontextprotocol/inspector node examples/node-mcp-server/index.js
```
