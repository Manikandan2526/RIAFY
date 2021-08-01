import "reflect-metadata";
import * as mysql from "mysql"

//SECRET FOR JSON WEB TOKEN
export let jwtSecretKey = 'k3DIAdfb10aAjweU32rhSjpYn38W6G3p';


export let EnDe_Key = {
	Key: '3jEYde6723812djowWfCFtwnmd720JSs',
	IV: 'kI1fhd72362hdalkjfUDnqw237EHzFYe'
};


/* DATABASE CONNECTION */

export let dbPool = mysql.createPool
({		
		host: 'database-1.cpncchyhaxib.us-east-2.rds.amazonaws.com',
		user: 'admin',
		password: 'Borntowin$123',
		port: 3306,
		database: 'Stocks',
		connectionLimit : 100	
 });


