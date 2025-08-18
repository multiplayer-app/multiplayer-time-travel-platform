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
            otlp_collector_authority: None,
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
    otlp_collector_authority: Option<String>,
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
            otlp_collector_authority: self.otlp_collector_authority.clone(),
            otlp_collector_api_key: self.otlp_collector_api_key.clone(),
            capture_request_headers: self.capture_request_headers,
            capture_request_body: self.capture_request_body,
            capture_response_headers: self.capture_response_headers,
            capture_response_body: self.capture_response_body,
            max_body_size_bytes: self.max_body_size_bytes,
            headers_to_include: self.headers_to_include.clone(),
            headers_to_exclude: self.headers_to_exclude.clone(),
            stored_trace_id: None,
            stored_span_id: None,
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
                    
                    // Get OTLP collector authority (optional)
                    if let Some(authority) = config["otlp_collector_authority"].as_str() {
                        self.otlp_collector_authority = Some(authority.to_string());
                        log(LogLevel::Info, &format!("OTLP collector authority configured: {}", authority));
                    } else {
                        log(LogLevel::Info, "No OTLP collector authority configured (optional)");
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
    otlp_collector_authority: Option<String>,
    otlp_collector_api_key: Option<String>,
    capture_request_headers: bool,
    capture_request_body: bool,
    capture_response_headers: bool,
    capture_response_body: bool,
    max_body_size_bytes: usize,
    headers_to_include: Vec<String>,
    headers_to_exclude: Vec<String>,
    // Store trace context for reuse throughout request lifecycle
    stored_trace_id: Option<String>,
    stored_span_id: Option<String>,
}

impl Context for OtlpHttpContext {}

impl HttpContext for OtlpHttpContext {
    fn on_http_request_headers(&mut self, _: usize, _: bool) -> Action {
        // Extract and validate trace context
        if let Some((trace_id, span_id)) = self.extract_trace_context() {
            if !self.is_valid_trace_id(&trace_id) {
                return Action::Continue;
            }

            self.stored_trace_id = Some(trace_id.clone());
            self.stored_span_id = Some(span_id.clone());

            if self.should_capture_data() {                    
                if self.capture_request_headers {
                    self.send_request_headers_span();
                }
            }
        }

        Action::Continue
    }

    fn on_http_request_body(&mut self, body_size: usize, end_of_stream: bool) -> Action {
        log(LogLevel::Info, &format!("REQUEST_BODY: size={}, end_of_stream={}, stored_trace_id={:?}", 
            body_size, end_of_stream, self.stored_trace_id));
        
        if !end_of_stream {
            return Action::Pause;
        }

        if !self.should_capture_data() {
            return Action::Continue;
        }

        if body_size > self.max_body_size_bytes {
            return Action::Continue;
        }

        if self.capture_request_body {
            if body_size == 0 {
                log(LogLevel::Info, &format!("REQUEST_BODY: empty body, skipping, stored_trace_id={:?}", self.stored_trace_id));
            } else if let Some(body_bytes) = self.get_http_request_body(0, body_size) {
                match String::from_utf8(body_bytes) {
                    Ok(body_str) => {
                        self.send_request_body_span(&body_str);
                    }
                    Err(_) => {
                        log(LogLevel::Warn, &format!("REQUEST_BODY: non-UTF8 body, skipping, stored_trace_id={:?}", self.stored_trace_id));
                    }
                }
            } else {
                log(LogLevel::Warn, &format!("REQUEST_BODY: get_http_request_body returned None, stored_trace_id={:?}", self.stored_trace_id));
            }
        }

        return Action::Continue;
    }

    fn on_http_response_headers(&mut self, _: usize, _: bool) -> Action {
        log(LogLevel::Info, "RESPONSE_HEADERS: received");
        
        // If we shouldn't capture data, just continue
        if !self.should_capture_data() {
            log(LogLevel::Info, "RESPONSE_HEADERS: should_capture_data=false, skipping");
            return Action::Continue;
        }

        if self.capture_response_headers {
            self.send_response_headers_span();
        }

        Action::Continue
    }

