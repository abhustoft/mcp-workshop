# MCP Server Workshop

En 2-timers workshop om å bygge MCP-servere (Model Context Protocol) som Claude kan bruke.

## Agenda (120 min)

| Tid         | Innhold                                                  |
| ----------- | -------------------------------------------------------- |
| 0-15 min    | **Intro:** Hva er MCP? Når bruke det?                    |
| 15-25 min   | **Demo:** Vis eksempel-server i Inspector + Claude       |
| 25-40 min   | **Idégenerering:** Finn behov og muligheter              |
| 40-55 min   | **Pitching:** Del ideer, dann grupper                    |
| 55-60 min   | **Pause** (frivillig)                                    |
| 60-110 min  | **Koding:** Bygg MCP-server (50 min)                     |
| 110-120 min | **Demo + oppsummering:** Vis frem + neste steg           |

## Arbeidsformer

- **Brainstorm først:** Tenk på hva DU trenger i arbeidshverdagen
- **Pitch ideen din:** Kort pitch, andre kan bli med
- **Jobb alene eller i gruppe:** Finn det som passer deg
- **Har du et eget prosjekt?** Jobb gjerne videre med det

## Forutsetninger

- Claude Code installert
- Node.js 18+ eller JDK 21+

## Dokumenter

| Fil                 | Innhold                                             |
| ------------------- | --------------------------------------------------- |
| `INTRO.md`          | Slides/intro-materiale (10 min)                     |
| `BRAINSTORMING.md`  | Øvelse for å finne din egen idé                     |
| `OPPGAVER.md`       | Guidede oppgaver for de som vil følge steg-for-steg |
| `OPPGAVEFORSLAG.md` | Backup-ideer (for fasilitator)                      |
| `MCP-INSPECTOR.md`  | Hvordan teste MCP-serveren din                      |
| `CLAUDE-OPPSETT.md` | Hvordan koble serveren til Claude                   |

## Eksempler

- `examples/node-mcp-server/` - Node.js MCP-server
- `examples/kotlin-mcp-server/` - Kotlin/Spring Boot MCP-server

## Kom i gang

```bash
# Bruk MCP-coachen for å bli guidet gjennom prosessen
/mcp-coach

# Eller se på eksemplene direkte
claude "les gjennom examples/node-mcp-server og forklar hvordan det fungerer"

# Test med Inspector
npx @modelcontextprotocol/inspector node din-server.js
```

## MCP Coach

Kjør `/mcp-coach` for å få en veiledende coach som hjelper deg:

- Finne ut hva du trenger
- Designe tools
- Implementere steg-for-steg
- Teste og koble til Claude

Coachen lager et worksheet (`mcp-worksheet.md`) som dokumenterer valgene dine underveis.

## For fasilitatorer

Se `OPPGAVEFORSLAG.md` for ideer du kan foreslå til deltakere som står fast.
