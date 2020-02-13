import { Component,ViewChild, ElementRef} from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController,Events } from 'ionic-angular';
import { CallNumber } from '@ionic-native/call-number';


declare var google;
/**
 * Generated class for the Contactus page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-contactus',
  templateUrl: 'contactus.html',
})
export class ContactusPage {

  visible: boolean;
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public menuCtrl:MenuController,
    private callNumber: CallNumber,
    public events: Events,
    ) {
      this.events.publish('page-name', 'Contact Us');
    }

  
  ionViewDidLoad() {
    this.menuCtrl.close();
    this.visible = true;
    this.loadMap();
  }

  loadMap() {
    let latLng = new google.maps.LatLng(22.641780, 88.430730);

    let mapOptions = {
      center: latLng,
      zoom: 7,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    var locations = [
      ['Dadis Collection, Diamond Plaza Mall 1st floor', 22.641780, 88.430730, 1],
      ['Dadis Collection, Suncity Mall (Barasat)', 22.719340, 88.486020, 2],
      ['Dadis Collection, Lake Mall', 22.524760, 88.351730, 3],
      ['Dadis Collection, Junction Mall (Durgapur) 1st floor', 23.529090, 87.351540, 4],
      ['Dadis Collection, Axis Mall (Spencers)', 22.579530, 88.459868, 5],
      ['Dadis Collection, New Town Square (Spencers)', 22.614940, 88.466030, 6],
      ['Dadis Collection, Southcity Mall (Spencers)', 22.501240, 88.348778, 7],
      ['Dadis Collection, City Hyper (B.T. Road Spencers)', 22.659000, 88.376910, 8],
    ];

    var marker, i;
    var infowindow = new google.maps.InfoWindow();
    for (i = 0; i < locations.length; i++) {
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(locations[i][1], locations[i][2]),
        map: this.map
      });

      google.maps.event.addListener(marker, 'click', (function (marker, i) {
        return function () {
          infowindow.setContent(locations[i][0]);
          infowindow.open(this.map, marker);
        }
      })(marker, i));
    }

  }


  addInfoWindow(marker, content) {

    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });

  }

  call(number) {
    this.callNumber.callNumber(number, true);
  }
 
}
