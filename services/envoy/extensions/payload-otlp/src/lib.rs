use proxy_wasm::traits::*;
use proxy_wasm::types::*;
use proxy_wasm::hostcalls::log;
use serde_json::json;
use std::collections::HashMap;
use std::time::Duration;
use uuid::Uuid;

proxy_wasm::main! {{
    proxy_wasm::set_log_level(LogLevel::Trace);
    proxy_wasm::set_root_context(|_| -> Box<dyn RootContext> { 
        Box::new(OtlpRoot { 
            otlp_collector_path: Some("/v1/traces".to_string()),
            otlp_collector_cluster_name: None,
            otlp_collector_api_key: None,
            capture_request_headers: true,
            capture_request_body: true,
            capture_response_headers: true,
            capture_response_body: true,
            max_body_size_bytes: 1024 * 1024, // 1MB default
            headers_to_include: Vec::new(),
            headers_to_exclude: Vec::new(),
        }) 
    });
}}

struct OtlpRoot {
    otlp_collector_path: Option<String>,
    otlp_collector_cluster_name: Option<String>,
    otlp_collector_api_key: Option<String>,
    capture_request_headers: bool,
    capture_request_body: bool,
    capture_response_headers: bool,
    capture_response_body: bool,
    max_body_size_bytes: usize,
    headers_to_include: Vec<String>,
    headers_to_exclude: Vec<String>,
}

impl Context for OtlpRoot {}

impl RootContext for OtlpRoot {
    fn get_type(&self) -> Option<ContextType> {
        Some(ContextType::HttpContext)
    }

