# Workshop-oppgaver

Velg enten Node.js eller Kotlin basert på hva du er mest komfortabel med.

---

## Oppgave 1: Forstå eksempel-serveren (5 min)

Start med å la Claude forklare eksempel-koden:

```bash
# For Node.js
claude "les examples/node-mcp-server/index.js og forklar hvordan MCP-serveren fungerer"

# For Kotlin
claude "les examples/kotlin-mcp-server og forklar strukturen"
```

**Mål:** Forstå hvordan tools defineres og hvordan requests håndteres.

---

## Oppgave 2: Legg til en ny tool (10 min)

Utvid eksempel-serveren med en ny tool. Velg én:

### Alternativ A: `get_joke` tool

En tool som returnerer en tilfeldig vits.

```bash
claude "legg til en get_joke tool i MCP-serveren som returnerer en tilfeldig vits"
```

### Alternativ B: `translate` tool

En tool som "oversetter" tekst (simulert).

```bash
claude "legg til en translate tool som tar tekst og målspråk som input"
```

### Alternativ C: Din egen idé

```bash
claude "legg til en [beskriv din tool] i MCP-serveren"
```

---

## Oppgave 3: Lag MCP-server for et ekte API (15 min)

Nå skal du lage en MCP-server som wrapper et ekte API.

### Steg 1: Velg et API

Eksempler:

- Yr.no API (vær)
- Wikipedia API
- GitHub API
- Internt API fra jobben

### Steg 2: La Claude hjelpe deg

```bash
# Gi Claude API-dokumentasjonen
claude "her er API-dokumentasjonen for [API-navn]: [lim inn eller pek på URL]
        hjelp meg lage en MCP-server som wrapper dette APIet"
```

### Steg 3: Test med MCP Inspector

```bash
# Node.js
npx @modelcontextprotocol/inspector node din-server.js

# Kotlin
npx @modelcontextprotocol/inspector java -jar build/libs/mcp-server.jar
```

---

## Bonusoppgave: Legg til Resources

Resources lar Claude lese data uten å kalle en tool.

```bash
claude "legg til en resource i MCP-serveren som eksponerer konfigurasjon eller status-data"
```

---

## Tips

- **Bruk Claude til å skrive koden** - beskriv hva du vil, og la Claude implementere
- **Test ofte med Inspector** - sjekk at tools dukker opp og fungerer
- **Start enkelt** - få én tool til å fungere før du legger til flere
- **Les feilmeldinger** - Inspector viser detaljerte feil hvis noe går galt
