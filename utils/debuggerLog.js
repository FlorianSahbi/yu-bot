const { format } = require("date-fns");

exports.debuggerLog = (date, fileName, message) => {
  console.log(`DEBUG::${format(date, 'dd/MM/yyyy HH:mm:ss')}::${fileName} - ${message}`);
}
