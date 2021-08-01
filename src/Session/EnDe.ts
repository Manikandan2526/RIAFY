import * as CryptoJS from 'crypto-js';
import * as environment from "../appConfig";
 
export class EncrDecrService {
  constructor() { }
  
  //The set method is use for encrypt the value.
  encrypt(value: string){     
    if (value == '' || value == undefined ) return '';
    let content = CryptoJS.enc.Utf8.parse(value);
    
    let key = CryptoJS.enc.Utf8.parse(environment.EnDe_Key.Key);
    let iv = CryptoJS.enc.Utf8.parse(environment.EnDe_Key.IV);
    let options = {
      iv: iv
    };
    let encrypted = CryptoJS.AES.encrypt(content, key, options);
    return(encrypted.toString());
  }

  //The get method is use for decrypt the value.
  decrypt(value: string){
    if (value == '' || value == undefined ) return '';
    let content = value;
    let key = CryptoJS.enc.Utf8.parse(environment.EnDe_Key.Key);
    let iv = CryptoJS.enc.Utf8.parse(environment.EnDe_Key.IV);
    var options = {
      iv: iv
    };
    var result = CryptoJS.AES.decrypt(content, key, options);
    return result.toString(CryptoJS.enc.Utf8);
  }

}