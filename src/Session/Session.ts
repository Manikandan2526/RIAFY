import { Request, Response } from "express";
import { dbPool as pool, jwtSecretKey as jwtKey } from "../appConfig";
import * as jwt from 'jsonwebtoken';
import * as moment from "moment"
import { EncrDecrService } from "../Session/EnDe";

const EncryptDecrypt = new EncrDecrService();


export let GetLoginDetail = async (req: Request, res: Response) => {
    try {
        console.log(req.body)
        var query: string = "call spGetLoginDetail(?,?)";
        var input: string[] = [req.body.LoginUserName, EncryptDecrypt.decrypt(req.body.LoginPassword)]
        pool.getConnection(function (err, connection) {
            if (err) {
                var jsonResponse = JSON.stringify({
                    Data: "Application failed to connect data server { at Session/GetLoginDetail }.",
                    Status: 'invalid'
                });
                var js = JSON.parse(jsonResponse);
                
                res.send(jsonResponse);
                return;
            };
            console.log(input)
            connection.query(query, input, function (err, rows, fields) {
                if (!err) {
                    var row = rows[0][0];
                    let EnDe = new EncrDecrService();
                    var objLogin = {
                        Ref: EnDe.encrypt(row.LoginId),
                        Name: row.Name,
                       
                    }
                    let kie = EnDe.encrypt(req.connection.remoteAddress + req.headers['user-agent']);
                    var jsonResponse = JSON.stringify({
                        Data: objLogin,
                        Token: jwt.sign({
                            LoginId: row.LoginId,
                            DisplayName: row.DisplayName,
                            kie: kie
                        }, jwtKey, {
                            expiresIn: '24h' // expires in 24 hours
                        }),
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

export let ValidateLoginUserName = async (req: Request, res: Response) => {
    try {
        var query: string = "call spValidateLoginUserName(?)";
        console.log(req.body)
        var input: string[] = [req.body.LoginUserName]
        pool.getConnection(function (err, connection) {
            if (err) {
                var jsonResponse = JSON.stringify({
                    Data: "Application failed to connect data server { at Session/ValidateLoginEmail }.",
                    Status: 'invalid'
                });
               
                res.send(jsonResponse);
                return;
            };
            console.log(input);
            connection.query(query, input, function (err, rows, fields) {
                console.log(rows)
                if (!err) {
                    var row = rows[0][0];
                    var result: any = {
                        UserNameExist: row.UserNameExist == 1 ? true : false,
                        Name: row.UserNameExist == 1 ? row.Name : "",
                       
                    }
                    var jsonResponse = JSON.stringify({
                        Data: result,
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
        console.log("error in log"+ex);
        var jsonResponse = JSON.stringify({
            Data: ex,
            Status: 'invalid'
        });
        var js = JSON.parse(jsonResponse);
        
        res.send(jsonResponse);
    }
};

////#endregion
