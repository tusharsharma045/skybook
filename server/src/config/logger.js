const getTimestamp = () => new Date().toISOString();

export const logger = {
  info: (msg, ...args) => {
    console.log(`[${getTimestamp()}] [INFO]: ${msg}`, ...args);
  },
  warn: (msg, ...args) => {
    console.warn(`[${getTimestamp()}] [WARN]: ${msg}`, ...args);
  },
  error: (msg, ...args) => {
    console.error(`[${getTimestamp()}] [ERROR]: ${msg}`, ...args);
  },
  debug: (msg, ...args) => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`[${getTimestamp()}] [DEBUG]: ${msg}`, ...args);
    }
  },
};
