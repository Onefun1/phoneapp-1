const PhoneService = {
  baseurl: '../../../',

  phonesDir: 'phones/',

  async getAll({ query = '', sortBy = '' } = {}) {
    console.log(`Query: ${query}, sortBy ${sortBy} `);

    const phonesFromServer = await this._fetchData(`${this.baseurl}${this.phonesDir}phones.json`);

    const filteredPhones = this._filter(phonesFromServer, query);
    const sortedPhones = this._sortBy(filteredPhones, sortBy);

    return sortedPhones;
  },

  async getById(phoneId) {
    // return phonesDetails.find(phone => phone.id === phoneId);
    const phone = await this._fetchData(`${this.baseurl}${this.phonesDir}${phoneId}.json`);
    return phone;
  },

  _filter(phones, query) {
    if (!query) {
      return phones;
    }
    return phones.filter(phone => phone.name
      .toLocaleLowerCase().includes(query.toLocaleLowerCase()));
  },

  _sortBy(phones, sortBy) {
    if (sortBy === 'age') {
      return phones.sort((a, b) => a.age - b.age);
    }
    if (sortBy === 'name') {
      return phones.sort((a, b) => a.name.localeCompare(b.name));
    }
    return phones;
  },

  async _fetchData(url) {
    // const result = {status: '', statusText: '', response: {}};

    // const xhr = new XMLHttpRequest();

    // xhr.open('GET', url);

    // xhr.onload = function() {
    //   result.status = xhr.status;
    //   result.statusText = xhr.statusText;
    //   result.response = JSON.parse(xhr.responseText);
    // }

    // xhr.send();

    const response = await fetch(url);
    const result = await response.text();

    return JSON.parse(result);
  },
};

export default PhoneService;
