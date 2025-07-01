package app.multiplayer.demo;

import jakarta.servlet.Filter;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FilterConfig {
    @Bean
    public Filter errorInjectionFilter() {
        return new ErrorInjectionMiddleWare();
    }
}
