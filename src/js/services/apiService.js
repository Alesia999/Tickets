import axios from "axios";
import config from "../config/apiConfig";
class Api {
  constructor(config){
    this.url = config.url;
  }
  async countries(){
   const response = await axios.get(`${this.url}/countries`);
   return response.data;
  }
  async cities(){
    const response = await axios.get(`${this.url}/cities`);
    return response.data;
  }
  async airlines(){
    const response = await axios.get(`${this.url}/airlines`);
    return response.data;
  }
  async prices(params){
    const response = await axios.get(`${this.url}/prices/cheap`, {
      params,
    });
    return response.data;
    }
}
const api = new Api(config);
export default api;