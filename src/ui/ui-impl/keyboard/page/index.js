/*
 * @Author: Demian
 * @Date: 2020-04-16 20:03:47
 * @LastEditor: Demian
 * @LastEditTime: 2020-04-26 18:06:01
 */
define(function (require) {
  const kity = require('kity');
  const $$ = require('ui/ui-impl/ui-utils');
  const Page = kity.createClass('Page', {
    constructor(parentNode, parentProps) {
      this.parentNode = parentNode;
      this.props = parentProps;
      this.prefix = parentProps.prefix + 'keyboard-page';
      this.elementList = [
        { type: 'prev', title: '上一页', index: 0 },
        { type: 'next', title: '下一页', index: 1 },
      ];

      this.state = {
        type: this.props.type,
        page: this.props.page,
        totalPage: this.props.totalPage,
      };

      this.containerClassName = this.prefix;
      this.listClassName = `${this.prefix}-list`;
      this.itemClassName = `${this.prefix}-list-item`;
      this._onClick = this._onClick.bind(this);
    },
    _render: function () {
      return $$.ele(this.props.doc, 'div', {
        className: this.containerClassName,
        content: `
          <ul id="${this.prefix}" class="${this.listClassName}">
            <li class="${this.itemClassName} ${
          this.itemClassName
        }-delete" data-value="delete"></li>
            ${this.elementList
              .map(
                (x) =>
                  `<li class="${this.itemClassName} ${this.itemClassName}-${x.type} ${
                    isDisabled.call(this, x.type) ? this.itemClassName + '-disabled' : ''
                  }" data-value="${x.type}"></li>`
              )
              .join('')}
            <li class="${this.itemClassName} ${
          this.itemClassName
        }-ok" data-value="submit">完成</li>
          </ul>
        `,
      });
      function isDisabled(type) {
        if (type === 'prev') {
          return this.state.page === 0 && this.state.type === 'common';
        } else if (type === 'next') {
          return this.state.page === this.state.totalPage - 1 && this.state.type === 'other';
        }
      }
    },
    mount: function () {
      const node = this._render();
      $$.delegate(this.parentNode, '.' + this.itemClassName, 'click', this._onClick);
      this.parentNode.appendChild(node);
    },
    update: function (nextProps) {
      if (!this._shouldUpdate(nextProps)) return;
      Object.keys(nextProps)
        .filter((x) => x in this.state)
        .forEach((x) =>
          this._setState({
            [x]: nextProps[x],
          })
        );
      const node = this._render();
      $('.' + this.prefix).html(node);
    },
    _shouldUpdate: function (nextProps) {
      const isSame = Object.keys(this.state).every((x) => nextProps[x] === this.state[x]);
      if (isSame) {
        return false;
      }
      return true;
    },
    _onClick: function (e) {
      const val = e.target.dataset.value;
      switch (val) {
        case 'next':
          this.props.onNextPage();
          break;
        case 'prev':
          this.props.onPrevPage();
          break;
        case 'delete':
          this.props.onDelete();
          break;
        case 'submit':
          this.props.onSubmit();
          break;
      }
    },
    _setState: function (nextState) {
      this.state = {
        ...this.state,
        ...nextState,
      };
    },
  });
  return Page;
});
