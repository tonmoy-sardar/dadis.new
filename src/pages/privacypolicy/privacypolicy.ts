import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController,Events } from 'ionic-angular';

/**
 * Generated class for the Privacypolicy page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-privacypolicy',
  templateUrl: 'privacypolicy.html',
})
export class PrivacypolicyPage {

  visible: boolean;
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public menuCtrl:MenuController,
    public events: Events,
    ) {
      this.events.publish('page-name', 'Privacy Policy');
    }

  
  ionViewDidLoad() {
    this.menuCtrl.close();
    this.visible = true;
  }

 
}
