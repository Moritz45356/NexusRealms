function stamp() {
  return new Date().toISOString();
}

export default {
  info(message, meta) {
    if (meta && Object.keys(meta).length) {
      console.log(`[INFO  ${stamp()}] ${message}`, meta);
    } else {
      console.log(`[INFO  ${stamp()}] ${message}`);
    }
  },
  warn(message, meta) {
    console.warn(`[WARN  ${stamp()}] ${message}`, meta ?? '');
  },
  error(message, err) {
    console.error(`[ERROR ${stamp()}] ${message}`);
    if (err) console.error(err);
  },
};
