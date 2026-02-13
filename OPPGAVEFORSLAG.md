# Fasilitator-guide: Hjelp folk finne ideer

Målet er at deltakerne finner **egne ideer** basert på sin hverdag. Bruk spørsmålene under for å hjelpe dem i gang.

---

## Spørsmål å stille

### Om hverdagen
- "Hva er det første du sjekker når du starter arbeidsdagen?"
- "Hvilke systemer logger du inn på flere ganger daglig?"
- "Hva copy-paster du mellom systemer?"
- "Hvor venter du på informasjon?"

### Om effektivisering
- "Hva tar unødvendig lang tid i arbeidsflyten din?"
- "Hvilke manuelle steg kunne vært automatisert?"
- "Hva gjør du som andre på teamet også gjør?"

### Om verdi
- "Hvilken informasjon må du ofte slå opp for å svare på spørsmål?"
- "Hva ville gjort at du kunne hjulpet noen raskere?"
- "Hva skulle du ønske du kunne spurt Claude om akkurat nå?"

### Om systemer
- "Hvilke systemer bruker du som har API?"
- "Hvor henter du data fra som Claude ikke har tilgang til?"

---

## Kategorier som kan inspirere

Hvis noen trenger retning, foreslå å tenke innenfor én av disse:

| Kategori | Eksempler |
|----------|-----------|
| **Statussjekk** | Deploy-status, pipeline-status, service-helse |
| **Oppslag** | Dokumentasjon, konfigurasjon, produktinfo |
| **Rapportering** | Sprint-status, changelog, metrics |
| **Validering** | Config-sjekk, data-kvalitet, compliance |
| **Integrasjon** | Jira, Confluence, Slack, GitHub, K8s |

---

## Hvis noen virkelig står fast

Foreslå en av disse som utgangspunkt:

**Enkel:** "Hva om du laget en MCP-server som sjekker status på noe du sjekker manuelt i dag?"

**Middels:** "Hva om Claude kunne søke i dokumentasjonen deres?"

**Avansert:** "Hva om du kunne spørre Claude om status på alle deployments?"

---

## Quick-start for de som har funnet idé

```bash
# Bruk coachen
/mcp-coach

# Eller start direkte
claude "hjelp meg lage en MCP-server som [beskriv idé]"
```

---

## Husk

- La folk finne sine egne behov - det gir mest engasjement
- Start enkelt - én tool er nok
- Fokus på noe som faktisk sparer tid eller skaper verdi
