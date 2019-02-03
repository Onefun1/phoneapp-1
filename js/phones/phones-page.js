import PhoneCatalog from './components/phone-catalog.js';
import PhoneViewer from './components/phone-viewer.js';
import Filter from './components/filter.js';
import ShoppingCart from './components/shopping-cart.js';
import PhoneService from './services/phone-service.js';

export default class PhonesPage {
  constructor({ element, url }) {
    this._element = element;
    PhoneService.baseurl = url;

    this._render();

    this._initFilter();
    this._initCatalog();
    this._initViewer();
    this._initShoppingCart();
  }

  async _initCatalog() {
    this._catalog = new PhoneCatalog({
      element: document.querySelector('[data-component="phone-catalog"]'),
    });

    await this._showPhones();

    this._catalog.subscribe('phone-selected', async (phoneId) => {
      const phoneDetails = await PhoneService.getById(phoneId);

      this._catalog.hide();
      this._viewer.show(phoneDetails);
    });

    this._catalog.subscribe('phone-added', (phoneId) => {
      this._cart.add(phoneId);
    });
  }

  _initViewer() {
    this._viewer = new PhoneViewer({
      element: document.querySelector('[data-component="phone-viewer"]'),
    });

    this._viewer.subscribe('back', () => {
      this._viewer.hide();
      this._showPhones();
    });

    this._viewer.subscribe('add', (phoneId) => {
      this._cart.add(phoneId);
    });
  }

  _initShoppingCart() {
    this._cart = new ShoppingCart({
      element: document.querySelector('[data-component="shopping-cart"]'),
    });
  }

  _initFilter() {
    this._filter = new Filter({
      element: document.querySelector('[data-component="filter"]'),
    });

    this._filter.subscribe('order-changed', () => {
      this._showPhones();
    });

    this._filter.subscribe('query-changed', () => {
      this._showPhones();
    });
  }

  async _showPhones() {
    const currentFiltering = this._filter.getCurrentData();
    const phones = await PhoneService.getAll(currentFiltering);

    this._catalog.show(phones);
  }

  _render() {
    this._element.innerHTML = `
      <div class="row">

        <!--Sidebar-->
        <div class="col-md-2" data-element="sidebar" ref="(element) => { this._thumb = element }">
          <section>
            <div data-component="filter"></div>
          </section>
    
          <section>
            <div data-component="shopping-cart"></div>
          </section>
        </div>
    
        <!--Main content-->
        <div class="col-md-10">
          <div data-component="phone-catalog"></div>
          <div data-component="phone-viewer" hidden></div>
        </div>
      </div>
    `;
  }
}
