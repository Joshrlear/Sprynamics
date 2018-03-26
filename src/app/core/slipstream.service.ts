import { Injectable } from '@angular/core'
import { Http, Headers, Response } from '@angular/http'
import { Observable } from 'rxjs/Observable'
import { SlipstreamAPIToken, SlipstreamListings } from '#core/slipstream.interface';

@Injectable()
export class SlipstreamService {

  constructor(private http: Http) { }

  getHttpAsJson(url, options?) {
    return this.http.get(url, options).map((res: Response) => res.json());
  }

  /**
   * Returns a promise resolving to a token for SlipStream API 
   */
  getSlipstreamToken(): Promise<SlipstreamAPIToken> {
    return new Promise((resolve, reject) => {
      const url = 'https://us-central1-sprynamics.cloudfunctions.net/getSlipstreamToken';
      this.getHttpAsJson(url).take(1).subscribe((results: any) => {
        if (results.error) {
          reject(results.error)
        } else {
          resolve(results)
        }
      });
    });
  }

  getListings(licenseId, token: SlipstreamAPIToken): Promise<SlipstreamListings> {
    return new Promise((resolve, reject) => {
      const market = 'cofeed1'
      const url = `https://slipstream.homejunction.com/ws/listings/search?market=${market}&listingagent.id=${licenseId}&images=true`
      const options = {
        headers: new Headers({
          'HJI-Slipstream-Token': token.token
        })
      }
      this.getHttpAsJson(url, options).take(1).subscribe((apiRes: any) => {
        resolve(apiRes.result)
      })
    })
  }

}