    fn on_http_response_body(&mut self, body_size: usize, end_of_stream: bool) -> Action {
        if !self.capture_response_body {
            return Action::Continue;
        }
        
        if !end_of_stream {
            return Action::Pause;
        }

        if !self.should_capture_data() {
            return Action::Continue;
        }

        if body_size > self.max_body_size_bytes {
            return Action::Continue;
        }

        if body_size == 0 {
            return Action::Continue;
        } 
        
        if let Some(body_bytes) = self.get_http_response_body(0, body_size) {
            match String::from_utf8(body_bytes) {
                Ok(body_str) => {
                    self.send_response_body_span(&body_str);
                }
                Err(_) => {
                    log(LogLevel::Warn, "RESPONSE_BODY: non-UTF8 body, skipping");
                }
            }
        } else {
            log(LogLevel::Warn, "RESPONSE_BODY: get_http_response_body returned None");
        }

        return Action::Continue
    }
}

impl OtlpHttpContext {
    fn extract_trace_context(&self) -> Option<(String, String)> {
        let all_headers: HashMap<String, String> = self
            .get_http_request_headers()
            .into_iter()
            .map(|(k, v)| (k.to_lowercase(), v))
            .collect();
        
        let traceparent = all_headers.get("traceparent");
        let b3 = all_headers.get("b3");
        let x_trace_id = all_headers.get("x-trace-id");
        let x_span_id = all_headers.get("x-span-id");
        
        if let Some(tp) = traceparent {
            // Parse traceparent header: 00-<trace-id>-<span-id>-<trace-flags>
            let parts: Vec<&str> = tp.split('-').collect();
            if parts.len() == 4 {
                return Some((parts[1].to_string(), parts[2].to_string()));
            }
        } else if let Some(b3_header) = b3 {
            // Parse b3 header: <trace-id>-<span-id>-<sampled>
            let parts: Vec<&str> = b3_header.split('-').collect();
            if parts.len() >= 2 {
                return Some((parts[0].to_string(), parts[1].to_string()));
            }
        } else if let (Some(tid), Some(sid)) = (x_trace_id, x_span_id) {
            return Some((tid.clone(), sid.clone()));
        }
        
        None
    }

    fn should_capture_data(&self) -> bool {
        // Use stored trace context if available, otherwise try to extract from headers
        let trace_id = if let Some(ref stored_trace_id) = self.stored_trace_id {
            stored_trace_id.clone()
        } else if let Some((trace_id, _)) = self.extract_trace_context() {
            trace_id
        } else {
            return false;
        };
        
        let should_capture = trace_id.starts_with("debdeb") || trace_id.starts_with("cdbcdb");
        should_capture
    }

