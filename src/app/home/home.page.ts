import { Component, ViewChild, ElementRef } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder,NativeGeocoderOptions, NativeGeocoderReverseResult } from '@ionic-native/native-geocoder/ngx';

declare var google;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild('map') mapElement:ElementRef;
  map:any;
  address:string;

  constructor(public geolocation:Geolocation,public nativeGeocoder:NativeGeocoder)
   {
     this.loadMap();
   }
   loadMap()
   {
     this.geolocation.getCurrentPosition().then((resp)=>
     {
       console.log(resp);
        let latLng=new google.maps.latLng(resp.coords.latitude,resp.coords.longitude);
        let mapOptions=
        {
          center:latLng,
          zoom:15,
          mapTypeId:google.maps.mapTypeId.ROADMAP
        };
        this.getAddressFromCoords(resp.coords.latitude,resp.coords.longitude);
        this.map=new google.maps.Map(this.mapElement.nativeElement,mapOptions);
     });
   }
   getAddressFromCoords(latitude,longitude)
   {
     let options:NativeGeocoderOptions={
        useLocale:true,
        maxResults:5       
     };
     this.nativeGeocoder.reverseGeocode(latitude,longitude,options).then((result:NativeGeocoderReverseResult[])=>
     {
       console.log(result);
        this.address="";
        let responseAddress=[];
        for(let [key,value] of Object.entries(result[0]))
        {
         if(value.length>0)
         {
           responseAddress.push(value);
         }
        }
        responseAddress.reverse();
        for(let value of responseAddress)
        {
          this.address+=value+",";

        }
        this.address=this.address.slice(0,-2);

     }).catch((error:any)=>
     {
       this.address="Address not available";
     });



   }

}
