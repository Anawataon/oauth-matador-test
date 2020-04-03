import { Component } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';

declare var window: any;

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(
    public navCtrl: NavController,
    private platform: Platform
  ) { }

  public login() {
    this.platform.ready().then(() => {
      this.aisLogin().then(success => {
        alert(success.access_token);
      }, (error) => {
        alert(error);
      });
    });
  }

  public aisLogin(): Promise<any> {
    return new Promise(function (resolve, reject) {
      const browserRef = window.cordova.InAppBrowser.open(
        'https://auth.matadorsuite.com?client_id=matadorsuite-mobile-client&redirect_uri=matadorsuitemobile://callback&response_type=code&scope=email openid profile roles api-matadorsuite api-pop offline_access',
        '_blank',
        'location=no,clearsessioncache=yes,clearcache=yes');

      browserRef.addEventListener('loadstart', (event) => {
        alert('event: ' + event);
        if ((event.url).indexOf('matadorsuitemobile://callback') === 0) {
          browserRef.removeEventListener('exit', (eve) => { });
          browserRef.close();
          const responseParameters = ((event.url).split('#')[1]).split('&');
          const parsedResponse = {};
          for (var i = 0; i < responseParameters.length; i++) {
            parsedResponse[responseParameters[i].split('=')[0]] = responseParameters[i].split('=')[1];
          }
          if (parsedResponse['access_token'] !== undefined && parsedResponse['access_token'] !== null) {
            resolve(parsedResponse);
          } else {
            reject('Problem authenticating with Facebook');
          }
        }
      });
      browserRef.addEventListener('exit', function (eve) {
        reject('The Ais sign in flow was canceled');
      });
    });
  }

  // public facebookLogin(): Promise<any> {
  //   return new Promise(function (resolve, reject) {
  //     const browserRef = cordova.InAppBrowser.open(
  //       'https://www.facebook.com/v2.0/dialog/oauth?client_id=' + '1078498142549887' +
  //       '&redirect_uri=http://localhost/callback&response_type=token&scope=email',
  //        '_blank',
  //        'location=no,clearsessioncache=yes,clearcache=yes');

  //     browserRef.addEventListener('loadstart', (event) => {
  //       if ((event.url).indexOf('http://localhost/callback') === 0) {
  //         browserRef.removeEventListener('exit', (eve) => { });
  //         browserRef.close();
  //         const responseParameters = ((event.url).split('#')[1]).split('&');
  //         const parsedResponse = {};
  //         for (var i = 0; i < responseParameters.length; i++) {
  //           parsedResponse[responseParameters[i].split('=')[0]] = responseParameters[i].split('=')[1];
  //         }
  //         if (parsedResponse['access_token'] !== undefined && parsedResponse['access_token'] !== null) {
  //           resolve(parsedResponse);
  //         } else {
  //           reject('Problem authenticating with Facebook');
  //         }
  //       }
  //     });
  //     browserRef.addEventListener('exit', function (eve) {
  //       reject('The Facebook sign in flow was canceled');
  //     });
  //   });
  // }

}
