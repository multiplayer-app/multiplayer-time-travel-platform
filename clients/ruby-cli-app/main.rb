#!/usr/bin/env ruby
# frozen_string_literal: true

require 'bundler/inline'

require_relative 'config'
require_relative 'opentelemetry'

gemfile(true) do
  source 'https://rubygems.org'

  gem 'multiplayer-session-recorder', path: './../..'
end

require 'multiplayer-session-recorder'
require 'logger'
require 'time'

# Configure logging
logger = Logger.new(STDOUT)
logger.level = case Config::LOG_LEVEL.upcase
               when 'DEBUG' then Logger::DEBUG
               when 'INFO' then Logger::INFO
               when 'WARN' then Logger::WARN
               when 'ERROR' then Logger::ERROR
               else Logger::INFO
               end

# Main application class
class CLIApp
  def initialize(logger)
    @logger = logger
    @session_recorder = Multiplayer::SessionRecorder::SessionRecorder.new
    @running = false
  end
  
  # Initialize the application
  def init
    @logger.info("🚀 Initializing CLI application...")
    
    # Setup OpenTelemetry
    @logger.info("📡 Setting up OpenTelemetry...")
    opentelemetry_components = OpenTelemetryConfig.setup
    
    # Initialize SessionRecorder
    @logger.info("🎯 Initializing SessionRecorder...")
    @session_recorder.init({
      api_key: Config::MULTIPLAYER_OTLP_KEY,
      trace_id_generator: opentelemetry_components[:id_generator],
      resource_attributes: {
        component_name: Config::COMPONENT_NAME,
        component_version: Config::COMPONENT_VERSION,
        environment: Config::ENVIRONMENT
      }
    })
    
    @logger.info("✅ Application initialized successfully")
    @logger.info("   Component: #{Config::COMPONENT_NAME} v#{Config::COMPONENT_VERSION}")
    @logger.info("   Environment: #{Config::ENVIRONMENT}")
    @logger.info("   API Key: #{Config::MULTIPLAYER_OTLP_KEY[0..8]}...") if Config::MULTIPLAYER_OTLP_KEY != 'your-api-key-here'
  rescue => e
    @logger.error("❌ Failed to initialize application: #{e.message}")
    @logger.error(e.backtrace.join("\n")) if Config::DEBUG
    raise e
  end
  
  # Start a debug session
  def start_session
    @logger.info("🎬 Starting debug session...")
    
    @session_recorder.start(
      Multiplayer::SessionRecorder::Type::SessionType::PLAIN,
      {
        name: Config::SESSION_NAME,
        resource_attributes: {
          version: Config::SESSION_VERSION
        }
      }
    )
    
    @logger.info("✅ Debug session started")
    @logger.info("   Session ID: #{@session_recorder.short_session_id}")
    @logger.info("   Session Type: #{@session_recorder.session_type}")
    @logger.info("   Session State: #{@session_recorder.session_state}")
    @running = true
  rescue => e
    @logger.error("❌ Failed to start session: #{e.message}")
    @logger.error(e.backtrace.join("\n")) if Config::DEBUG
    raise e
  end
  
  # Simulate some work
  def do_work
    return unless @running
    
    @logger.info("⚙️  Performing some work...")
    
    # Simulate various types of work
    simulate_file_operations
    simulate_network_calls
    simulate_data_processing
    
    @logger.info("✅ Work completed successfully")
  rescue => e
    @logger.error("❌ Work failed: #{e.message}")
    @logger.error(e.backtrace.join("\n")) if Config::DEBUG
  end
  
  # Stop the debug session
  def stop_session
    return unless @running
    
    @logger.info("🛑 Stopping debug session...")
    
    @session_recorder.stop({
      sessionAttributes: {
        comment: "CLI application completed successfully",
        completion_time: Time.now.iso8601,
        work_performed: true
      }
    })
    
    @logger.info("✅ Debug session stopped")
    @running = false
  rescue => e
    @logger.error("❌ Failed to stop session: #{e.message}")
    @logger.error(e.backtrace.join("\n")) if Config::DEBUG
  end
  
  # Run the main application
  def run
    @logger.info("🎯 Starting CLI application...")
    
    begin
      # Initialize
      init
      
      # Start session
      start_session
      
      # Do some work
      do_work
      
      # Stop session
      stop_session
      
      @logger.info("🎉 Application completed successfully!")
      
    rescue => e
      @logger.error("💥 Application failed: #{e.message}")
      
      # Try to stop session if it's running
      if @running
        @logger.info("🔄 Attempting to stop session...")
        begin
          @session_recorder.cancel
          @logger.info("✅ Session cancelled")
        rescue => cancel_error
          @logger.error("❌ Failed to cancel session: #{cancel_error.message}")
        end
      end
      
      raise e
    ensure
      # Cleanup OpenTelemetry resources
      @logger.info("🧹 Cleaning up resources...")
      OpenTelemetryConfig.cleanup
    end
  end
  
  private
  
  # Simulate file operations
  def simulate_file_operations
    @logger.info("📁 Simulating file operations...")
    
    # Create a span for file operations
    OpenTelemetry.tracer_provider.tracer('cli-app').in_span("file_operations") do |span|
      span.set_attribute("operation.type", "file_operations")
      span.set_attribute("operation.count", 3)
      
      # Simulate file reads
      sleep(0.1)
      span.add_event("file.read", attributes: { "filename" => "config.json", "size" => 1024 })
      
      sleep(0.05)
      span.add_event("file.read", attributes: { "filename" => "data.csv", "size" => 2048 })
      
      sleep(0.08)
      span.add_event("file.read", attributes: { "filename" => "log.txt", "size" => 512 })
    end
  end
  
  # Simulate network calls
  def simulate_network_calls
    @logger.info("🌐 Simulating network calls...")
    
    OpenTelemetry.tracer_provider.tracer('cli-app').in_span("network_calls") do |span|
      span.set_attribute("operation.type", "network_calls")
      span.set_attribute("endpoint.count", 2)
      
      # Simulate API call
      sleep(0.2)
      span.add_event("api.call", attributes: { "endpoint" => "/api/users", "method" => "GET", "status" => 200 })
      
      # Simulate database query
      sleep(0.15)
      span.add_event("database.query", attributes: { "query" => "SELECT * FROM users", "rows" => 25 })
    end
  end
  
  # Simulate data processing
  def simulate_data_processing
    @logger.info("🔢 Simulating data processing...")
    
    OpenTelemetry.tracer_provider.tracer('cli-app').in_span("data_processing") do |span|
      span.set_attribute("operation.type", "data_processing")
      span.set_attribute("data.size", 1000)
      
      # Simulate data transformation
      sleep(0.12)
      span.add_event("data.transform", attributes: { "records_processed" => 1000, "transformations" => 5 })
      
      # Simulate validation
      sleep(0.08)
      span.add_event("data.validate", attributes: { "records_validated" => 1000, "errors" => 0 })
    end
  end
