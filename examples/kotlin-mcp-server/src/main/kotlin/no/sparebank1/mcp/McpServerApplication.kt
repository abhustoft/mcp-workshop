package no.sparebank1.mcp

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import org.springframework.boot.CommandLineRunner
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.stereotype.Component
import java.io.BufferedReader
import java.io.InputStreamReader

/**
 * MCP Server implementert i Kotlin med Spring Boot
 *
 * Denne serveren bruker stdio transport for kommunikasjon med Claude.
 * Den eksponerer tools som Claude kan kalle for å utføre operasjoner.
 */
@SpringBootApplication
class McpServerApplication

fun main(args: Array<String>) {
    // Disable web server for stdio mode
    runApplication<McpServerApplication>(*args) {
        setDefaultProperties(mapOf("spring.main.web-application-type" to "none"))
    }
}

@Component
class McpServer(
    private val toolRegistry: ToolRegistry
) : CommandLineRunner {

    private val mapper: ObjectMapper = jacksonObjectMapper()

    override fun run(vararg args: String?) {
        val reader = BufferedReader(InputStreamReader(System.`in`))

        // Send server info on stderr (stdout is for JSON-RPC)
        System.err.println("MCP Server (Kotlin) startet!")

        while (true) {
            val line = reader.readLine() ?: break
            try {
                val request = mapper.readTree(line)
                val response = handleRequest(request)
                println(mapper.writeValueAsString(response))
                System.out.flush()
            } catch (e: Exception) {
                System.err.println("Feil ved håndtering av request: ${e.message}")
            }
        }
    }

    private fun handleRequest(request: com.fasterxml.jackson.databind.JsonNode): Map<String, Any?> {
        val id = request["id"]?.asText()
        val method = request["method"]?.asText() ?: return errorResponse(id, "Missing method")

        return when (method) {
            "initialize" -> initializeResponse(id)
            "tools/list" -> toolsListResponse(id)
            "tools/call" -> toolsCallResponse(id, request["params"])
            "resources/list" -> resourcesListResponse(id)
            "resources/read" -> resourcesReadResponse(id, request["params"])
            else -> errorResponse(id, "Unknown method: $method")
        }
    }

    private fun initializeResponse(id: String?) = mapOf(
        "jsonrpc" to "2.0",
        "id" to id,
        "result" to mapOf(
            "protocolVersion" to "2024-11-05",
            "serverInfo" to mapOf(
                "name" to "kotlin-mcp-server",
                "version" to "1.0.0"
            ),
            "capabilities" to mapOf(
                "tools" to mapOf("listChanged" to false),
                "resources" to mapOf("listChanged" to false)
            )
        )
    )

    private fun toolsListResponse(id: String?) = mapOf(
        "jsonrpc" to "2.0",
        "id" to id,
        "result" to mapOf(
            "tools" to toolRegistry.getTools()
        )
    )

    private fun toolsCallResponse(id: String?, params: com.fasterxml.jackson.databind.JsonNode?) = mapOf(
        "jsonrpc" to "2.0",
        "id" to id,
        "result" to toolRegistry.callTool(
            params?.get("name")?.asText() ?: "",
            params?.get("arguments") ?: mapper.createObjectNode()
        )
    )

    private fun resourcesListResponse(id: String?) = mapOf(
        "jsonrpc" to "2.0",
        "id" to id,
        "result" to mapOf(
            "resources" to listOf(
                mapOf(
                    "uri" to "config://settings",
                    "name" to "Applikasjonskonfigurasjon",
                    "mimeType" to "application/json"
                )
            )
        )
    )

    private fun resourcesReadResponse(id: String?, params: com.fasterxml.jackson.databind.JsonNode?) = mapOf(
        "jsonrpc" to "2.0",
        "id" to id,
        "result" to mapOf(
            "contents" to listOf(
                mapOf(
                    "uri" to params?.get("uri")?.asText(),
                    "mimeType" to "application/json",
                    "text" to """{"environment": "development", "version": "1.0.0"}"""
                )
            )
        )
    )

    private fun errorResponse(id: String?, message: String) = mapOf(
        "jsonrpc" to "2.0",
        "id" to id,
        "error" to mapOf(
            "code" to -32601,
            "message" to message
        )
    )
}
