package app.multiplayer.demo;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

@RestController
public class HealthzController {

  @GetMapping(value = "/healthz", produces = MediaType.TEXT_PLAIN_VALUE)
  @Operation(summary = "Get service health", responses = {
      @ApiResponse(responseCode = "200", description = "Health response", 
          content = @Content(mediaType = "text/plain", schema = @Schema(implementation = String.class)))
  })
  public ResponseEntity<?> checkHealth(
  ) {
      return ResponseEntity.ok("OK");
  }
}
