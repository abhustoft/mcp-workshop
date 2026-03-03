# Testing med MCP Inspector (10 min)

MCP Inspector er et debugging-verktøy som lar deg teste MCP-serveren din uten å koble til Claude.

## Installasjon

Inspector kjøres via npx (ingen installasjon nødvendig):

```bash
npx @modelcontextprotocol/inspector
```

## Bruk

### Start Inspector med din server

```bash
# Node.js server
npx @modelcontextprotocol/inspector node examples/node-mcp-server/index.js

# Kotlin server (etter bygging)
cd examples/kotlin-mcp-server
./gradlew bootJar
npx @modelcontextprotocol/inspector java -jar build/libs/mcp-server.jar
```

### Hva du kan gjøre i Inspector

1. **Se tilgjengelige tools**
   - Klikk på "Tools" i venstre panel
   - Se alle tools med navn, beskrivelse og input-schema

2. **Teste tool-kall**
   - Velg en tool
   - Fyll inn parametere
   - Klikk "Call Tool"
   - Se responsen

3. **Se resources**
   - Klikk på "Resources"
   - Se tilgjengelige ressurser
   - Les innholdet

4. **Se protokoll-meldinger**
   - "Messages" viser rå JSON-RPC meldinger
   - Nyttig for debugging

## Vanlige feil og løsninger

### "Server did not respond to initialize"

- Sjekk at serveren skriver til stdout (ikke stderr for data)
- Sjekk at JSON er gyldig

### "Tool not found"

- Verifiser at tool er registrert i tools/list responsen
- Sjekk stavefeil i tool-navn

### "Invalid arguments"

- Sjekk at input-schema matcher det du sender inn
- Verifiser at required-felter er fylt ut

## Tips

- Hold Inspector åpen mens du utvikler
- Restart Inspector etter kode-endringer
- Bruk "Messages" for å se nøyaktig hva som sendes
