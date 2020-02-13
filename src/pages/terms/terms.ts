import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController,Events } from 'ionic-angular';

/**
 * Generated class for the Terms page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-terms',
  templateUrl: 'terms.html',
})
export class TermsPage {

  visible: boolean;
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public menuCtrl:MenuController,
    public events: Events,
    ) {
      this.events.publish('page-name', 'Terms and Conditions');
    }

  
  ionViewDidLoad() {
    this.menuCtrl.close();
    this.visible = true;
  }

 
}
