package app.multiplayer.demo;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import java.util.UUID;
import java.util.Map;
import java.util.HashMap;
import java.util.List;
import java.util.ArrayList;

@RestController
@RequestMapping("/openrouter")
public class OpenRouterController {

  private final RestTemplate restTemplate = new RestTemplate();
  private final RedisContextService redisContextService;

  public OpenRouterController(RedisContextService redisContextService) {
    this.redisContextService = redisContextService;
  }

  @PostMapping(value = "/messages", produces = MediaType.APPLICATION_JSON_VALUE)
  @Operation(summary = "Send a message to OpenRouter", description = "Sends a message to the OpenRouter API and returns the assistant's response.", requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(required = true, content = @Content(schema = @Schema(implementation = MessageRequest.class))), responses = {
      @ApiResponse(responseCode = "200", description = "Assistant response", content = @Content(schema = @Schema(implementation = MessageResponse.class))),
      @ApiResponse(responseCode = "400", description = "Bad request"),
      @ApiResponse(responseCode = "500", description = "Server error")
  })
  // @ResponseBody
  public ResponseEntity<?> sendMessageToOpenRouter(
    @Parameter(
      name = "errorRate",
      in = ParameterIn.QUERY,
      description = "Probability of random error injection, between 0 and 1",
      required = false,
      schema = @Schema(type = "number", format = "double", minimum = "0", maximum = "1")
    )
    @RequestParam(name = "errorRate", required = false) Double errorRate,
    @RequestBody MessageRequest request
  ) {
    String contextId = request.getContextId();
    String userMessage = request.getMessage() != null ? request.getMessage() : "";

    if (userMessage.isBlank()) {
      return ResponseEntity.badRequest().body(Map.of("error", "Message cannot be empty"));
    }

    if (contextId == null || contextId.isEmpty()) {
      contextId = UUID.randomUUID().toString();
    }

    if (Config.OPENAI_API_KEY == null || Config.OPENAI_API_KEY.isEmpty()) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(Map.of("error", "OpenRouter API key is not configured"));
    }

    // Load existing context or create new
    List<Object> context = redisContextService.getContext(contextId);
    if (context == null) {
      context = new ArrayList<>();
    }

    // Add user message to context
    Map<String, String> userMessageEntry = Map.of(
        "role", "user",
        "content", userMessage);
    context.add(userMessageEntry);

    // Prepare payload for OpenRouter
    Map<String, Object> messagePayload = new HashMap<>();
    messagePayload.put("model", Config.OPENAI_MODEL);
    messagePayload.put("messages", context);

    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    headers.setBearerAuth(Config.OPENAI_API_KEY);

    HttpEntity<Map<String, Object>> openrouterRequest = new HttpEntity<>(messagePayload, headers);

    String reply = "";

    try {
      ResponseEntity<String> response = restTemplate.postForEntity(
          Config.OPENAI_API_URL,
          openrouterRequest,
          String.class);

      if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
        // Parse assistant response from JSON
        // Assuming OpenRouter returns JSON with "choices"[0]."message" structure
        Map<?, ?> responseBody = new com.fasterxml.jackson.databind.ObjectMapper().readValue(response.getBody(),
            Map.class);
        List<?> choices = (List<?>) responseBody.get("choices");
        if (choices != null && !choices.isEmpty()) {
          Map<?, ?> firstChoice = (Map<?, ?>) choices.get(0);
          Map<?, ?> assistantMessage = (Map<?, ?>) firstChoice.get("message");

          if (assistantMessage != null) {
            reply = (String) assistantMessage.get("content");

            context.add(assistantMessage);
            redisContextService.saveContext(contextId, context);
          }
        }
      }

      return ResponseEntity.status(response.getStatusCode()).body(new MessageResponse(reply, contextId));
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(Map.of("error", "Failed to send message to OpenRouter", "details", e.getMessage()));
    }
  }
}
