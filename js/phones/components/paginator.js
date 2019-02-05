import Component from '../../component.js';

const DEFAULT_ITEMS_PER_PAGE = 3;

export default class Paginator extends Component {
  constructor({ element, perPage, position }) {
    super({ element });
    this._perPage = perPage;
    this._position = position;
    this._render();

    this.on('click', 'page-number', (event) => {
      if (this._currentPage === +event.target.dataset.pageNum) {
        return;
      }
      this.emit('paginate', this._getPhonesToShow('pageNum', event));
    });

    this.on('change', 'per-page', () => {
      this._perPage = +this._element.querySelector('[data-element="per-page"]').selectedOptions[0].value;
      this.emit('paginate', this._getPhonesToShow('selector'));
    });
  }

  show(phonesAmount) {
    this._phonesAmount = phonesAmount;
    this._currentPage = 0;
    this.emit('paginate', this._getPhonesToShow('show'));

    this._renderPageNumbers(this._perPage);
    this._setSelectedOptionOnTop();

    super.show();
  }

  _getPhonesToShow(emitter, event) {
    const phoneElements = document.querySelectorAll('[data-element="phone"]');
    const phonesToShow = [];

    this._firstElemIndexOnPage = 0;
    this._lastElemIndexOnPage = this._perPage;

    if (event) {
      this._currentPage = +event.target.dataset.pageNum;

      this._firstElemIndexOnPage = this._perPage * this._currentPage;
      this._lastElemIndexOnPage = this._firstElemIndexOnPage + this._perPage;
      if (this._lastElemIndexOnPage > this._phonesAmount) {
        this._lastElemIndexOnPage = this._phonesAmount;
      }
    }

    for (let i = this._firstElemIndexOnPage; i < this._lastElemIndexOnPage; i++) {
      phonesToShow.push(phoneElements[i]);
    }
    const currentPageNumber = emitter === 'selector' ? 0 : this._currentPage;
    const perPage = this._perPage;

    return {
      phoneElements, phonesToShow, currentPageNumber, perPage, emitter,
    };
  }

  _render() {
    let innerHtml = '';

    if (this._position === 'top') {
      innerHtml = `
      <select data-element = "per-page" class = "paginator-selector">
        <option value="${DEFAULT_ITEMS_PER_PAGE}">${DEFAULT_ITEMS_PER_PAGE}</option>
        <option value="5">5</option>
        <option value="10">10</option>
      </select> entries to show
      <span data-element = "page-numbers" class = "paginator"></span>
      `;
    } else {
      innerHtml = `
      <span data-element = "page-numbers" class = "paginator"></span>
      <span data-element = "page-info" class = "paginator-info"></span>
      `;
    }

    this._element.innerHTML = innerHtml;
  }

  _renderPageNumbers(perPage) {
    if (this._phonesAmount === 0) {
      return;
    }
    this._perPage = perPage;
    const amntOfPages = Math.ceil(this._phonesAmount / perPage);
    let pageNumbers = '';

    if (amntOfPages > 1) {
      pageNumbers = '<span data-element = "page-number" data-page-num = "0" class = "paginator-element"><-</span>';

      for (let i = 0; i < amntOfPages; i++) {
        pageNumbers += `
               <span data-element = "page-number" data-page-num = "${i}" class = "paginator-element">${i + 1}</span>
              `;
      }

      pageNumbers += '<span data-element = "page-number" data-page-num = "1" class = "paginator-element">-></span>';
    }

    this._element.querySelector('[data-element = "page-numbers"]').innerHTML = pageNumbers;
  }

  _setSelectedOptionOnTop() {
    const select = this._element.querySelectorAll('[data-element = "per-page"] option');
    [...select].forEach((el) => {
      if (+el.value === this._perPage) {
        el.selected = true;
      }
    });
  }

  _changeCurrentPage(currentPageNumber) {
    const currentPageClass = 'paginator-current';
    const pageNumbersBtns = this._element.querySelector('[data-element = "page-numbers"]').children;
    const amntOfPageBtns = pageNumbersBtns.length;
    const prevPage = pageNumbersBtns[0];
    const nextPage = pageNumbersBtns[amntOfPageBtns - 1];

    prevPage.dataset.pageNum = currentPageNumber === 0 ? 0 : currentPageNumber - 1;
    nextPage.dataset.pageNum = currentPageNumber === amntOfPageBtns - 3 ? amntOfPageBtns - 3 : currentPageNumber + 1;

    for (let i = 1; i < amntOfPageBtns - 1; i++) {
      if (currentPageNumber === i - 1) {
        pageNumbersBtns[i].classList.add(currentPageClass);
      } else {
        pageNumbersBtns[i].classList.remove(currentPageClass);
      }
    }
  }

  _changePaginatorInfo() {
    const lastOnPage = this._lastElemIndexOnPage > this._phonesAmount
      ? this._phonesAmount : this._lastElemIndexOnPage;
    this._element.parentElement.querySelector('[data-element = "page-info"]').innerHTML = `Showing from ${this._firstElemIndexOnPage + 1} to ${lastOnPage} of ${this._phonesAmount} entries`;
  }
}
