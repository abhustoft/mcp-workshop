# Koble MCP-server til Claude (10 min)

Når MCP-serveren fungerer i Inspector, kan du koble den til Claude.

## Konfigurasjon

MCP-servere konfigureres i Claude Code sin settings-fil.

### Finn settings-filen

```bash
# Linux/macOS
~/.claude/settings.json

# Eller bruk Claude Code
claude "vis meg hvor claude code settings-filen ligger"
```

### Legg til MCP-server

Rediger `settings.json` og legg til din server under `mcpServers`:

```json
{
  "mcpServers": {
    "min-server": {
      "command": "node",
      "args": ["/full/path/to/examples/node-mcp-server/index.js"],
      "env": {}
    }
  }
}
```

For Kotlin:

```json
{
  "mcpServers": {
    "kotlin-server": {
      "command": "java",
      "args": ["-jar", "/full/path/to/mcp-server.jar"],
      "env": {}
    }
  }
}
```

## Verifiser at det fungerer

Start Claude Code på nytt og sjekk:

```bash
# Start Claude Code
claude

# Sjekk tilgjengelige tools
/mcp
```

Du skal se din MCP-server og dens tools listet opp.

## Bruk tools fra Claude

Nå kan du snakke naturlig med Claude, og den vil bruke dine tools:

```
> Hva er været i Oslo?

Claude: La meg sjekke det for deg...
[Bruker get_weather tool]
Været i Oslo er 15°C og overskyet.
```

## Feilsøking

### Server starter ikke
```bash
# Test at kommandoen fungerer direkte
node /full/path/to/index.js

# Sjekk logs
claude --mcp-debug
```

### Tools vises ikke
- Restart Claude Code etter config-endringer
- Sjekk at path er absolutt (ikke relativ)
- Verifiser JSON-syntaks i settings.json

### Tool-kall feiler
- Test først i MCP Inspector
- Sjekk at environment-variabler er satt
- Se etter feilmeldinger i Claude Code output

## Miljøvariabler

Hvis serveren trenger API-nøkler:

```json
{
  "mcpServers": {
    "min-server": {
      "command": "node",
      "args": ["/path/to/index.js"],
      "env": {
        "API_KEY": "din-api-nøkkel",
        "API_URL": "https://api.example.com"
      }
    }
  }
}
```

## Flere servere

Du kan ha flere MCP-servere samtidig:

```json
{
  "mcpServers": {
    "weather": {
      "command": "node",
      "args": ["/path/to/weather-server.js"]
    },
    "documents": {
      "command": "node",
      "args": ["/path/to/document-server.js"]
    },
    "internal-api": {
      "command": "java",
      "args": ["-jar", "/path/to/internal-api-server.jar"]
    }
  }
}
```

Claude vil automatisk velge riktig tool basert på kontekst.
