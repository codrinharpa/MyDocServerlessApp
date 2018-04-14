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
    public latitude: number ;
    public longitude: number ;
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
    
    ngOnInit() {
      //set google maps defaults
      this.zoom = 12;
      this.latitude = 45.9432;
      this.longitude = 24.9668;
      this.markerLatitude = this.latitude;
      this.markerLongitude = this.longitude;
      
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
            this.latitude = place.geometry.location.lat();
            this.longitude = place.geometry.location.lng();
            this.markerLatitude = this.latitude;
            this.markerLongitude = this.longitude;
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
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          this.zoom = 12;
        });
      }
    }

}
