package app.multiplayer.demo.opentelemetry;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Response returned by the assistant")
public class MessageResponse {

    @Schema(description = "Generated response from assistant", example = "I'm doing well, how can I help?")
    private String reply;

    public MessageResponse(String reply) {
        this.reply = reply;
    }

    public String getReply() {
        return reply;
    }

    public void setReply(String reply) {
        this.reply = reply;
    }
}
