use proxy_wasm::traits::*;
use proxy_wasm::types::*;
use proxy_wasm::hostcalls::log;
use serde_json::{json, Value};
use quick_xml::Reader;
use std::collections::HashMap;
use std::time::Duration;
use uuid::Uuid;

proxy_wasm::main! {{
    proxy_wasm::set_log_level(LogLevel::Trace);
    proxy_wasm::set_root_context(|_| -> Box<dyn RootContext> { Box::new(OtlpRoot { otlp_collector_url: None }) });
}}

struct OtlpRoot {
    otlp_collector_url: Option<String>,
}

impl Context for OtlpRoot {}

impl RootContext for OtlpRoot {
    fn get_type(&self) -> Option<ContextType> {
        Some(ContextType::HttpContext)
    }

    fn create_http_context(&self, _: u32) -> Option<Box<dyn HttpContext>> {
        Some(Box::new(OtlpHttpContext {
            otlp_collector_url: self.otlp_collector_url.clone(),
            request_headers: HashMap::new(),
            response_headers: HashMap::new(),
            request_body: String::new(),
            response_body: String::new(),
            trace_id: None,
            span_id: None,
            new_span_id: None,
            start_time: None,
        }))
    }

    fn on_configure(&mut self, _: usize) -> bool {
        // Get OTLP collector URL from configuration
        if let Some(config_bytes) = self.get_plugin_configuration() {
            if let Ok(config_str) = String::from_utf8(config_bytes) {
                if let Ok(config) = serde_json::from_str::<serde_json::Value>(&config_str) {
                    if let Some(otlp_url) = config["otlp_collector_url"].as_str() {
                        self.otlp_collector_url = Some(otlp_url.to_string());
                        log(LogLevel::Info, &format!("OTLP collector URL configured: {}", otlp_url));
                        return true;
                    }
                }
            }
        }
        log(LogLevel::Warn, "No OTLP collector URL configured");
        false
    }
}

struct OtlpHttpContext {
    otlp_collector_url: Option<String>,
    request_headers: HashMap<String, String>,
    response_headers: HashMap<String, String>,
    request_body: String,
    response_body: String,
    trace_id: Option<String>,
    span_id: Option<String>,
    new_span_id: Option<String>,
    start_time: Option<u64>,
}

impl Context for OtlpHttpContext {}

impl HttpContext for OtlpHttpContext {
    fn on_http_request_headers(&mut self, _: usize, _: bool) -> Action {
        // Capture request headers
        self.request_headers.clear();
        self.get_http_request_headers().into_iter().for_each(|(k, v)| {
            self.request_headers.insert(k, v);
        });

        // Log captured request headers
        log(LogLevel::Info, &format!("CAPTURED_REQUEST_HEADERS: {}", serde_json::to_string(&self.request_headers).unwrap_or_default()));

        // Check for OTLP headers
        let traceparent = self.request_headers.get("traceparent");
        let b3 = self.request_headers.get("b3");
        let x_trace_id = self.request_headers.get("x-trace-id");
        let x_span_id = self.request_headers.get("x-span-id");

        if traceparent.is_some() || b3.is_some() || (x_trace_id.is_some() && x_span_id.is_some()) {
            // Extract trace and span IDs
            if let Some(tp) = traceparent {
                // Parse traceparent header: 00-<trace-id>-<span-id>-<trace-flags>
                let parts: Vec<&str> = tp.split('-').collect();
                if parts.len() == 4 {
                    self.trace_id = Some(parts[1].to_string());
                    self.span_id = Some(parts[2].to_string());
                }
            } else if let Some(b3_header) = b3 {
                // Parse b3 header: <trace-id>-<span-id>-<sampled>
                let parts: Vec<&str> = b3_header.split('-').collect();
                if parts.len() >= 2 {
                    self.trace_id = Some(parts[0].to_string());
                    self.span_id = Some(parts[1].to_string());
                }
            } else if let (Some(tid), Some(sid)) = (x_trace_id, x_span_id) {
                self.trace_id = Some(tid.clone());
                self.span_id = Some(sid.clone());
            }

            // Generate new span ID
            self.new_span_id = Some(Uuid::new_v4().to_string().replace("-", ""));
            
            // Get current time in nanoseconds
            let now = self.get_current_time();
            self.start_time = Some(now.duration_since(std::time::UNIX_EPOCH).unwrap().as_nanos() as u64);

            log(LogLevel::Info, &format!("OTLP span started - Trace ID: {}, Parent Span ID: {}, New Span ID: {}", 
                self.trace_id.as_ref().unwrap_or(&"unknown".to_string()),
                self.span_id.as_ref().unwrap_or(&"unknown".to_string()),
                self.new_span_id.as_ref().unwrap()
            ));
        }

        Action::Continue
    }

