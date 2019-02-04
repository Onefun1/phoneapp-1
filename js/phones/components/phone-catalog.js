import Component from '../../component.js';

const DEFAULT_ITEMS_PER_PAGE = 3;
export default class PhoneCatalog extends Component {
  constructor({ element }) {
    super({ element });

    this._phones = [];

    this._render();

    this.on('click', 'details-link', (event) => {
      const phoneElement = event.target.closest('[data-element="phone"]');

      this.emit('phone-selected', phoneElement.dataset.phoneId);
    });

    this.on('click', 'add-button', (event) => {
      const phoneElement = event.target.closest('[data-element="phone"]');

      this.emit('phone-added', phoneElement.dataset.phoneId);
    });

    this.on('click', 'page-number', (event) => {
      if (this._currentPage === +event.target.dataset.pageNum) {
        return;
      }
      this.emit('paginate', this._getPhonesToShow(event));
      this._renderPaginator();
    });

    this.on('change', 'per-page', () => {
      this._perPage = +this._element.querySelector('[data-element="per-page"]').selectedOptions[0].value;
      this.emit('paginate', this._getPhonesToShow());
      this._renderPaginator();
    });
  }

  show(phones) {
    this._phones = phones;
    this._render();

    this._perPage = this._perPage || DEFAULT_ITEMS_PER_PAGE;

    this._currentPage = 0;


    this.emit('paginate', this._getPhonesToShow());
    this._renderPaginator();

    super.show();
  }

  _getPhonesToShow(event) {
    const phoneElements = this._element.querySelectorAll('[data-element="phone"]');
    const phonesToShow = [];

    this._firstItemOnPage = 0;
    this._lastItemOnPage = this._perPage;
    this._currentPage = 0;

    if (event) {
      this._currentPage = +event.target.dataset.pageNum;


      this._firstItemOnPage = this._perPage * this._currentPage;
      this._lastItemOnPage = this._firstItemOnPage + this._perPage;
      if (this._lastItemOnPage > this._phones.length) {
        this._lastItemOnPage = this._phones.length;
      }
    }

    for (let i = this._firstItemOnPage; i < this._lastItemOnPage; i++) {
      phonesToShow.push(phoneElements[i]);
    }

    return { phoneElements, phonesToShow };
  }

  _renderPaginator() {
    if (this._phones.length === 0) {
      return;
    }
    const amntOfPgs = Math.ceil(this._phones.length / this._perPage);
    let pageNumbers = '';
    const prevPage = this._currentPage === 0 ? 0 : this._currentPage - 1;
    const nextPage = this._currentPage === amntOfPgs - 1 ? amntOfPgs - 1 : this._currentPage + 1;

    if (amntOfPgs > 1) {
      pageNumbers = `<span data-element = "page-number" data-page-num = "${prevPage}" class = "paginator-element">Previous</span>`;
  
      for (let i = 0; i < amntOfPgs; i++) {
        const currentPageClass = this._currentPage === i ? ' paginator-current' : '';

        pageNumbers += `
               <span data-element = "page-number" data-page-num = "${i}" class = "paginator-element${currentPageClass}">${i + 1}</span>
              `;
      }

      pageNumbers += `<span data-element = "page-number" data-page-num = "${nextPage}" class = "paginator-element">Next</span>`;
    }

    const paginatorTop = `
    <span data-element = "pages" class = "paginator">
    <select data-element = "per-page" class = "paginator-selector">
      <option value="${DEFAULT_ITEMS_PER_PAGE}">${DEFAULT_ITEMS_PER_PAGE}</option>
      <option value="5">5</option>
      <option value="10">10</option>
      <option value="${this._phones.length}">${this._phones.length}</option>
    </select>
    ${pageNumbers}
    </span>
    `;

    const lastOnPage = this._lastItemOnPage > this._phones.length
      ? this._phones.length : this._lastItemOnPage;

    const paginatorBottom = `
    <span data-element = "pages" class = "paginator">
      ${pageNumbers}
      <span class = "paginator-info">Showing ${this._firstItemOnPage + 1} to ${lastOnPage} of ${this._phones.length} entries</span>
    </span>
    `;

    if (this._element.querySelector('[data-element = "pages"]')) {
      this._element.querySelector('[data-element = "pages"]').remove();
      this._element.querySelector('[data-element = "pages"]').remove();
    }
    this._element.insertAdjacentHTML('afterbegin', paginatorTop);
    this._element.insertAdjacentHTML('beforeend', paginatorBottom);

    const select = this._element.querySelectorAll('[data-element = "per-page"] option');
    Array.prototype.forEach.call(select, (el) => {
      if (+el.value === this._perPage) {
        el.selected = true;
      }
    });
  }

  _render() {
    if (this._phones.length === 0) {
      this._element.innerHTML = 'There is no such phones';
      return;
    }
    this._element.innerHTML = `
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
    `;
  }
}
