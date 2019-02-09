import Component from '../../component.js';

const DEFAULT_ITEMS_PER_PAGE = 3;

export default class Paginator extends Component {
  constructor({ element, perPage, position }) {
    super({ element });
    this._perPage = perPage;
    this._position = position;
    this._currentPageIndex = 0;

    this._render();

    this.on('click', 'page-number', (event) => {
      if (this._currentPageIndex === +event.target.dataset.pageNum) {
        return;
      }
      this.emit('paginate', this._getIndexesToShow('pageNum', event));
    });

    this.on('change', 'per-page', () => {
      this._perPage = +this._element.querySelector('[data-element="per-page"]').selectedOptions[0].value;
      this.emit('paginate', this._getIndexesToShow('selector'));
    });
  }

  show(phonesAmount) {
    this._phonesAmount = phonesAmount;
    this._currentPageIndex = 0;

    this._renderPageNumbers(this._perPage);

    super.show();
  }

  _getIndexesToShow(emitter, event) {
    this._firstElemIndexOnPage = 0;
    this._lastElemIndexOnPage = this._perPage;

    if (event) {
      this._currentPageIndex = +event.target.dataset.pageNum;

      this._firstElemIndexOnPage = this._perPage * this._currentPageIndex;
      this._lastElemIndexOnPage = this._firstElemIndexOnPage + this._perPage;
      if (this._lastElemIndexOnPage > this._phonesAmount) {
        this._lastElemIndexOnPage = this._phonesAmount;
      }
    }

    const firstElementIndex = this._firstElemIndexOnPage;
    const lastElementIndex = this._lastElemIndexOnPage;
    const currentPageNumber = emitter === 'selector' ? 0 : this._currentPageIndex;
    const perPage = this._perPage;

    return {
      firstElementIndex, lastElementIndex, currentPageNumber, perPage, emitter,
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

  _changeCurrentPage(currentPageIndex) {
    this._currentPageIndex = currentPageIndex;
    const currentPageClass = 'paginator-current';
    const pageNumbersBtns = this._element.querySelector('[data-element = "page-numbers"]').children;
    const amntOfPageBtns = pageNumbersBtns.length;
    const prevPage = pageNumbersBtns[0];
    const nextPage = pageNumbersBtns[amntOfPageBtns - 1];

    prevPage.dataset.pageNum = currentPageIndex === 0 ? 0 : currentPageIndex - 1;
    nextPage.dataset.pageNum = currentPageIndex === amntOfPageBtns - 3 ? amntOfPageBtns - 3 : currentPageIndex + 1;

    for (let i = 1; i < amntOfPageBtns - 1; i++) {
      if (currentPageIndex === i - 1) {
        pageNumbersBtns[i].classList.add(currentPageClass);
      } else {
        pageNumbersBtns[i].classList.remove(currentPageClass);
      }
    }
  }

  _changePaginatorInfo() {
    let content = '';
    if (this._phonesAmount === 0) {
      content = 'Sorry, there are no phones under';
    } else {
      const lastOnPage = this._lastElemIndexOnPage > this._phonesAmount
        ? this._phonesAmount : this._lastElemIndexOnPage;
      content = `Showing from ${this._firstElemIndexOnPage + 1} to ${lastOnPage} of ${this._phonesAmount} entries`;
    }

    this._element.parentElement.querySelector('[data-element = "page-info"]').innerHTML = content;
  }
}
