package app.multiplayer.demo.opentelemetry;

import io.opentelemetry.api.OpenTelemetry;
import io.opentelemetry.api.trace.Span;
import io.opentelemetry.api.trace.Tracer;
import org.springframework.boot.Banner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


@SpringBootApplication
public class App {

  public static void main(String[] args) {
    System.out.println("----------------INIT-------------------------");
        

    OpenTelemetryConfig.initialize();

    SpringApplication app = new SpringApplication(App.class);
    app.setBannerMode(Banner.Mode.OFF);
    app.run(args);
  }
}
