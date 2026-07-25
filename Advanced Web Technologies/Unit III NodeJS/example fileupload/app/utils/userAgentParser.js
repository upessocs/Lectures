const useragent = require('useragent');

function parseUA(req) {
  const ua = useragent.parse(req.headers['user-agent']);
  return {
    browser: ua.family,
    os: ua.os.toString(),
    device: ua.device.toString()
  };
}

module.exports = parseUA;
