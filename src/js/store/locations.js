import api from "../services/apiService";
import { formatDate } from "../helpers/date";
class Locations {
  constructor(api, helper){
   this.api = api;
   this.countries = null;
   this.cities = null;
   this.shortCitiesList = {};
   this.lastSearch = {};
   this.airlines = {};
   this.formatDate = helper.formatDate;
   }

   async init() {
     const response = await Promise.all([
      this.api.countries(),
      this.api.cities(),
      this.api.airlines(),
     ]);
     const [countries, cities, airlines] = response;
     this.countries = this.serializeCountries(countries);
     this.cities = this.serializeCities(cities);
     this.airlines = this.serializeAirlines(airlines);
     this.shortCitiesList = this.createShortCitiesList(this.cities);


     return response;
   }

   getCityNameByCode(code) {
     return this.cities[code].name_translations.en;
   }

   getCityCodeByKey(key){
    const city = Object.values(this.cities).find(
      item => item.full_name === key,
      );
      return city.code;
   }

   createShortCitiesList(cities) {
     return Object.entries(cities).reduce((acc, [key, value]) => {
      acc[value.full_name] = null;
      return acc;
     }, {});
   }

   serializeTickets(tickets) {
     return Object.values(tickets).map(ticket => {
      return {
        ...ticket,
        origin_name: this.getCityNameByCode(ticket.origin),
        destination_name: this.getCityNameByCode(ticket.destination),
        airline_logo: this.getAirlineLogoByCode(ticket.airline),
        airline_name: this.getAirlineNameByCode(ticket.airline),
        departure_at: this.formatDate(ticket.departure_at, "dd MMM yyyy hh:mm"),
        return_at: this.formatDate(ticket.return_at, "dd MMM yyyy hh:mm"),
      }
     })
   }

   serializeCountries(countries){
    return countries.reduce((acc, country) => {
     acc[country.code] = country;
     return acc;
    }, {});
   }

   serializeCities(cities) {
    return cities.reduce((acc, city) => {
      const country_name = this.getCountryNameByCode(city.country_code);
      const city_name = city.name_translations.en;
      const full_name = `${city.name_translations.en},${country_name}`;
      acc[city.code] = {
       ...city,
       country_name,
       full_name,
      };
      return acc;
    }, {});
   }

   serializeAirlines(airlines) {
     return airlines.reduce((acc, airline) => {
       airline.name = airline.name_translations.en;
       airline.logo = `http://pics.avs.io/200/200/${airline.code}.png`;
       acc[airline.code] = airline;
       return acc;
     }, {});
   }

   getCountryNameByCode(code) {
     return this.countries[code].name_translations.en;
   }

   getAirlineNameByCode(code) {
    return this.airlines[code] ? this.airlines[code].name : "";
   }
   getAirlineLogoByCode(code) {
    return this.airlines[code] ? this.airlines[code].logo : "";
   }


   async fetchTickets(params) {
    const response = await this.api.prices(params);
    this.lastSearch = this.serializeTickets(response.data);
    console.log(this.lastSearch);
   }
}
const locations = new Locations(api, { formatDate });
export default locations;