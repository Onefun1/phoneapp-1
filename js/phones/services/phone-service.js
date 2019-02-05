const PhoneService = {
  baseurl: '../../../',

  phonesDir: 'phones/',

  getAll({ query = '', sortBy = '' } = {}, callback) {
    this._sendRequest(`${this.baseurl}${this.phonesDir}phones.json`, (phonesFromServer) => {
      const filteredPhones = this._filter(phonesFromServer, query);
      const sortedPhones = this._sortBy(filteredPhones, sortBy);

      callback(sortedPhones);
    });
  },

  getById(phoneId, callback) {
    this._sendRequest(`${this.baseurl}${this.phonesDir}${phoneId}.json`, callback);
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

  _sendRequest(url, callback) {
    const xhr = new XMLHttpRequest();

    xhr.open('GET', url);

    xhr.onload = () => {
      if (xhr.status !== 200) {
        console.log(`${ xhr.status } ${ xhr.statusText }`);
        return {};
      }

      const data = JSON.parse(xhr.responseText);

      callback(data);
    };

    xhr.send();
  },
};

export default PhoneService;
