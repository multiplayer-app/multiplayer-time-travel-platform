package app.multiplayer.demo;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.List;

@Service
public class RedisContextService {

    private final RedisTemplate<String, Object> redisTemplate;

    public RedisContextService(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    // Save context with TTL (e.g., 30 minutes)
    public void saveContext(String key, List<Object> context) {
        redisTemplate.opsForValue().set(key, context, Duration.ofMinutes(30));
    }

    // Get context
    @SuppressWarnings("unchecked")
    public List<Object> getContext(String key) {
        return (List<Object>) redisTemplate.opsForValue().get(key);
    }

    // Delete context (optional)
    public void deleteContext(String key) {
        redisTemplate.delete(key);
    }
}
