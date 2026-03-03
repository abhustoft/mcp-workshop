# Brainstorming: Finn ditt MCP-prosjekt

> **Tips:** Kjør `/mcp-coach` i Claude Code for å få en interaktiv coach som hjelper deg finne ideer og bygge MCP-serveren din steg for steg.

## Målet

Finn ideer som:
- **Effektiviserer din hverdag** - spar tid på repetitive oppgaver
- **Automatiserer prosesser** - la Claude gjøre jobben for deg
- **Skaper verdi for bankene og kundene** - bedre tjenester, raskere svar

---

## Spørsmål å stille deg selv

### 1. Din arbeidshverdag
- Hvilke systemer logger du inn på daglig?
- Hva copy-paster du ofte mellom systemer?
- Hvilke oppslag gjør du igjen og igjen?
- Hvor venter du på svar fra andre systemer?

### 2. Prosesser som kan forbedres
- Hvilke manuelle steg kunne vært automatisert?
- Hvor går informasjon gjennom flere ledd unødvendig?
- Hva tar lang tid som burde gått fort?

### 3. Verdi for bank og kunde
- Hva ville gjort kundene mer fornøyde?
- Hvilken informasjon burde vært lettere tilgjengelig?
- Hvor kan vi svare raskere eller mer presist?

### 4. Hva skulle du ønske Claude kunne gjort?
- "Hadde vært fint om Claude kunne sjekket..."
- "Jeg bruker mye tid på å finne ut..."
- "Kundene spør ofte om X, og da må jeg..."

---

## Mal for å beskrive ideen din

Fyll ut denne malen (i hodet eller på papir):

```
Jeg vil at Claude skal kunne [handling]
ved å snakke med [system/API/database]
slik at [effekt: tidsbesparelse / bedre kvalitet / verdi for kunde]
```

**Eksempler - Effektivisere hverdagen:**

> Jeg vil at Claude skal kunne **sjekke status på deployments**
> ved å snakke med **Kubernetes API**
> slik at **jeg får svar på sekunder i stedet for å navigere i dashboards**

> Jeg vil at Claude skal kunne **finne dokumentasjon**
> ved å snakke med **Confluence API**
> slik at **jeg finner riktig info uten å lete i wiki-strukturen**

**Eksempler - Automatisere prosesser:**

> Jeg vil at Claude skal kunne **generere statusrapporter**
> ved å snakke med **Jira og GitHub**
> slik at **ukentlig rapportering tar minutter i stedet for timer**

> Jeg vil at Claude skal kunne **validere konfigurasjoner**
> ved å snakke med **våre config-APIer**
> slik at **feil fanges automatisk før deploy**

**Eksempler - Verdi for bank og kunde:**

> Jeg vil at Claude skal kunne **slå opp produktinformasjon**
> ved å snakke med **produkt-APIet**
> slik at **jeg kan svare kunder raskere og mer presist**

> Jeg vil at Claude skal kunne **hente transaksjonshistorikk**
> ved å snakke med **konto-APIet**
> slik at **feilsøking av kundehenvendelser går raskere**

---

---

## Øvelse 1: Kartlegg hverdagen din (10 min)

Jobb individuelt eller i par. Skriv ned:

**Systemer jeg bruker daglig:**
```
1. ____________________
2. ____________________
3. ____________________
```

**Ting jeg gjør flere ganger om dagen:**
```
1. ____________________
2. ____________________
3. ____________________
```

**Informasjon jeg ofte må lete etter:**
```
1. ____________________
2. ____________________
3. ____________________
```

---

## Øvelse 2: Finn MCP-muligheter (10 min)

For hver ting du skrev ned, spør deg selv:
- Har dette et API?
- Kunne Claude hentet dette for meg?
- Ville det spart meg tid?

**Mine topp 3 MCP-ideer:**
```
1. ____________________
2. ____________________
3. ____________________
```

**Bonus - ideer som ikke trenger MCP (slash commands, skills):**
```
1. ____________________
2. ____________________
```

---

## Øvelse 3: Velg én idé (5 min)

Hvilken idé vil du jobbe med i dag?

Velg basert på:
- **Nytteverdi** - Hvor mye tid sparer du?
- **Gjennomførbarhet** - Har du tilgang til APIet?
- **Interesse** - Hva har du lyst til å lage?

---

## Pitch din idé (etter brainstorming)

Si kort:
1. **Hva** - Hva skal Claude kunne gjøre?
2. **Hvorfor** - Hva sparer du tid på?
3. **Hvordan** - Hvilket system/API?

Andre kan si "jeg vil være med!" og dere danner grupper.

---

## Neste steg etter pitching

Når du har valgt prosjekt:

```bash
# La Claude hjelpe deg starte
claude "jeg vil lage en MCP-server som [din idé].
        hjelp meg finne ut hvilke tools jeg trenger
        og hvordan jeg kan integrere med [system/API]"
```

---

## Fasilitator-tips

- Ikke vær redd for halvferdige ideer
- "Jeg vet ikke helt hvordan, men..." er en god start
- Alle ideer er gode - vi har Claude til å hjelpe!
- Grupper på 2-3 fungerer bra