    fn on_http_request_body(&mut self, body_size: usize, end_of_stream: bool) -> Action {
        if !end_of_stream {
            return Action::Pause;
        }

        // Capture request body
        if let Some(body_bytes) = self.get_http_request_body(0, body_size) {
            if let Ok(body_str) = String::from_utf8(body_bytes) {
                self.request_body = body_str.clone();
                
                // Log captured request body
                log(LogLevel::Info, &format!("CAPTURED_REQUEST_BODY: {}", body_str));
                
                // Validate and log request body if it's JSON or XML
                let content_type = self.request_headers.get("content-type").unwrap_or(&String::new()).clone();
                
                if content_type.contains("application/json") {
                    // Validate JSON
                    if serde_json::from_str::<Value>(&body_str).is_ok() {
                        log(LogLevel::Debug, &format!("Valid JSON request body captured: {}", body_str));
                    } else {
                        log(LogLevel::Warn, "Invalid JSON in request body");
                    }
                } else if content_type.contains("application/xml") || content_type.contains("text/xml") {
                    // Validate XML
                    let mut reader = Reader::from_str(&body_str);
                    if reader.read_event().is_ok() {
                        log(LogLevel::Debug, &format!("Valid XML request body captured: {}", body_str));
                    } else {
                        log(LogLevel::Warn, "Invalid XML in request body");
                    }
                }
            }
        }

        Action::Continue
    }

    fn on_http_response_headers(&mut self, _: usize, _: bool) -> Action {
        // Capture response headers
        self.response_headers.clear();
        self.get_http_response_headers().into_iter().for_each(|(k, v)| {
            self.response_headers.insert(k, v);
        });

        // Log captured response headers
        log(LogLevel::Info, &format!("CAPTURED_RESPONSE_HEADERS: {}", serde_json::to_string(&self.response_headers).unwrap_or_default()));

        Action::Continue
    }

    fn on_http_response_body(&mut self, body_size: usize, end_of_stream: bool) -> Action {
        if !end_of_stream {
            return Action::Pause;
        }

        // Capture response body
        if let Some(body_bytes) = self.get_http_response_body(0, body_size) {
            if let Ok(body_str) = String::from_utf8(body_bytes) {
                self.response_body = body_str.clone();
                
                // Log captured response body
                log(LogLevel::Info, &format!("CAPTURED_RESPONSE_BODY: {}", body_str));
                
                // Validate and log response body if it's JSON or XML
                let content_type = self.response_headers.get("content-type").unwrap_or(&String::new()).clone();
                
                if content_type.contains("application/json") {
                    // Validate JSON
                    if serde_json::from_str::<Value>(&body_str).is_ok() {
                        log(LogLevel::Debug, &format!("Valid JSON response body captured: {}", body_str));
                    } else {
                        log(LogLevel::Warn, "Invalid JSON in response body");
                    }
                } else if content_type.contains("application/xml") || content_type.contains("text/xml") {
                    // Validate XML
                    let mut reader = Reader::from_str(&body_str);
                    if reader.read_event().is_ok() {
                        log(LogLevel::Debug, &format!("Valid XML response body captured: {}", body_str));
                    } else {
                        log(LogLevel::Warn, "Invalid XML in response body");
                    }
                }
            }
        }

        // Send OTLP span data to collector if we have trace context
        if let (Some(trace_id), Some(span_id), Some(new_span_id), Some(start_time)) = 
            (&self.trace_id, &self.span_id, &self.new_span_id, &self.start_time) {
            
            let now = self.get_current_time();
            let end_time = now.duration_since(std::time::UNIX_EPOCH).unwrap().as_nanos() as u64;
            let duration = end_time - start_time;

            // Create OTLP span data in JSON format
            let span_data = json!({
                "resourceSpans": [{
                    "resource": {
                        "attributes": [{
                            "key": "service.name",
                            "value": { "stringValue": "envoy-proxy" }
                        }]
                    },
                    "scopeSpans": [{
                        "scope": {
                            "name": "envoy-otlp-extension",
                            "version": "1.0.0"
                        },
                        "spans": [{
                            "traceId": trace_id,
                            "spanId": new_span_id,
                            "parentSpanId": span_id,
                            "name": "envoy_proxy_request",
                            "kind": 3, // SPAN_KIND_SERVER
                            "startTimeUnixNano": start_time.to_string(),
                            "endTimeUnixNano": end_time.to_string(),
                            "attributes": [
                                {
                                    "key": "multiplayer.http.request.headers",
                                    "value": { "stringValue": serde_json::to_string(&self.request_headers).unwrap_or_default() }
                                },
                                {
                                    "key": "multiplayer.http.response.headers", 
                                    "value": { "stringValue": serde_json::to_string(&self.response_headers).unwrap_or_default() }
                                },
                                {
                                    "key": "multiplayer.http.request.body",
                                    "value": { "stringValue": self.request_body }
                                },
                                {
                                    "key": "multiplayer.http.response.body",
                                    "value": { "stringValue": self.response_body }
                                },
                                {
                                    "key": "envoy.trace_id",
                                    "value": { "stringValue": trace_id }
                                },
                                {
                                    "key": "envoy.span_id",
                                    "value": { "stringValue": span_id }
                                }
                            ]
                        }]
                    }]
                }]
            });

            // Log the OTLP span data
            log(LogLevel::Info, &format!("OTLP_SPAN_DATA: {}", serde_json::to_string(&span_data).unwrap_or_default()));
            
            // Send span data to OTLP collector using dispatch_http_call
            if let Some(collector_url) = &self.otlp_collector_url {
                self.send_span_to_collector(collector_url, &span_data);
                log(LogLevel::Info, &format!("OTLP_COLLECTOR_URL: {}", collector_url));
            }

            log(LogLevel::Info, &format!("OTLP span completed - Duration: {}ns", duration));
        }

        Action::Continue
    }
}

