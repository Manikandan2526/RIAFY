import * as express from 'express';
import * as bodyParser from "body-parser";
import "reflect-metadata";
import * as appConfig from "./appConfig";
import * as cors from 'cors';
import * as jwt from 'jsonwebtoken';
import { EncrDecrService } from "./Session/EnDe";
import * as sessionAPI from "./Session/Session";
import * as stocksAPI from "./Stocks/Stocks";



/**
 * Create Express server.
 */
const app = express();

app.use(cors());

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
/**
 * Express configuration.
 */
app.set("port", process.env.PORT || 3000);

/**
 * JWT Token Validation Callback. 
 */
const unprotectedPaths = [
    '/',
    '/favicon.ico',
    '/ValidateToken',
    '/ValidateLoginUserName',
    '/GetLoginDetail',
    
];
async function jwtCallback(req: express.Request, res: express.Response, next: express.NextFunction) {
    let found = (unprotectedPaths.some(path => path === req.path.match(/^\/[^\/]*/)[0]));
    if (found) {
        next();
    }
    else {
        try {
            const EnDe = new EncrDecrService();
            let kie = EnDe.encrypt(req.connection.remoteAddress + req.headers['user-agent']);
            let token = (req.headers.authorization || '');
            token = token.substring(7);

            jwt.verify(token, appConfig.jwtSecretKey, function (err: any, result: any) {
                if (err) {
                    res.status(401).send({ message: 'Session invalid or expired, login again to continue.' });
                    return;
                }
                else {
                    if (req.body.Ref) {
                        if (result.LoginId != EnDe.decrypt(req.body.Ref)) {
                            res.status(401).send({ message: 'Session invalid or expired, login again to continue.' });
                            return;
                        }
                    }
                    if (kie == result.kie)
                        next();
                    else {
                        res.status(401).send({ message: 'Session invalid or expired, login again to continue.' });
                        return;
                    }
                }
            });
        }
        catch (error) {
            res.status(401).send({ message: 'Session invalid or expired, login again to continue.' });
            return;
        }
    }
}

app.use(jwtCallback);

/** 
 * Start Express server.
 */
// app.use("/log", express.static(require('path').join(__dirname, 'public')));

// app.use('*/log', express.static('public/log'));
app.listen(app.get("port"), () => {
    console.log((" App is running at http://localhost:%d in %s mode"), app.get("port"), app.get("env"));
}).on('connection', function (socket) {
    // 10 minutes timeout
    socket.setTimeout(10 * 60 * 1000);
});

//API Home
app.get('/', function (req, res) {
    res.send("It's working!");
});


//Validate token function for login
app.post('/ValidateToken', (req, res) => {
    let token = req.body.token;
    try {
        jwt.verify(token, appConfig.jwtSecretKey, function (err: any, result: any) {
            if (err) {
                return res.json("expired");
            }
            let EnDe = new EncrDecrService();
            let kie = EnDe.encrypt(req.connection.remoteAddress + req.headers['user-agent']);
            if (kie != result.kie) {
                return res.json("expired");
            }
            else {
                return res.json("valid");
            }
        });
    } catch (error) {
        return res.json("expired");
    }
});



//Session
app.route('/GetLoginDetail').post(sessionAPI.GetLoginDetail);
app.route('/ValidateLoginUserName').post(sessionAPI.ValidateLoginUserName);


//Stocks
app.route('/GetStocks').post(stocksAPI.GetStocks);





module.exports = app;