'use strict';

class PhonesPage {
  constructor({ element }) {
    this._element = element;

    this._render();

    this._catalog = new PhoneCatalog({
      element: document.querySelector('[data-component="phone-catalog"]')
    });
  }

  _render() {
    this._element.innerHTML = `
      <div class="row">
        <!--Sidebar-->
        <div class="col-md-2">
          <section>
            <p>
              Search:
              <input>
            </p>
    
            <p>
              Sort by:
              <select>
                <option value="name">Alphabetical</option>
                <option value="age">Newest</option>
              </select>
            </p>
          </section>
    
          <section>
            <p>Shopping Cart</p>
            <ul>
              <li>Phone 1</li>
              <li>Phone 2</li>
              <li>Phone 3</li>
            </ul>
          </section>
        </div>
    
        <!--Main content-->
        <div class="col-md-10">
          <div data-component="phone-catalog"></div>
        </div>
      </div>
    `;
  }
}