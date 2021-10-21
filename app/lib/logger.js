// new version logger by riya

const os = require('os');
const uuid = require('uuid');
const { initTracer, opentracing } = require("jaeger-client");
const config_service = require("../../config/config");
const ENABLE_CONSOLE_LOGGING = config_service.ENABLE_CONSOLE_LOGGING || false;

const reporter = {
  logSpans: true,
  agentHost: config_service.JAEGER_AGENT_HOST || "172.19.70.145",
  agentPort: config_service.JAEGER_AGENT_PORT || 30061
}

sampler = {
  type: "probabilistic",
  param: 1.0
}


const options = {
  tags: {
    "mari-utility.version": "1.0.0"
  }
};


async function log(level, action, message, data) {
  if(String(config_service.ENABLE_JAEGER).toUpperCase() == 'TRUE'){
    let dt = new Date();
    this.log_print.container_name = os.hostname();
    this.log_print.timestamp = dt.toISOString();
    this.log_print.level = level || this.log_print.level;
    this.log_print.action = action || this.log_print.action;
    this.log_print.message = message || this.log_print.message;
    this.log_print.log_message = message || this.log_print.message;
    this.log_print.data = data || this.log_print.data;

    if (this.log_print.data) this.log_print.data = JSON.stringify(this.log_print.data);

    if (this.span) {

      if (this.log_print.level == this.level.error) this.span.setTag('error', true);
      if (this.log_print.action) this.span.setTag('app.action', this.log_print.action);
      if (this.log_print.message) this.span.setTag('app.message', this.log_print.message);
      if (this.log_print.request_id) this.span.setTag('app.request_id', this.log_print.request_id);
      if (this.log_print.transaction_id) this.span.setTag('app.transaction_id', this.log_print.transaction_id);
      this.span.log(this.log_print);
      this.span.finish();
    }

    this.log_print["@suffix"] = "utility";
    
    if ((this.log_print.level == this.level.error) || (ENABLE_CONSOLE_LOGGING))
      console.log(JSON.stringify(this.log_print));

    if ((this.log_print.message) && (this.log_print.message.indexOf('Maximum call stack size exceeded') > -1))
      process.exit(1);
  }  
}

async function logConsole(level, action, message, data) {

  let dt = new Date();
  this.log_print.container_name = os.hostname();
  this.log_print.timestamp = dt.toISOString();
  this.log_print.level = level || this.log_print.level;
  this.log_print.action = action || this.log_print.action;
  this.log_print.message = message || this.log_print.message;
  this.log_print.log_message = message || this.log_print.message;
  this.log_print.data = data || this.log_print.data;

  if (this.log_print.data) this.log_print.data = JSON.stringify(this.log_print.data);


  //if ((this.log_print.level == this.level.error) || (ENABLE_CONSOLE_LOGGING && ENABLE_CONSOLE_LOGGING == 'true'))
  console.log(JSON.stringify(this.log_print));

}

async function trace(level, action, message, data) {

  let dt = new Date();
  this.log_print.container_name = os.hostname();
  this.log_print.timestamp = dt.toISOString();
  this.log_print.level = level || this.log_print.level;
  this.log_print.action = action || this.log_print.action;
  this.log_print.message = message || this.log_print.message;
  this.log_print.data = data || this.log_print.data;

  if (this.span) {
    if (this.log_print.level == this.level.error) this.span.setTag('error', true);
    if (this.log_print.action) this.span.setTag('app.action', this.log_print.action);
    if (this.log_print.message) this.span.setTag('app.message', this.log_print.message);
    if (this.log_print.request_id) this.span.setTag('app.request_id', this.log_print.request_id);
    if (this.log_print.transaction_id) this.span.setTag('app.transaction_id', this.log_print.transaction_id);
    this.span.log(this.log_print);
    this.span.finish();
  }
}

const config = {
  serviceName: config_service.JAEGER_SERVICE_NAME,
  reporter: reporter,
  sampler: sampler
};

const tracer = initTracer(config, options);

module.exports = function (req, spanName, parentLogger = {}, data = {}) {

  let logger = {
    log,
    logConsole,
    trace,
    tracer,
    opentracing,
    level: { error: 'error', warn: 'warn', info: 'info', success: 'success' },
    log_print: { system: config_service.JAEGER_SERVICE_NAME, data }
  }

  if (req) {
    logger.log_print.ipInfo = req.ipInfo;
    logger.log_print.path = req.path;
    logger.log_print.method = req.method;
  }

  logger.log_print.request_id = logger.log_print.request_id || uuid.v4();

  if (spanName) {

    let parentContext = tracer.extract(opentracing.FORMAT_HTTP_HEADERS, req.headers);
    if (parentContext && parentContext.traceId) {
      logger.span = tracer.startSpan(spanName, { childOf: parentContext });
    } else {
      if (parentLogger && parentLogger.span) {
        logger.span = tracer.startSpan(spanName, {
          childOf: parentLogger.span.context(),
        });
      } else {
        logger.span = tracer.startSpan(spanName);
      }
    }
  }

  if (req && logger.span) {
    logger.span.setTag('http.method', req.method);
    logger.span.setTag('http.url', req.path);
  }

  return logger;

};
