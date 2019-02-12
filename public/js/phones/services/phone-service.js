const BASE_URL = 'https://samvimes01.github.io/phoneapp/';

const PhoneService = {

  async getAll({ query = '', sortBy = '' } = {}) {
    const phonesFromServer = await this._sendRequest('/phones/phones');
    const regexp = new RegExp(query, 'i');

    return phonesFromServer
      .filter(phone => regexp.test(phone.name))
      .sort((a, b) => {
        switch (typeof a[sortBy]) {
          case 'number':
            return a[sortBy] - b[sortBy];

          case 'string':
            return a[sortBy].localeCompare(b[sortBy]);

          default:
            return 1;
        }
      });
  },

  getById(phoneId) {
    return this._sendRequest(`/phones/${ phoneId }`);
  },

  _sendRequest(url) {
    return fetch(`${ BASE_URL }${ url }.json`)
      .then(response => response.json())
      .catch((error) => {
        console.warn(error);

        return Promise.reject(error);
      });
  },
};

export default PhoneService;
