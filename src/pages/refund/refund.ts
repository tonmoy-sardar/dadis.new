import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController,Events } from 'ionic-angular';

/**
 * Generated class for the Refund page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-refund',
  templateUrl: 'refund.html',
})
export class RefundPage {

  visible: boolean;
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public menuCtrl:MenuController,
    public events: Events,
    ) {
      this.events.publish('page-name', 'Refund Policy');
    }

  
  ionViewDidLoad() {
    this.menuCtrl.close();
    this.visible = true;
  }

 
}