    fn create_http_context(&self, _: u32) -> Option<Box<dyn HttpContext>> {
        Some(Box::new(OtlpHttpContext {
            otlp_collector_path: self.otlp_collector_path.clone(),
            otlp_collector_cluster_name: self.otlp_collector_cluster_name.clone(),
            otlp_collector_api_key: self.otlp_collector_api_key.clone(),
            capture_request_headers: self.capture_request_headers,
            capture_request_body: self.capture_request_body,
            capture_response_headers: self.capture_response_headers,
            capture_response_body: self.capture_response_body,
            max_body_size_bytes: self.max_body_size_bytes,
            headers_to_include: self.headers_to_include.clone(),
            headers_to_exclude: self.headers_to_exclude.clone(),
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
        // Get OTLP collector configuration
        if let Some(config_bytes) = self.get_plugin_configuration() {
            if let Ok(config_str) = String::from_utf8(config_bytes) {
                if let Ok(config) = serde_json::from_str::<serde_json::Value>(&config_str) {
                    // Get OTLP collector path (optional, defaults to "/v1/traces")
                    if let Some(otlp_path) = config["otlp_collector_path"].as_str() {
                        self.otlp_collector_path = Some(otlp_path.to_string());
                        log(LogLevel::Info, &format!("OTLP collector path configured: {}", otlp_path));
                    } else {
                        log(LogLevel::Info, "OTLP collector path not specified, using default: /v1/traces");
                    }
                    
                    // Get OTLP collector cluster name (required)
                    if let Some(cluster_name) = config["otlp_collector_cluster_name"].as_str() {
                        self.otlp_collector_cluster_name = Some(cluster_name.to_string());
                        log(LogLevel::Info, &format!("OTLP collector cluster name configured: {}", cluster_name));
                    } else {
                        log(LogLevel::Error, "OTLP collector cluster name must be specified in configuration");
                        return false;
                    }
                    
                    // Get OTLP collector API key (optional)
                    if let Some(api_key) = config["otlp_collector_api_key"].as_str() {
                        self.otlp_collector_api_key = Some(api_key.to_string());
                        log(LogLevel::Info, "OTLP collector API key configured");
                    } else {
                        log(LogLevel::Info, "No OTLP collector API key configured (optional)");
                    }
                    
                    // Get capture configuration options
                    self.capture_request_headers = config["capture_request_headers"].as_bool().unwrap_or(true);
                    self.capture_request_body = config["capture_request_body"].as_bool().unwrap_or(true);
                    self.capture_response_headers = config["capture_response_headers"].as_bool().unwrap_or(true);
                    self.capture_response_body = config["capture_response_body"].as_bool().unwrap_or(true);
                    self.max_body_size_bytes = config["max_body_size_bytes"].as_u64().unwrap_or(1024 * 1024) as usize;
                    
                    // Get header filtering configuration
                    self.headers_to_include = config["headers_to_include"]
                        .as_array()
                        .map(|arr| arr.iter().filter_map(|v| v.as_str().map(|s| s.to_lowercase())).collect())
                        .unwrap_or_default();
                    
                    self.headers_to_exclude = config["headers_to_exclude"]
                        .as_array()
                        .map(|arr| arr.iter().filter_map(|v| v.as_str().map(|s| s.to_lowercase())).collect())
                        .unwrap_or_default();
                    
                    log(LogLevel::Info, &format!("Capture config: req_headers={}, req_body={}, resp_headers={}, resp_body={}, max_size={}bytes", 
                        self.capture_request_headers, self.capture_request_body, 
                        self.capture_response_headers, self.capture_response_body, self.max_body_size_bytes));
                    log(LogLevel::Info, &format!("Header filtering: include={:?}, exclude={:?}", 
                        self.headers_to_include, self.headers_to_exclude));
                    
                    return true;
                }
            }
        }
        log(LogLevel::Warn, "No OTLP collector path configured");
        false
    }
}

struct OtlpHttpContext {
    otlp_collector_path: Option<String>,
    otlp_collector_cluster_name: Option<String>,
    otlp_collector_api_key: Option<String>,
    capture_request_headers: bool,
    capture_request_body: bool,
    capture_response_headers: bool,
    capture_response_body: bool,
    max_body_size_bytes: usize,
    headers_to_include: Vec<String>,
    headers_to_exclude: Vec<String>,
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
        // Check for OTLP headers first to determine if we should capture data
        let all_headers: HashMap<String, String> = self
            .get_http_request_headers()
            .into_iter()
            .map(|(k, v)| (k.to_lowercase(), v))
            .collect();
        let traceparent = all_headers.get("traceparent");
        let b3 = all_headers.get("b3");
        let x_trace_id = all_headers.get("x-trace-id");
        let x_span_id = all_headers.get("x-span-id");
        
        // Log OTLP headers found
        log(LogLevel::Info, &format!("OTLP_HEADERS_FOUND: traceparent={:?}, b3={:?}, x-trace-id={:?}, x-span-id={:?}", 
            traceparent, b3, x_trace_id, x_span_id));

        if traceparent.is_some() || b3.is_some() || (x_trace_id.is_some() && x_span_id.is_some()) {
            // Extract trace and span IDs
            let mut extracted_trace_id: Option<String> = None;
            
            if let Some(tp) = traceparent {
                // Parse traceparent header: 00-<trace-id>-<span-id>-<trace-flags>
                let parts: Vec<&str> = tp.split('-').collect();
                if parts.len() == 4 {
                    extracted_trace_id = Some(parts[1].to_string());
                    self.span_id = Some(parts[2].to_string());
                }
            } else if let Some(b3_header) = b3 {
                // Parse b3 header: <trace-id>-<span-id>-<sampled>
                let parts: Vec<&str> = b3_header.split('-').collect();
                if parts.len() >= 2 {
                    extracted_trace_id = Some(parts[0].to_string());
                    self.span_id = Some(parts[1].to_string());
                }
            } else if let (Some(tid), Some(sid)) = (x_trace_id, x_span_id) {
                extracted_trace_id = Some(tid.clone());
                self.span_id = Some(sid.clone());
            }

            // Validate trace ID before proceeding
            if let Some(trace_id) = extracted_trace_id {
                if !self.is_valid_trace_id(&trace_id) {
                    log(LogLevel::Warn, "Invalid trace ID format, skipping OTLP processing");
                    return Action::Continue;
                }
                self.trace_id = Some(trace_id);
            } else {
                log(LogLevel::Warn, "Failed to extract trace ID from headers, skipping OTLP processing");
                return Action::Continue;
            }

            // Generate new span ID (16 characters)
            let uuid = Uuid::new_v4();
            let span_id = uuid.to_string().replace("-", "").chars().take(16).collect::<String>();
            self.new_span_id = Some(span_id);
            
            // Get current time in nanoseconds
            let now = self.get_current_time();
            self.start_time = Some(now.duration_since(std::time::UNIX_EPOCH).unwrap().as_nanos() as u64);

            log(LogLevel::Info, &format!("OTLP span started - Trace ID: {}, Parent Span ID: {}, New Span ID: {}", 
                self.trace_id.as_ref().unwrap_or(&"unknown".to_string()),
                self.span_id.as_ref().unwrap_or(&"unknown".to_string()),
                self.new_span_id.as_ref().unwrap()
            ));
            
            // Only capture and send data if traceId matches our pattern
            if self.should_capture_data() {
                if self.capture_request_headers {
                    self.request_headers.clear();
                    self.get_http_request_headers().into_iter().for_each(|(k, v)| {
                        if self.should_include_header(&k) {
                            self.request_headers.insert(k, v);
                        }
                    });
                }
                
                // Send span with request headers after trace context is set up
                if self.capture_request_headers {
                    self.send_request_headers_span();
                }
            }
        } else {
            log(LogLevel::Debug, "No OTLP headers found, skipping span creation");
            log(LogLevel::Debug, &format!("Available headers: {:?}", all_headers.keys().collect::<Vec<_>>()));
        }

        Action::Continue
    }

    fn on_http_request_body(&mut self, body_size: usize, end_of_stream: bool) -> Action {
        if !end_of_stream {
            return Action::Pause;
        }

        if !self.should_capture_data() {
            return Action::Continue;
        }

        if body_size > self.max_body_size_bytes {
            log(LogLevel::Warn, &format!("Request body size {} exceeds limit {}, skipping capture", body_size, self.max_body_size_bytes));
            return Action::Continue;
        }

        if self.capture_request_body {
            if let Some(body_bytes) = self.get_http_request_body(0, body_size) {
                if let Ok(body_str) = String::from_utf8(body_bytes) {
                    self.request_body = body_str.clone();
                }
            }
            
            self.send_request_body_span();
        }

        Action::Continue
    }

    fn on_http_response_headers(&mut self, _: usize, _: bool) -> Action {
        // If we shouldn't capture data, just continue
        if !self.should_capture_data() {
            return Action::Continue;
        }

        if self.capture_response_headers {
            self.response_headers.clear();
            self.get_http_response_headers().into_iter().for_each(|(k, v)| {
                if self.should_include_header(&k) {
                    self.response_headers.insert(k, v);
                }
            });

            self.send_response_headers_span();
        }

        Action::Continue
    }

    fn on_http_response_body(&mut self, body_size: usize, end_of_stream: bool) -> Action {
        if !end_of_stream {
            return Action::Pause;
        }

        // If we shouldn't capture data, just continue
        if !self.should_capture_data() {
            return Action::Continue;
        }

        if body_size > self.max_body_size_bytes {
            log(LogLevel::Warn, &format!("Response body size {} exceeds limit {}, skipping capture", body_size, self.max_body_size_bytes));
            return Action::Continue;
        }

        if self.capture_response_body {
            if let Some(body_bytes) = self.get_http_response_body(0, body_size) {
                if let Ok(body_str) = String::from_utf8(body_bytes) {
                    self.response_body = body_str.clone();
                }
            }
            
            self.send_response_body_span();
        }

        Action::Continue
    }
}

impl OtlpHttpContext {
    fn should_capture_data(&self) -> bool {
        if let Some(trace_id) = &self.trace_id {
            let should_capture = trace_id.starts_with("debdeb") || trace_id.starts_with("cdbcdb");
            log(LogLevel::Info, &format!("SHOULD_CAPTURE_DATA: trace_id='{}', should_capture={}", trace_id, should_capture));
            should_capture
        } else {
            log(LogLevel::Info, "SHOULD_CAPTURE_DATA: no trace_id found, should_capture=false");
            false
        }
    }

    fn is_valid_trace_id(&self, trace_id: &str) -> bool {
        // OTLP trace ID should be 32 characters (16 bytes) in hex format
        let is_valid = trace_id.len() == 32 && trace_id.chars().all(|c| c.is_ascii_hexdigit());
        log(LogLevel::Info, &format!("TRACE_ID_VALIDATION: trace_id='{}', length={}, is_hex={}, is_valid={}", 
            trace_id, trace_id.len(), trace_id.chars().all(|c| c.is_ascii_hexdigit()), is_valid));
        is_valid
    }

    fn create_span_data(
        &self,
        trace_id: &str,
        span_id: &str,
        new_span_id: &str,
        start_time: u64,
        end_time: u64,
        span_name: &str,
        attributes: HashMap<String, String>,
    ) -> serde_json::Value {
        let mut span_attributes = vec![
            json!({
                "key": "envoy.trace_id",
                "value": { "stringValue": trace_id }
            }),
            json!({
                "key": "envoy.span_id",
                "value": { "stringValue": span_id }
            }),
            json!({
                "key": "envoy.span_type",
                "value": { "stringValue": span_name }
            }),
        ];

        // Add custom attributes
        for (key, value) in attributes {
            span_attributes.push(json!({
                "key": key,
                "value": { "stringValue": value }
            }));
        }

        json!({
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
                        "name": span_name,
                        "kind": 3, // SPAN_KIND_SERVER
                        "startTimeUnixNano": start_time.to_string(),
                        "endTimeUnixNano": end_time.to_string(),
                        "attributes": span_attributes
                    }]
                }]
            }]
        })
    }

    fn should_include_header(&self, header_name: &str) -> bool {
        let header_lower = header_name.to_lowercase();
        
        // If include list is not empty, header must be in it
        if !self.headers_to_include.is_empty() {
            if !self.headers_to_include.contains(&header_lower) {
                return false;
            }
        }
        
        // If exclude list is not empty, header must not be in it
        if !self.headers_to_exclude.is_empty() {
            if self.headers_to_exclude.contains(&header_lower) {
                return false;
            }
        }
        
        true
    }

    fn send_request_headers_span(&self) {
        if !self.should_capture_data() {
            return;
        }
        
        if let (Some(trace_id), Some(span_id), Some(new_span_id), Some(start_time)) = 
            (&self.trace_id, &self.span_id, &self.new_span_id, &self.start_time) {
            
            let now = self.get_current_time();
            let end_time = now.duration_since(std::time::UNIX_EPOCH).unwrap().as_nanos() as u64;
            let duration = end_time - start_time;

            let mut attributes = HashMap::new();
            attributes.insert("multiplayer.http.request.headers".to_string(), serde_json::to_string(&self.request_headers).unwrap_or_default());

            let span_data = self.create_span_data(
                trace_id,
                span_id,
                new_span_id,
                *start_time,
                end_time,
                "envoy_proxy_request_headers",
                attributes,
            );

            log(LogLevel::Info, "About to send request headers span to collector");
            log(LogLevel::Info, &format!("REQUEST_HEADERS_SPAN_DATA: {}", serde_json::to_string(&span_data).unwrap_or_default()));
            self.send_span_to_collector(&span_data);

            log(LogLevel::Info, &format!("OTLP request headers span sent - Duration: {}ns", duration));
        }
    }

    fn send_request_body_span(&self) {
        if !self.should_capture_data() {
            return;
        }
        
        if let (Some(trace_id), Some(span_id), Some(new_span_id), Some(start_time)) = 
            (&self.trace_id, &self.span_id, &self.new_span_id, &self.start_time) {
            
            let now = self.get_current_time();
            let end_time = now.duration_since(std::time::UNIX_EPOCH).unwrap().as_nanos() as u64;
            let duration = end_time - start_time;

            let mut attributes = HashMap::new();
            attributes.insert("multiplayer.http.request.body".to_string(), self.request_body.clone());

            let span_data = self.create_span_data(
                trace_id,
                span_id,
                new_span_id,
                *start_time,
                end_time,
                "envoy_proxy_request_body",
                attributes,
            );

            log(LogLevel::Info, "About to send request body span to collector");
            log(LogLevel::Info, &format!("REQUEST_BODY_SPAN_DATA: {}", serde_json::to_string(&span_data).unwrap_or_default()));
            self.send_span_to_collector(&span_data);

            log(LogLevel::Info, &format!("OTLP request body span sent - Duration: {}ns", duration));
        }
    }

    fn send_response_headers_span(&self) {
        if !self.should_capture_data() {
            return;
        }
        
        if let (Some(trace_id), Some(span_id), Some(new_span_id), Some(start_time)) = 
            (&self.trace_id, &self.span_id, &self.new_span_id, &self.start_time) {
            
            let now = self.get_current_time();
            let end_time = now.duration_since(std::time::UNIX_EPOCH).unwrap().as_nanos() as u64;
            let duration = end_time - start_time;

            let mut attributes = HashMap::new();
            attributes.insert("multiplayer.http.response.headers".to_string(), serde_json::to_string(&self.response_headers).unwrap_or_default());

            let span_data = self.create_span_data(
                trace_id,
                span_id,
                new_span_id,
                *start_time,
                end_time,
                "envoy_proxy_response_headers",
                attributes,
            );

            log(LogLevel::Info, "About to send response headers span to collector");
            log(LogLevel::Info, &format!("RESPONSE_HEADERS_SPAN_DATA: {}", serde_json::to_string(&span_data).unwrap_or_default()));
            self.send_span_to_collector(&span_data);

            log(LogLevel::Info, &format!("OTLP response headers span sent - Duration: {}ns", duration));
        }
    }

    fn send_response_body_span(&self) {
        if !self.should_capture_data() {
            return;
        }
        
        if let (Some(trace_id), Some(span_id), Some(new_span_id), Some(start_time)) = 
            (&self.trace_id, &self.span_id, &self.new_span_id, &self.start_time) {
            
            let now = self.get_current_time();
            let end_time = now.duration_since(std::time::UNIX_EPOCH).unwrap().as_nanos() as u64;
            let duration = end_time - start_time;

            let mut attributes = HashMap::new();
            attributes.insert("multiplayer.http.response.body".to_string(), self.response_body.clone());

            let span_data = self.create_span_data(
                trace_id,
                span_id,
                new_span_id,
                *start_time,
                end_time,
                "envoy_proxy_response_body",
                attributes,
            );

            log(LogLevel::Info, &format!("OTLP_RESPONSE_BODY_SPAN: {}", serde_json::to_string(&span_data).unwrap_or_default()));
            
            log(LogLevel::Info, "About to send response body span to collector");
            log(LogLevel::Info, &format!("RESPONSE_BODY_SPAN_DATA: {}", serde_json::to_string(&span_data).unwrap_or_default()));
            self.send_span_to_collector(&span_data);

            log(LogLevel::Info, &format!("OTLP response body span sent - Duration: {}ns", duration));
        }
    }

    fn send_span_to_collector(&self, span_data: &serde_json::Value) {
        let path = self.otlp_collector_path.as_ref().unwrap();
        log(LogLevel::Info, &format!("send_span_to_collector called with path: {}", path));
        
        let mut headers = vec![
            (":path", path.as_str()),
            (":method", "POST"),
            (":authority", self.otlp_collector_cluster_name.as_ref().unwrap()),
            ("content-type", "application/json"),
            ("user-agent", "envoy-otlp-extension/1.0.0"),
        ];
        
        let auth_header = if let Some(ref api_key) = self.otlp_collector_api_key {
            Some(format!("Bearer {}", api_key))
        } else {
            None
        };
        
        if let Some(ref auth) = auth_header {
            headers.push(("authorization", auth.as_str()));
        }
        
        if headers.is_empty() {
            log(LogLevel::Error, &format!("Invalid headers: empty"));
            return;
        }
        
        let span_json = serde_json::to_string(span_data).unwrap_or_default();
        
        if span_json.is_empty() {
            log(LogLevel::Error, &format!("Invalid span JSON: empty"));
            return;
        }

        let cluster_name = self.otlp_collector_cluster_name.as_ref().unwrap();
        log(LogLevel::Info, &format!("About to send span to cluster: {}", cluster_name));

        match self.dispatch_http_call(
            cluster_name,
            headers,
            Some(span_json.as_bytes()),
            vec![],
            Duration::from_secs(5),
        ) {
            Ok(_) => {
                log(LogLevel::Info, &format!("Successfully sent span to OTLP collector with path: {}", path));
            }
            Err(e) => {
                log(LogLevel::Error, &format!("Failed to send span to OTLP collector: {:?}", e));
            }
        }
    }
}
