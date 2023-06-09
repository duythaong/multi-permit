import chalk from "chalk";

const originalLog = console.log;
console.log = (msg) => originalLog(`[${getFormattedDate()}] ${msg}`);

const pad = (d) => d < 10 ?  `0${d}` : `${d}`;
  
const getFormattedDate = () => {
    const date = new Date();
    let str, minutes, seconds;
    minutes = pad(date.getMinutes());
    seconds = pad(date.getSeconds());
    str = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + minutes + ':' + seconds;
    return str;
}

export default class Message {
	error(message) { console.log(chalk.hex('#F62020')(message)); }
	success(message) { console.log(chalk.hex('#669EE8')(message)); }
	primary(message) { console.log(chalk.hex('#EBF0FA')(message)); }
	warning(message) { console.log(chalk.hex('#E8BF66')(message)); }
}