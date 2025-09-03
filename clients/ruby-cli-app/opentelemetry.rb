# frozen_string_literal: true

require 'opentelemetry/sdk'
require 'opentelemetry/exporter/otlp'
require 'opentelemetry/instrumentation/all'
require 'multiplayer-session-recorder'

module OpenTelemetryConfig
  class << self
    # Initialize OpenTelemetry with SessionRecorder components
    def setup
      # Create custom trace ID generator
      @id_generator = Multiplayer::SessionRecorder::Trace::SessionRecorderIdGenerator.new
      
      # Create custom sampler
      @sampler = Multiplayer::SessionRecorder::Trace::TraceIdRatioBasedSampler.new(Config::SAMPLING_RATIO)
      
      # Create HTTP exporters
      @http_trace_exporter = Multiplayer::SessionRecorder::Exporters.create_http_trace_exporter(
        api_key: Config::MULTIPLAYER_OTLP_KEY,
        endpoint: Config::MULTIPLAYER_TRACES_ENDPOINT
      )
      
      @http_logs_exporter = Multiplayer::SessionRecorder::Exporters.create_http_logs_exporter(
        api_key: Config::MULTIPLAYER_OTLP_KEY,
        endpoint: Config::MULTIPLAYER_LOGS_ENDPOINT
      )
      
      # Create wrappers to filter out multiplayer attributes
      @trace_exporter_wrapper = Multiplayer::SessionRecorder::Exporters.create_trace_exporter_wrapper(@http_trace_exporter)
      @logs_exporter_wrapper = Multiplayer::SessionRecorder::Exporters.create_logs_exporter_wrapper(@http_logs_exporter)
      
      # Configure OpenTelemetry
      OpenTelemetry::SDK.configure do |c|
        # Set custom tracer provider with id_generator and sampler
        c.tracer_provider = OpenTelemetry::SDK::Trace::TracerProvider.new(
          id_generator: @id_generator,
          sampler: @sampler
        )
        
        # Add trace exporters
        c.add_span_processor(
          OpenTelemetry::SDK::Trace::Export::BatchSpanProcessor.new(@trace_exporter_wrapper)
        )
        
        # Add log processors
        c.add_log_processor(
          OpenTelemetry::SDK::Trace::Export::BatchLogRecordProcessor.new(@logs_exporter_wrapper)
        )
        
        # Enable all instrumentation
        c.use_all
      end
      
      puts "✅ OpenTelemetry configured with SessionRecorder" if Config::DEBUG
      
      # Return the configured components
      {
        id_generator: @id_generator,
        sampler: @sampler,
        trace_exporter: @trace_exporter_wrapper,
        logs_exporter: @logs_exporter_wrapper
      }
    rescue => e
      puts "❌ Failed to configure OpenTelemetry: #{e.message}"
      puts e.backtrace.join("\n") if Config::DEBUG
      raise e
    end
    
    # Get the configured trace ID generator
    def id_generator
      @id_generator
    end
    
    # Get the configured sampler
    def sampler
      @sampler
    end
    
    # Get the configured trace exporter
    def trace_exporter
      @trace_exporter_wrapper
    end
    
    # Get the configured logs exporter
    def logs_exporter
      @logs_exporter_wrapper
    end
    
    # Cleanup OpenTelemetry resources
    def cleanup
      begin
        OpenTelemetry.tracer_provider&.shutdown
        puts "🧹 OpenTelemetry resources cleaned up" if Config::DEBUG
      rescue => e
        puts "⚠️ Error during cleanup: #{e.message}" if Config::DEBUG
      end
    end
  end
end
