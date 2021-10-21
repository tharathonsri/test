module.exports = {
  env: 'uat2',
  UTILITY_PORT: parseInt(process.env.UTILITY_PORT) || 3001,
  JAEGER_AGENT_HOST: process.env.JAEGER_AGENT_HOST || '172.16.3.70',
  JAEGER_AGENT_PORT: parseInt(process.env.JAEGER_AGENT_PORT) || 6832,
  JAEGER_SERVICE_NAME: process.env.JAEGER_SERVICE_NAME || "mari-api-utility-uat2",
  ENABLE_JAEGER: process.env.ENABLE_JAEGER || false,
  ENABLE_CONSOLE_LOGGING: process.env.ENABLE_CONSOLE_LOGGING || false,
  UTILITY_CONFIG: process.env.UTILITY_CONFIG || { }
};
