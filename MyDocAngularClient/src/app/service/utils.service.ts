import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders} from '@angular/common/http';
import { environment } from "../../environments/environment";
const endpoint = environment.utilsServiceEndpoint;
@Injectable()
export class UtilsService {

  constructor(private httpClient: HttpClient) {}
 
    // Uses http.get() to load data from a single API endpoint
    getLocations(){
      let route = '/locations';
      return this.httpClient.get(endpoint + route);
    }
    getPracticeTypes(){
      let route = '/practiceTypes';
      return this.httpClient.get(endpoint + route);
    }

    getSpecializations(practiceType){
      let route = '/specializations/';
      return this.httpClient.get(endpoint + route + practiceType);
    }
}
