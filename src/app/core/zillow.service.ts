import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import * as xml2js from 'xml2js';

@Injectable()
export class ZillowService {

  zwsid = "X1-ZWz18r0mq9vd3f_aypsc";

  constructor(private http: Http) { }

  createApiUrl(service: string) {
    return `http://www.zillow.com/webservice/${service}.htm?zws-id=${this.zwsid}`;
  }

  getHttpXmlAsJson(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
      return this.http.get(url).take(1).subscribe((results: any) => {
        xml2js.parseString(results._body, (err, parsed) => {
          console.log(parsed);
          if (err) reject(err);
          else resolve(parsed);
        });
      });
    });
  }

  getDeepSearchResults(address: string, citystatezip: string): Promise<any> {
    const base_url = this.createApiUrl('GetDeepSearchResults');
    const url = base_url + `&address=${address}&citystatezip=${citystatezip}`;
    return this.getHttpXmlAsJson(url);
  }

  getUpdatedPropertyDetails(address: string, citystatezip: string) {
    const base_url = this.createApiUrl('GetUpdatedPropertyDetails');
    return this.getDeepSearchResults(address, citystatezip).then(searchResults => {
      const zpid = searchResults['SearchResults:searchresults'].response[0].results[0].result[0].zpid[0];
      const url = base_url + `&zpid=${zpid}`;
      return this.getHttpXmlAsJson(url);
    })
  }

}