#!/usr/bin/env node

/**
 * MCP-server for Boliglånskalkulator
 *
 * Gjør Claude til en boliglånsrådgiver ved å koble til
 * api-pm-boliglan-kalkulator for beregninger av låneevne,
 * nedbetalingsplan, skatt, levekostnader og mer.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const BASE_URL = process.env.KALKULATOR_BASE_URL || "http://localhost:8080";
const API_PATH = "/api/personal/banking/boliglan-kalkulator";

const server = new McpServer({
  name: "boliglan-kalkulator",
  version: "1.0.0",
});

// ============================================
// Hjelpefunksjon for API-kall
// ============================================

async function apiCall(endpoint: string, body: unknown): Promise<string> {
  const url = `${BASE_URL}${API_PATH}${endpoint}`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/vnd.sparebank1.v1+json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return JSON.stringify({
        error: true,
        status: response.status,
        message: errorText || response.statusText,
      }, null, 2);
    }

    return JSON.stringify(await response.json(), null, 2);
  } catch (error) {
    return JSON.stringify({
      error: true,
      message: error instanceof Error ? error.message : "Ukjent feil ved API-kall",
      url,
    }, null, 2);
  }
}

// ============================================
// TOOLS
// ============================================

// Tool 1: Enkel låneevne
server.registerTool(
  "beregn_laaneevne",
  {
    description:
      "Beregn enkel låneevne basert på inntekt, gjeld, antall barn og biler. " +
      "Gir et raskt estimat på hvor mye man kan låne til bolig.",
    inputSchema: {
      samlet_inntekt: z.number().describe("Samlet årsinntekt før skatt (kr)"),
      samlet_gjeld: z.number().default(0).describe("Eksisterende lån og gjeld (kr)"),
      antall_laantakere: z.number().min(1).max(2).default(1).describe("Antall låntakere (1 eller 2)"),
      antall_barn: z.number().min(0).default(0).describe("Antall barn under 18 år"),
      antall_biler: z.number().min(0).default(0).describe("Antall biler"),
    },
  },
  async ({ samlet_inntekt, samlet_gjeld, antall_laantakere, antall_barn, antall_biler }) => {
    const result = await apiCall("/laaneevne", {
      samletInntektForSkatt: samlet_inntekt,
      samletLaanOgGjeld: samlet_gjeld,
      antallLaantakere: antall_laantakere,
      antallBarnUnder18: antall_barn,
      antallBiler: antall_biler,
    });
    return { content: [{ type: "text" as const, text: result }] };
  }
);

// Tool 2: Full låneevne (borrowing capacity)
server.registerTool(
  "beregn_full_laaneevne",
  {
    description:
      "Beregn komplett låneevne med detaljert skatt, SIFO-levekostnader og boutgifter. " +
      "Tar hensyn til alder, kjønn, ansettelsesforhold, barn og biler for nøyaktig beregning.",
    inputSchema: {
      person1_alder: z.number().describe("Alder på hovedlåntaker"),
      person1_kjonn: z.enum(["Male", "Female"]).describe("Kjønn på hovedlåntaker"),
      person1_inntekt: z.number().describe("Brutto årsinntekt for hovedlåntaker (kr)"),
      person1_ansettelse: z.enum(["Employed", "Retired"]).default("Employed").describe("Ansettelsesstatus"),
      person2_alder: z.number().optional().describe("Alder på medlåntaker (valgfritt)"),
      person2_kjonn: z.enum(["Male", "Female"]).optional().describe("Kjønn på medlåntaker"),
      person2_inntekt: z.number().optional().describe("Brutto årsinntekt for medlåntaker (kr)"),
      person2_ansettelse: z.enum(["Employed", "Retired"]).optional().describe("Ansettelsesstatus for medlåntaker"),
      antall_bensinbiler: z.number().min(0).default(0).describe("Antall bensinbiler"),
      antall_elbiler: z.number().min(0).default(0).describe("Antall elbiler"),
      eksisterende_boliglan: z.number().default(0).describe("Eksisterende boliglån (kr)"),
      skatteaar: z.string().default("2026").describe("Skatteår (2024, 2025 eller 2026)"),
    },
  },
  async (input) => {
    const body: Record<string, unknown> = {
      person1: {
        age: input.person1_alder,
        gender: input.person1_kjonn,
        grossSalary: input.person1_inntekt,
        employmentStatus: input.person1_ansettelse,
      },
      numberOfPetrolCars: input.antall_bensinbiler,
      numberOfElectricCars: input.antall_elbiler,
      currentMortgageLoanAmount: input.eksisterende_boliglan,
      taxYear: input.skatteaar,
    };

    if (input.person2_alder !== undefined) {
      body.person2 = {
        age: input.person2_alder,
        gender: input.person2_kjonn,
        grossSalary: input.person2_inntekt,
        employmentStatus: input.person2_ansettelse || "Employed",
      };
    }

    const result = await apiCall("/borrowing-capacity", body);
    return { content: [{ type: "text" as const, text: result }] };
  }
);

// Tool 3: Nedbetalingsplan (annuitetslån)
server.registerTool(
  "beregn_nedbetalingsplan",
  {
    description:
      "Beregn nedbetalingsplan for annuitetslån med månedlige detaljer. " +
      "Viser terminbeløp, renter, avdrag, skattefradrag og effektiv rente.",
    inputSchema: {
      boligpris: z.number().describe("Kjøpepris for boligen (kr)"),
      egenkapital: z.number().describe("Egenkapital / kontantinnskudd (kr)"),
      rente: z.number().default(5.04).describe("Nominell rente i prosent (f.eks. 5.04)"),
      nedbetalingstid_aar: z.number().default(25).describe("Nedbetalingstid i år"),
      avdragsfrie_aar: z.number().default(0).describe("Antall avdragsfrie år i starten"),
      skattefradrag_sats: z.number().default(0.22).describe("Skattefradragssats for renteutgifter (f.eks. 0.22)"),
      etableringsgebyr: z.number().default(1000).describe("Etableringsgebyr (kr)"),
      maanedlig_gebyr: z.number().default(60).describe("Månedlig termingebyr (kr)"),
    },
  },
  async (input) => {
    const now = new Date();
    const result = await apiCall("/annuity-loan", {
      loanRaisingYear: now.getFullYear(),
      loanRaisingMonth: now.getMonth() + 1,
      purchasePrice: input.boligpris,
      equity: input.egenkapital,
      interestRate: input.rente,
      feeEstablishment: input.etableringsgebyr,
      feeMonthly: input.maanedlig_gebyr,
      taxDeductionRate: input.skattefradrag_sats,
      loanTermYears: input.nedbetalingstid_aar,
      interestOnlyYears: input.avdragsfrie_aar,
    });
    return { content: [{ type: "text" as const, text: result }] };
  }
);

// Tool 4: Skatteberegning
server.registerTool(
  "beregn_skatt",
  {
    description:
      "Beregn norsk inntektsskatt med trinnskatt, trygdeavgift og skattefradrag for boliglån. " +
      "Støtter både ansatte og pensjonister.",
    inputSchema: {
      bruttoinntekt: z.number().describe("Brutto årsinntekt (kr)"),
      ansettelse: z.enum(["Employed", "Retired"]).default("Employed").describe("Ansatt eller pensjonist"),
      har_partner: z.boolean().default(false).describe("Gift/samboer"),
      antall_barn_i_barnehage: z.number().default(0).describe("Antall barn med betalt barnepass"),
      eksisterende_boliglan: z.number().optional().describe("Eksisterende boliglån for rentefradrag (kr)"),
      skatteaar: z.string().default("2026").describe("Skatteår (2024, 2025 eller 2026)"),
    },
  },
  async (input) => {
    const body: Record<string, unknown> = {
      grossSalary: input.bruttoinntekt,
      employmentStatus: input.ansettelse,
      partnered: input.har_partner,
      numberOfChildrenInPaidCare: input.antall_barn_i_barnehage,
      taxYear: input.skatteaar,
    };

    if (input.eksisterende_boliglan !== undefined) {
      body.mortgageLoanAmount = input.eksisterende_boliglan;
    }

    const result = await apiCall("/tax", body);
    return { content: [{ type: "text" as const, text: result }] };
  }
);

// Tool 5: Maks lån fra månedlig betaling
server.registerTool(
  "beregn_maks_laan",
  {
    description:
      "Beregn maksimalt lånebeløp ut fra hvor mye du kan betale per måned. " +
      "Nyttig for å finne ut hva du har råd til basert på budsjettet ditt.",
    inputSchema: {
      maanedlig_betaling: z.number().describe("Beløp du kan betale per måned (kr)"),
      rente: z.number().default(5.04).describe("Nominell rente i prosent"),
      nedbetalingstid_aar: z.number().default(25).describe("Nedbetalingstid i år"),
      avdragsfrie_aar: z.number().default(0).describe("Antall avdragsfrie år"),
      etableringsgebyr: z.number().default(1000).describe("Etableringsgebyr (kr)"),
      maanedlig_gebyr: z.number().default(60).describe("Månedlig termingebyr (kr)"),
      skattefradrag_sats: z.number().default(0.0).describe("Skattefradragssats (f.eks. 0.22)"),
    },
  },
  async (input) => {
    const result = await apiCall("/max-loan", {
      monthlyPayment: input.maanedlig_betaling,
      interestRate: input.rente,
      loanTermYears: input.nedbetalingstid_aar,
      interestOnlyYears: input.avdragsfrie_aar,
      feeEstablishment: input.etableringsgebyr,
      feeMonthly: input.maanedlig_gebyr,
      taxDeductionRate: input.skattefradrag_sats,
    });
    return { content: [{ type: "text" as const, text: result }] };
  }
);

// Tool 6: Boutgifter
server.registerTool(
  "beregn_boutgifter",
  {
    description:
      "Beregn estimerte årlige boutgifter (strøm, forsikring, eiendomsskatt, vedlikehold). " +
      "Basert på husholdningsstørrelse.",
    inputSchema: {
      antall_voksne: z.number().min(1).max(2).describe("Antall voksne i husstanden"),
      antall_barn: z.number().min(0).describe("Antall barn i husstanden"),
    },
  },
  async ({ antall_voksne, antall_barn }) => {
    const result = await apiCall("/dwelling-expense", {
      numberOfAdults: antall_voksne,
      numberOfChildren: antall_barn,
    });
    return { content: [{ type: "text" as const, text: result }] };
  }
);

// Tool 7: SIFO levekostnader
server.registerTool(
  "beregn_levekostnader",
  {
    description:
      "Beregn SIFO-standardbudsjett for levekostnader (mat, klær, helse, fritid, transport). " +
      "Bruker SIFOs referansebudsjett basert på husholdningens sammensetning.",
    inputSchema: {
      person1_alder: z.number().describe("Alder på person 1"),
      person1_kjonn: z.enum(["Male", "Female"]).describe("Kjønn på person 1"),
      person2_alder: z.number().optional().describe("Alder på person 2 (valgfritt)"),
      person2_kjonn: z.enum(["Male", "Female"]).optional().describe("Kjønn på person 2"),
      antall_bensinbiler: z.number().min(0).default(0).describe("Antall bensinbiler"),
      antall_elbiler: z.number().min(0).default(0).describe("Antall elbiler"),
      skatteaar: z.string().default("2026").describe("Skatteår"),
    },
  },
  async (input) => {
    const body: Record<string, unknown> = {
      person1: { age: input.person1_alder, gender: input.person1_kjonn },
      numberOfPetrolCars: input.antall_bensinbiler,
      numberOfElectricCars: input.antall_elbiler,
      taxYear: input.skatteaar,
    };

    if (input.person2_alder !== undefined) {
      body.person2 = { age: input.person2_alder, gender: input.person2_kjonn };
    }

    const result = await apiCall("/sifo", body);
    return { content: [{ type: "text" as const, text: result }] };
  }
);

// ============================================
// START SERVER
// ============================================

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Boliglånskalkulator MCP-server startet!");
  console.error(`API: ${BASE_URL}${API_PATH}`);
}

main().catch(console.error);
