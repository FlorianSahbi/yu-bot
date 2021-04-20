import { format } from "date-fns";

function debuggerLog(date, fileName, message) {
  console.log(`DEBUG::${format(date, 'dd/MM/yyyy HH:mm:ss')}::${fileName} - ${message}`);
}

export default debuggerLog;