impl OtlpHttpContext {
    fn send_span_to_collector(&self, collector_url: &str, span_data: &serde_json::Value) {
        // Convert collector URL to cluster and path
        let (cluster, path) = self.parse_collector_url(collector_url);
        
        // Log the parsed URL components
        log(LogLevel::Info, &format!("PARSED_COLLECTOR_URL: Original={}, Cluster={}, Path={}", collector_url, cluster, path));
        
        // Prepare headers for OTLP HTTP export
        let headers = vec![
            ("content-type", "application/json"),
            ("user-agent", "envoy-otlp-extension/1.0.0"),
        ];
        
        // Log HTTP call details
        log(LogLevel::Info, &format!("HTTP_CALL_DETAILS: Cluster={}, Headers={:?}", cluster, headers));

        // Convert span data to JSON string
        let span_json = serde_json::to_string(span_data).unwrap_or_default();
        
        // Log where the span will be sent
        log(LogLevel::Info, &format!("SENDING_SPAN_TO_COLLECTOR: URL={}, Cluster={}, Path={}", collector_url, cluster, path));
        log(LogLevel::Info, &format!("SPAN_PAYLOAD_SIZE: {} bytes", span_json.len()));
        
        // Make HTTP call to OTLP collector
        match self.dispatch_http_call(
            cluster.as_str(),
            headers,
            Some(span_json.as_bytes()),
            vec![],
            Duration::from_secs(5),
        ) {
            Ok(_) => {
                log(LogLevel::Info, &format!("Successfully sent span to OTLP collector: {}", collector_url));
            }
            Err(e) => {
                log(LogLevel::Error, &format!("Failed to send span to OTLP collector: {:?}", e));
            }
        }
    }

    fn parse_collector_url(&self, url: &str) -> (String, String) {
        // Simple URL parser for OTLP collector
        if url.starts_with("http://") {
            let without_proto = &url[7..];
            if let Some(slash_pos) = without_proto.find('/') {
                let host = &without_proto[..slash_pos];
                let path = &without_proto[slash_pos..];
                return (host.to_string(), path.to_string());
            } else {
                return (without_proto.to_string(), "/v1/traces".to_string());
            }
        } else if url.starts_with("https://") {
            let without_proto = &url[8..];
            if let Some(slash_pos) = without_proto.find('/') {
                let host = &without_proto[..slash_pos];
                let path = &without_proto[slash_pos..];
                return (host.to_string(), path.to_string());
            } else {
                return (without_proto.to_string(), "/v1/traces".to_string());
            }
        } else {
            // Default to HTTP
            if let Some(slash_pos) = url.find('/') {
                let host = &url[..slash_pos];
                let path = &url[slash_pos..];
                return (host.to_string(), path.to_string());
            } else {
                return (url.to_string(), "/v1/traces".to_string());
            }
        }
    }
}
