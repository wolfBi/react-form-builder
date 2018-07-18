/**
 * <HeaderBar />
 */

import React from 'react';
import FA from 'react-fontawesome'

const cssModule = {
  fa: 'fas',
  'fa-pencil': 'fa-pencil-alt',
  'fa-trash': 'fa-trash',
}
export default class HeaderBar extends React.Component {
  render() {
    return (
      <div className="toolbar-header">
        <span className="label label-default">{this.props.data.text}</span>
        <div className="toolbar-header-buttons">
          { this.props.data.element !== "LineBreak" &&
          <div className="btn is-isolated btn-school"
               onClick={this.props.editModeOn.bind(this.props.parent, this.props.data)}>
            <FA name="pencil" cssModule={cssModule} />
          </div>
          }
          <div className="btn is-isolated btn-school" onClick={this.props.onDestroy.bind(this, this.props.data)}>
            <FA name="trash" cssModule={cssModule} />
          </div>
        </div>
      </div>
    );
  }
}