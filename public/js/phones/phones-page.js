import Component from '../component.js';
import PhoneCatalog from './components/phone-catalog.js';
import PhoneViewer from './components/phone-viewer.js';
import Filter from './components/filter.js';
import ShoppingCart from './components/shopping-cart.js';
import PhoneService from './services/phone-service.js';
import Paginator from './components/paginator.js';

export default class PhonesPage extends Component {
  constructor({ element }) {
    super({ element });
    this._state = {
      currentPage: 1,
      phones: [],
      perPage: 5,
    };

    this._render();

    this._initCatalog();
    this._initViewer();
    this._initShoppingCart();
    this._initFilter();
    this._initPaginator();

    this._showPhones();
  }

  get pagesCount() {
    const { perPage, phones } = this._state;

    return Math.ceil(phones.length / perPage);
  }

  _setPage(page) {
    const newPage = Math.min(
      Math.max(1, page), this.pagesCount,
    );

    this.setState({
      currentPage: newPage,
    });

    this._updateView();
  }

  _setPerPage(perPage) {
    this._state = {
      ...this._state,
      perPage,
    };

    this._updateView();
  }

  _initPaginator() {
    const { perPage, currentPage } = this._state;

    this._paginatorTop = new Paginator({
      element: document.querySelector('[data-component="paginator-top"]'),
      props: {
        perPage,
        currentPage,
        pagesCount: this.pagesCount,
        selector: true,
        info: false,
      },
    });

    this._paginatorBottom = new Paginator({
      element: document.querySelector('[data-component="paginator-bottom"]'),
      props: {
        perPage,
        currentPage,
        pagesCount: this.pagesCount,
        selector: false,
        info: true,
      },
    });

    this._paginatorTop.subscribe('page-changed', (currentPageIndex) => {
      this.setState({ currentPage: currentPageIndex });
    });

    this._paginatorTop.subscribe('per-page-changed', (perPageCount) => {
      this.setState({ perPage: perPageCount, currentPage: 1 });
    });

    this._paginatorBottom.subscribe('page-changed', (currentPageIndex) => {
      this.setState({ currentPage: currentPageIndex });
    });
  }

  _initCatalog() {
    this._catalog = new PhoneCatalog({
      element: document.querySelector('[data-component="phone-catalog"]'),
    });

    this._catalog.subscribe('phone-selected', (phoneId) => {
      const detailsPromise = PhoneService.getById(phoneId);

      detailsPromise.then((phoneDetails) => {
        this._catalog.hide();
        this._paginatorTop.hide();
        this._paginatorBottom.hide();
        this._viewer.show(phoneDetails);
      });
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
      this._catalog.show();
      this._paginatorTop.show();
      this._paginatorBottom.show();
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

  _updateView() {
    const { phones, currentPage, perPage } = this._state;
    const startIndex = (currentPage - 1) * perPage;
    const endIndex = startIndex + perPage;
    const visiblePhones = phones.slice(startIndex, endIndex);

    const paginationProps = {
      pagesCount: this.pagesCount,
      currentPage,
      perPage,
      totalItems: phones.length,
    };
    this._paginatorTop.setProps(paginationProps);
    this._paginatorBottom.setProps(paginationProps);
    this._catalog.show(visiblePhones);
  }

  async _showPhones() {
    const currentFiltering = this._filter.getCurrentData();

    const phones = await PhoneService.getAll(currentFiltering);

    this.setState({
      phones,
      currentPage: 1,
    });
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
          <div data-component="paginator-top" class="paginator"></div>
          <div data-component="phone-catalog"></div>
          <div data-component="paginator-bottom" class="paginator"></div>
          <div data-component="phone-viewer" hidden></div>
        </div>
      </div>
    `;
  }
}
