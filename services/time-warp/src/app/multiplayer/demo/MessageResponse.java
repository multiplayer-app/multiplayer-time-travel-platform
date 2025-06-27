package app.multiplayer.demo;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Response returned by the assistant")
public class MessageResponse {

    @Schema(description = "Generated response from assistant", example = "I'm doing well, how can I help?")
    private String reply;
    private String contextId;

    public MessageResponse(String reply, String contextId) {
        this.reply = reply;
        this.contextId = contextId;
    }

    public String getReply() {
        return reply;
    }

    public void setReply(String reply) {
        this.reply = reply;
    }

    public String getContextId() {
        return contextId;
    }

    public void setContextId(String contextId) {
        this.contextId = contextId;
    }
}
