import { Request, Response } from "express";
import { dbPool as pool, jwtSecretKey as jwtKey } from "../appConfig";
import * as jwt from 'jsonwebtoken';
import * as moment from "moment"
import { EncrDecrService } from "../Session/EnDe";

const EncryptDecrypt = new EncrDecrService();


export let GetStocks = async (req: Request, res: Response) => {
    try {
        var query: string = "call spGetStocks()";
console.log("Get Stocks")

        pool.getConnection(function (err, connection) {
            if (err) {
                var jsonResponse = JSON.stringify({
                    Data: "Application failed to connect data server { at Order/GetAirlinesForOrders }.",
                    Status: 'invalid'
                });
                var js = JSON.parse(jsonResponse);
               
                res.send(jsonResponse);
                return;
            };
            connection.query(query, function (err, rows, fields) {
                if (!err) {

                    var jsonResponse = JSON.stringify({
                        Data: rows[0],
                        Status: 'valid'
                    });
                }
                else {
                    var jsonResponse = JSON.stringify({
                        Data: err.sqlMessage,
                        Status: 'invalid'
                    });
                    var js = JSON.parse(jsonResponse);
                   
                }
                connection.release();
                res.send(jsonResponse);
            });
        });
    }
    catch (ex) {
        var jsonResponse = JSON.stringify({
            Data: ex,
            Status: 'invalid'
        });
        var js = JSON.parse(jsonResponse);
       
        res.send(jsonResponse);
    }
};
////#endregion
