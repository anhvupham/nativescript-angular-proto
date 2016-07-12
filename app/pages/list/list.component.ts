import {Component} from "@angular/core";
import {Location} from "../../shared/location/location";
import {CONFIG} from "../../shared/config/config";
import geolocation = require("nativescript-geolocation");
import http = require("http");
import {Router} from '@angular/router';

@Component({
  selector: "loc-list",
  templateUrl: "pages/list/list.component.html",
})
export class ListComponent {
  locations: Array<Location> = [];

  constructor(private _router: Router) { }

  goToDetail(item) {
    this._router.navigate(["/detail"]);
  }

  distance(p1, p2) {
    if (!p1 || !p2)
      return 0;
    var R = 6371000; // Radius of the Earth in m
    var dLat = (p2.lat - p1.lat) * Math.PI / 180;
    var dLon = (p2.lng - p1.lng) * Math.PI / 180;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(p1.lat * Math.PI / 180) * Math.cos(p2.lat * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
  }


  onTap() {
    var isEnabled = geolocation.isEnabled();
    if (!isEnabled) {
      alert("Please turn on location service");
      geolocation.enableLocationRequest();
      return;
    }
    geolocation.getCurrentLocation({}).then(loc => {
      if (loc) {
        var location = {
              lat: loc.latitude,
              lng: loc.longitude
            },
            url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.lat},${location.lng}&radius=500&key=${CONFIG.API}&rankBy=distance`;

        http.getJSON(url).then(r => {
          if (!r["results"]) {
            alert(JSON.stringify(r));
            return;
          }
          this.locations = [];
          r["results"].map(x => {
            return {
              id: x.id,
              name: x.name,
              place_id: x.place_id,
              types: x.types,
              distance: this.distance(location, x.geometry.location)
            }
          }).sort(function (x, y) {
            return x.distance - y.distance;
          }).forEach(loc => {
            var ok = loc.types.reduce((prev, current) => {
              if (prev == true) return true;

              if (CONFIG.EXCLUDE_LOCATION_TYPES.indexOf(current) == -1) {
                return true;
              }
              return false;
            }, "");
            if (ok) {
              this.locations.push(new Location(loc.id, loc.name, loc.place_id));
            }
          });
        }, err => {
          alert("ERROR: " + JSON.stringify(err));
        });
      }
    });
  }
}
