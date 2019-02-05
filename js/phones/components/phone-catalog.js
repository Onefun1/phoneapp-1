import Component from '../../component.js';

import Paginator from './paginator.js';

const DEFAULT_ITEMS_PER_PAGE = 3;

export default class PhoneCatalog extends Component {
  constructor({ element }) {
    super({ element });

    this._phones = [];

    this.on('click', 'details-link', (event) => {
      const phoneElement = event.target.closest('[data-element="phone"]');

      this.emit('phone-selected', phoneElement.dataset.phoneId);
    });

    this.on('click', 'add-button', (event) => {
      const phoneElement = event.target.closest('[data-element="phone"]');

      this.emit('phone-added', phoneElement.dataset.phoneId);
    });
  }

  show(phones) {
    super.show();
    // when come Back from phone-viewer we do not need to fetch phones from server
    if (!phones) {
      return;
    }

    this._phones = phones;

    this._render();

    this._initPaginator();
  }

  _initPaginator() {
    this._perPage = this._perPage || DEFAULT_ITEMS_PER_PAGE;

    this._paginatorTop = new Paginator({
      element: document.querySelector('[data-component="paginator-top"]'),
      perPage: this._perPage,
      position: 'top',
    });

    this._paginatorBottom = new Paginator({
      element: document.querySelector('[data-component="paginator-bottom"]'),
      perPage: this._perPage,
      position: 'bottom',
    });

    const displayPhones = ({
      phoneElements, phonesToShow, currentPageNumber, perPage, emitter,
    }) => {
      [...phoneElements].forEach((phoneElement) => {
        if ([...phonesToShow].includes(phoneElement)) {
          phoneElement.style.display = 'block';
        } else {
          phoneElement.style.display = 'none';
        }
      });
      // эта логика вынесена чтоб 2 пагинатора синхронизировались по кол-ву страниц и по текущей стр
      this._paginatorTop._changePaginatorInfo();

      if (emitter === 'show') {
        return;
      }

      if (emitter === 'selector') {
        this._paginatorTop._renderPageNumbers(perPage);
        this._paginatorBottom._renderPageNumbers(perPage);
        this._paginatorTop._setSelectedOptionOnTop();
        this._perPage = perPage;
      }

      this._paginatorTop._changeCurrentPage(currentPageNumber);
      this._paginatorBottom._changeCurrentPage(currentPageNumber);
    };

    this._paginatorTop.subscribe('paginate', displayPhones);
    this._paginatorBottom.subscribe('paginate', displayPhones);

    this._paginatorTop.show(this._phones.length);
    this._paginatorBottom.show(this._phones.length);
  }

  _render() {
    this._element.innerHTML = `
      <div data-component="paginator-top"></div>
      <ul class="phones">
        ${ this._phones.map(phone => `
        
          <li
            data-element="phone"
            data-phone-id="${ phone.id }"
            class="thumbnail"
          >
            <a
              data-element="details-link"
              href="#!/phones/${ phone.id }"
              class="thumb"
            >
              <img
                alt="${ phone.name }"
                src="${ phone.imageUrl }"
              >
            </a>
  
            <div class="phones__btn-buy-wrapper">
              <button class="btn btn-success" data-element="add-button">
                Add
              </button>
            </div>
  
            <a
              data-element="details-link"
              href="#!/phones/motorola-xoom-with-wi-fi"
            >
              ${ phone.name }
            </a>
            
            <p>${ phone.snippet }</p>
          </li>
        
        
        `).join('') }
      </ul>
      <div data-component="paginator-bottom"></div>
    `;
  }
}
