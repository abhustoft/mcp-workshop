package no.sparebank1.mcp

import com.fasterxml.jackson.databind.JsonNode
import org.springframework.stereotype.Component
import kotlin.random.Random

/**
 * Registry for MCP tools.
 *
 * Her definerer du alle tools som Claude kan kalle.
 * Hver tool har et navn, beskrivelse, input-schema og en handler-funksjon.
 */
@Component
class ToolRegistry {

    /**
     * Returnerer listen over tilgjengelige tools.
     * Denne kalles av MCP-protokollen for å fortelle Claude hvilke tools som finnes.
     */
    fun getTools(): List<Map<String, Any>> = listOf(
        mapOf(
            "name" to "get_weather",
            "description" to "Hent værdata for en gitt by",
            "inputSchema" to mapOf(
                "type" to "object",
                "properties" to mapOf(
                    "city" to mapOf(
                        "type" to "string",
                        "description" to "Navnet på byen"
                    )
                ),
                "required" to listOf("city")
            )
        ),
        mapOf(
            "name" to "search_documents",
            "description" to "Søk etter dokumenter basert på en spørring",
            "inputSchema" to mapOf(
                "type" to "object",
                "properties" to mapOf(
                    "query" to mapOf(
                        "type" to "string",
                        "description" to "Søketekst"
                    ),
                    "limit" to mapOf(
                        "type" to "integer",
                        "description" to "Maks antall resultater",
                        "default" to 5
                    )
                ),
                "required" to listOf("query")
            )
        ),
        mapOf(
            "name" to "calculate",
            "description" to "Utfør en matematisk beregning",
            "inputSchema" to mapOf(
                "type" to "object",
                "properties" to mapOf(
                    "a" to mapOf(
                        "type" to "number",
                        "description" to "Første tall"
                    ),
                    "b" to mapOf(
                        "type" to "number",
                        "description" to "Andre tall"
                    ),
                    "operation" to mapOf(
                        "type" to "string",
                        "description" to "Operasjon: add, subtract, multiply, divide",
                        "enum" to listOf("add", "subtract", "multiply", "divide")
                    )
                ),
                "required" to listOf("a", "b", "operation")
            )
        )
    )

    /**
     * Kaller en tool med gitte argumenter.
     * Denne metoden routes kallet til riktig handler basert på tool-navnet.
     */
    fun callTool(name: String, arguments: JsonNode): Map<String, Any> {
        return when (name) {
            "get_weather" -> handleGetWeather(arguments)
            "search_documents" -> handleSearchDocuments(arguments)
            "calculate" -> handleCalculate(arguments)
            else -> errorContent("Ukjent tool: $name")
        }
    }

    // ============================================
    // TOOL HANDLERS
    // ============================================

    private fun handleGetWeather(args: JsonNode): Map<String, Any> {
        val city = args["city"]?.asText() ?: return errorContent("Mangler 'city' parameter")

        // I virkeligheten ville du kalt et vær-API her
        val weather = mapOf(
            "city" to city,
            "temperature" to Random.nextInt(-5, 30),
            "conditions" to listOf("Solskinn", "Overskyet", "Regn", "Snø").random(),
            "humidity" to Random.nextInt(0, 100)
        )

        return successContent(weather.toString())
    }

    private fun handleSearchDocuments(args: JsonNode): Map<String, Any> {
        val query = args["query"]?.asText() ?: return errorContent("Mangler 'query' parameter")
        val limit = args["limit"]?.asInt() ?: 5

        // Simulerte søkeresultater
        val results = listOf(
            mapOf("id" to 1, "title" to "Årsrapport 2024", "snippet" to "Finansielle resultater..."),
            mapOf("id" to 2, "title" to "Produktdokumentasjon", "snippet" to "Brukerveiledning for..."),
            mapOf("id" to 3, "title" to "API-spesifikasjon", "snippet" to "REST endpoints for...")
        ).take(limit)

        return successContent("Fant ${results.size} dokumenter for '$query': $results")
    }

    private fun handleCalculate(args: JsonNode): Map<String, Any> {
        val a = args["a"]?.asDouble() ?: return errorContent("Mangler 'a' parameter")
        val b = args["b"]?.asDouble() ?: return errorContent("Mangler 'b' parameter")
        val operation = args["operation"]?.asText() ?: return errorContent("Mangler 'operation' parameter")

        val result = when (operation) {
            "add" -> a + b
            "subtract" -> a - b
            "multiply" -> a * b
            "divide" -> if (b != 0.0) a / b else return errorContent("Kan ikke dele på null")
            else -> return errorContent("Ukjent operasjon: $operation")
        }

        return successContent("$a $operation $b = $result")
    }

    // ============================================
    // HELPER FUNCTIONS
    // ============================================

    private fun successContent(text: String) = mapOf(
        "content" to listOf(
            mapOf(
                "type" to "text",
                "text" to text
            )
        )
    )

    private fun errorContent(message: String) = mapOf(
        "content" to listOf(
            mapOf(
                "type" to "text",
                "text" to "Feil: $message"
            )
        ),
        "isError" to true
    )
}
