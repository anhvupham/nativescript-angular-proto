/**
 * Location
 */
export class Location {
  id: string;
  name: string;
  placeId: string;
  constructor(id: string, name: string, placeId: string) {
    this.id = id;
    this.name = name;
    this.placeId = placeId;
  }
}