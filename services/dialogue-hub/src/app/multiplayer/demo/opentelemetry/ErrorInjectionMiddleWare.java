package app.multiplayer.demo.opentelemetry;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import io.opentelemetry.api.trace.Span;
import io.opentelemetry.api.trace.SpanContext;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.List;
import java.util.Random;

@Component
public class ErrorInjectionMiddleWare implements Filter {

    private final List<String> funnyMessages = List.of(
            "Chatbots unionized. They're demanding better puns.",
            "We ran out of small talk. Please try again later.",
            "Dialogue buffer overflowed with emoji 🫠",
            "Our server tried to ghost you. Typical.",
            "Conversation derailed by a rogue haiku.",
            "Your witty reply crashed the sarcasm detector.",
            "The dialogue engine overheard a spoiler and quit.",
            "Semantic conflict: response had an existential crisis.",
            "AI got into a heated debate with itself. No survivors.",
            "Dialogue queue got stuck in an awkward silence."
    );

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) res;

        String path = request.getRequestURI();
        if (path.contains("docs") || path.contains("swagger") || path.contains("health")) {
            chain.doFilter(req, res);
            return;
        }

        double errorRate = Config.RANDOM_ERROR_RATE;
        String errorRateParam = request.getParameter("errorRate");
        if (errorRateParam != null) {
            try {
                double val = Double.parseDouble(errorRateParam);
                if (val >= 0 && val <= 1) {
                    errorRate = val;
                }
            } catch (NumberFormatException ignored) {
            }
        }

        Span span = Span.current();
        SpanContext sc = span.getSpanContext();
        if (sc.isValid()) {
            String traceId = sc.getTraceId();
            response.setHeader("X-Trace-ID", traceId);

            long seed = traceId.hashCode();
            Random random = new Random(seed);

            if (random.nextDouble() < errorRate) {
                String message = funnyMessages.get(random.nextInt(funnyMessages.size()));

                response.setContentType("application/json");
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                String json = String.format("{\"message\":\"%s\",\"code\":\"WARP_ENGINE_ERROR\"}", message);
                response.getWriter().write(json);
                return;
            }
        }

        chain.doFilter(req, res);
    }
}
