package app.multiplayer.demo.opentelemetry;

import io.opentelemetry.api.trace.Span;
// import io.opentelemetry.api.trace.SpanContext;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import io.opentelemetry.api.GlobalOpenTelemetry;
import io.opentelemetry.api.trace.Tracer;
import io.opentelemetry.context.Scope;
import java.io.IOException;

@Component
public class TraceIdResponseHeaderFilter extends OncePerRequestFilter {

    private final Tracer tracer = GlobalOpenTelemetry.getTracer("http-server");

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        Span span = tracer.spanBuilder(request.getMethod() + " " + request.getRequestURI()).startSpan();
        try (Scope scope = span.makeCurrent()) {
            response.addHeader("X-Trace-Id", span.getSpanContext().getTraceId());
            filterChain.doFilter(request, response);
        } finally {
            span.end();
        }
    }
}
