# frozen_string_literal: true

# Configuration for the CLI example
module Config
  # OpenTelemetry API configuration
  MULTIPLAYER_OTLP_KEY = ENV['MULTIPLAYER_OTLP_KEY'] || 'your-api-key-here'
  MULTIPLAYER_TRACES_ENDPOINT = ENV['MULTIPLAYER_TRACES_ENDPOINT'] || 'https://api.multiplayer.com/v1/otlp/traces'
  MULTIPLAYER_LOGS_ENDPOINT = ENV['MULTIPLAYER_LOGS_ENDPOINT'] || 'https://api.multiplayer.com/v1/otlp/logs'
  
  # Application configuration
  ENVIRONMENT = ENV['ENVIRONMENT'] || 'development'
  COMPONENT_NAME = ENV['COMPONENT_NAME'] || 'session-recorder-cli'
  COMPONENT_VERSION = ENV['COMPONENT_VERSION'] || '1.0.0'
  
  # Session configuration
  SESSION_NAME = ENV['SESSION_NAME'] || 'cli-example-session'
  SESSION_VERSION = ENV['SESSION_VERSION'] || '1.0.0'
  
  # Debug and logging
  DEBUG = ENV['DEBUG'] == 'true'
  LOG_LEVEL = ENV['LOG_LEVEL'] || 'INFO'
  
  # Sampling configuration
  SAMPLING_RATIO = (ENV['SAMPLING_RATIO'] || '0.1').to_f
  
  # Display configuration info
  def self.display_config
    puts "🔧 Configuration:"
    puts "   Environment: #{ENVIRONMENT}"
    puts "   Component: #{COMPONENT_NAME} v#{COMPONENT_VERSION}"
    puts "   Session: #{SESSION_NAME} v#{SESSION_VERSION}"
    puts "   Sampling Ratio: #{SAMPLING_RATIO * 100}%"
    puts "   Debug Mode: #{DEBUG}"
    puts "   Log Level: #{LOG_LEVEL}"
    puts "   Traces Endpoint: #{MULTIPLAYER_TRACES_ENDPOINT}"
    puts "   Logs Endpoint: #{MULTIPLAYER_LOGS_ENDPOINT}"
    puts "   API Key: #{MULTIPLAYER_OTLP_KEY[0..8]}..." if MULTIPLAYER_OTLP_KEY != 'your-api-key-here'
    puts ""
  end
  
  # Validate required configuration
  def self.validate
    errors = []
    
    if MULTIPLAYER_OTLP_KEY == 'your-api-key-here'
      errors << "MULTIPLAYER_OTLP_KEY must be set to a valid API key"
    end
    
    if errors.any?
      puts "❌ Configuration errors:"
      errors.each { |error| puts "   #{error}" }
      puts ""
      puts "Set environment variables or update config.rb"
      false
    else
      true
    end
  end
end