end

# Main execution
if __FILE__ == $0
  puts "🎯 SessionRecorder CLI Example"
  puts "=============================="
  puts
  puts "This example demonstrates SessionRecorder usage in a CLI application:"
  puts "1. Initialize OpenTelemetry with SessionRecorder components"
  puts "2. Start a debug session"
  puts "3. Perform simulated work with tracing"
  puts "4. Stop the session and cleanup"
  puts
  
  # Run the application
  app = CLIApp.new(logger)
  
  # Handle graceful shutdown
  Signal.trap("INT") do
    puts "\n🛑 Received interrupt signal, shutting down gracefully..."
    app.stop_session if app.instance_variable_get(:@running)
    OpenTelemetryConfig.cleanup
    exit(0)
  end
  
  Signal.trap("TERM") do
    puts "\n🛑 Received termination signal, shutting down gracefully..."
    app.stop_session if app.instance_variable_get(:@running)
    OpenTelemetryConfig.cleanup
    exit(0)
  end
  
  begin
    app.run
  rescue => e
    puts "💥 Application failed: #{e.message}"
    exit(1)
  end
  
  # Wait a bit before exiting to allow traces to be exported
  puts "⏳ Waiting 15 seconds for traces to be exported..."
  sleep(15)
  puts "👋 Goodbye!"
end
