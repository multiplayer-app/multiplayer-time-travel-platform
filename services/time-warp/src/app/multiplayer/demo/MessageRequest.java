package app.multiplayer.demo;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Request body for sending a message")
public class MessageRequest {

    @Schema(description = "Message text from the user", example = "Hi, how are you?")
    private String message;

    @Schema(description = "Optional context ID to maintain chat state", example = "abc123")
    private String contextId;

    public String getMessage() {
        return this.message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getContextId() {
        return this.contextId;
    }

    public void setContextId(String contextId) {
        this.contextId = contextId;
    }
}