    fn is_valid_trace_id(&self, trace_id: &str) -> bool {
        // OTLP trace ID should be 32 characters (16 bytes) in hex format
        let is_valid = trace_id.len() == 32 && trace_id.chars().all(|c| c.is_ascii_hexdigit());
        log(LogLevel::Debug, &format!("TRACE_ID_VALIDATION: trace_id='{}', length={}, is_hex={}, is_valid={}", 
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
        
        if !self.headers_to_include.is_empty() {
            if !self.headers_to_include.contains(&header_lower) {
                return false;
            }
        }
        
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
        
        if let (Some(trace_id), Some(span_id)) = (&self.stored_trace_id, &self.stored_span_id) {
            // Generate unique span ID for this specific span
            let uuid = Uuid::new_v4();
            let span_id_for_this_span = uuid.to_string().replace("-", "").chars().take(16).collect::<String>();
            
            let now = self.get_current_time();
            let end_time = now.duration_since(std::time::UNIX_EPOCH).unwrap().as_nanos() as u64;
            let start_time = end_time;
            let duration = 0;

            let request_headers: HashMap<String, String> = self
                .get_http_request_headers()
                .into_iter()
                .filter(|(k, _)| self.should_include_header(k))
                .collect();

            let mut attributes = HashMap::new();
            attributes.insert("multiplayer.http.request.headers".to_string(), serde_json::to_string(&request_headers).unwrap_or_default());

            let span_data = self.create_span_data(
                &trace_id,
                &span_id,
                &span_id_for_this_span,
                start_time,
                end_time,
                "envoy-proxy request-headers",
                attributes,
            );

            self.send_span_to_collector(&span_data, "envoy_proxy_request_headers");
        }
    }

    fn send_request_body_span(&self, request_body: &str) {
        if !self.should_capture_data() {
            return;
        }
        
        if let (Some(trace_id), Some(span_id)) = (&self.stored_trace_id, &self.stored_span_id) {
            let uuid = Uuid::new_v4();
            let span_id_for_this_span = uuid.to_string().replace("-", "").chars().take(16).collect::<String>();
            
            let now = self.get_current_time();
            let end_time = now.duration_since(std::time::UNIX_EPOCH).unwrap().as_nanos() as u64;
            let start_time = end_time;
            let duration = 0;

            let mut attributes = HashMap::new();
            attributes.insert("multiplayer.http.request.body".to_string(), request_body.to_string());

            let span_data = self.create_span_data(
                &trace_id,
                &span_id,
                &span_id_for_this_span,
                start_time,
                end_time,
                "envoy-proxy request-body",
                attributes,
            );

            self.send_span_to_collector(&span_data, "envoy_proxy_request_body");
        }
    }

    fn send_response_headers_span(&self) {
        if !self.should_capture_data() {
            return;
        }
        
        if let (Some(trace_id), Some(span_id)) = (&self.stored_trace_id, &self.stored_span_id) {
            let uuid = Uuid::new_v4();
            let span_id_for_this_span = uuid.to_string().replace("-", "").chars().take(16).collect::<String>();
            
            let now = self.get_current_time();
            let end_time = now.duration_since(std::time::UNIX_EPOCH).unwrap().as_nanos() as u64;
            let start_time = end_time;
            let duration = 0;

            let response_headers: HashMap<String, String> = self
                .get_http_response_headers()
                .into_iter()
                .filter(|(k, _)| self.should_include_header(k))
                .collect();

            let mut attributes = HashMap::new();
            attributes.insert(
                "multiplayer.http.response.headers".to_string(),
                serde_json::to_string(&response_headers).unwrap_or_default()
            );

            let span_data = self.create_span_data(
                &trace_id,
                &span_id,
                &span_id_for_this_span,
                start_time,
                end_time,
                "envoy-proxy response-headers",
                attributes,
            );

            self.send_span_to_collector(&span_data, "envoy_proxy_response_headers");
        }
    }

    fn send_response_body_span(&self, response_body: &str) {
        if !self.should_capture_data() {
            return;
        }
        
        if let (Some(trace_id), Some(span_id)) = (&self.stored_trace_id, &self.stored_span_id) {
            let uuid = Uuid::new_v4();
            let span_id_for_this_span = uuid.to_string().replace("-", "").chars().take(16).collect::<String>();
            
            let now = self.get_current_time();
            let end_time = now.duration_since(std::time::UNIX_EPOCH).unwrap().as_nanos() as u64;
            let start_time = end_time;
            let duration = 0;

            let mut attributes = HashMap::new();
            attributes.insert("multiplayer.http.response.body".to_string(), response_body.to_string());

            let span_data = self.create_span_data(
                &trace_id,
                &span_id,
                &span_id_for_this_span,
                start_time,
                end_time,
                "envoy-proxy response-body",
                attributes,
            );

            self.send_span_to_collector(&span_data, "envoy_proxy_response_body");
        }
    }

    fn send_span_to_collector(&self, span_data: &serde_json::Value, span_name: &str) {
        let path = self.otlp_collector_path.as_ref().unwrap();
        log(LogLevel::Info, &format!("send_span_to_collector called with path: {}", path));
        
        let authority = self.otlp_collector_authority.as_ref().unwrap_or(self.otlp_collector_cluster_name.as_ref().unwrap());
        let mut headers = vec![
            (":path", path.as_str()),
            (":method", "POST"),
            (":authority", authority),
            ("content-type", "application/json"),
            ("user-agent", "envoy-otlp-extension/1.0.0"),
        ];
        
        let auth_header = if let Some(ref api_key) = self.otlp_collector_api_key {
            Some(api_key.clone())
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
