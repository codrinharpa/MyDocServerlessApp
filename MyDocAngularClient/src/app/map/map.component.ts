import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ElementRef,ViewChild,NgZone } from '@angular/core';
import { FormControl } from '@angular/forms';

import { AgmCoreModule,MapsAPILoader } from '@agm/core';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
    public _latitude: number ;
    public _longitude: number ;
    public markerLatitude: number ;
    public markerLongitude: number ;
    public searchControl: FormControl;
    public zoom: number;
    @Output() latLngChanged = new EventEmitter<any>();
    @ViewChild("mapSearch")
    public searchElementRef: ElementRef;

    constructor(
      private mapsAPILoader: MapsAPILoader,
      private ngZone: NgZone
    ) {}

    @Input('latitude') 
    set latitude(latitude:string){
      this._latitude = Number(latitude);
      this.markerLatitude = this._latitude;
    }
    @Input('longitude') 
    set longitude(longitude:string){
      this._longitude = Number(longitude);
      this.markerLongitude = this._longitude;
    }
    
    ngOnInit() {
      //set google maps defaults
      this.zoom = 12;
      this._latitude = 45.9432;
      this._longitude = 24.9668;
      this.markerLatitude = this._latitude;
      this.markerLongitude = this._longitude;
      
      //create search FormControl
      this.searchControl = new FormControl();
      
      //set current position
      this.setCurrentPosition();
      
      //load Places Autocomplete
      this.mapsAPILoader.load().then(() => {
        let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
          types: ["address"]
        });
        autocomplete.addListener("place_changed", () => {
          this.ngZone.run(() => {
            //get the place result
            let place: google.maps.places.PlaceResult = autocomplete.getPlace();
    
            //verify result
            if (place.geometry === undefined || place.geometry === null) {
              return;
            }
            
            //set latitude, longitude and zoom
            this._latitude = place.geometry.location.lat();
            this._longitude = place.geometry.location.lng();
            this.markerLatitude = this._latitude;
            this.markerLongitude = this._longitude;
            this.zoom = 18;
          });
        });
      });
    }

    onDragEnd(event){
      this.markerLatitude = event.coords.lat;
      this.markerLongitude = event.coords.lng;
      this.latLngChanged.emit({
        latitude:this.markerLatitude,
        longitude:this.markerLongitude
      });
    }
    setCurrentPosition() {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          console.log('suntem aici');
          this._latitude = position.coords.latitude;
          this._longitude = position.coords.longitude;
          this.zoom = 12;
        });
      }
    }

}
