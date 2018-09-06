/**
 * <DynamicOptionList />
 */

import React from 'react';
import {guid} from '../../../../utils/CommonUtil';

export default class DynamicOptionList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            element: this.props.element,
            data: this.props.data,
            dirty: false
        }
    }

    _setValue(text) {
        return text.replace(/[^A-Z0-9]+/ig, "_").toLowerCase();
    }

    editOption(option_index, e) {
        let this_element = this.state.element;
        let val = (this_element.options[option_index].value !== this._setValue(this_element.options[option_index].label)) ? this_element.options[option_index].value : this._setValue(e.target.value)

        this_element.options[option_index].label = e.target.value;
        this_element.options[option_index].value = val;
        this.setState({
            element: this_element,
            dirty: true
        });
    }

    editValue(option_index, e) {
        let this_element = this.state.element;
        let val = (e.target.value === '') ? this._setValue(this_element.options[option_index].label) : e.target.value;
        this_element.options[option_index].value = val;
        this.setState({
            element: this_element,
            dirty: true
        });
    }

    updateOption() {
        let this_element = this.state.element;
        // to prevent ajax calls with no change
        if (this.state.dirty) {
            this.props.updateElement.call(this.props.preview, this_element);
            this.setState({dirty: false});
        }
    }

    addOption(index) {
        let this_element = this.state.element;
        this_element.options.splice(index + 1, 0, {value: '', label: '', key: guid()});
        this.props.updateElement.call(this.props.preview, this_element);
    }

    removeOption(index) {
        let this_element = this.state.element;
        this_element.options.splice(index, 1);
        this.props.updateElement.call(this.props.preview, this_element);
    }

    render() {
        return (
            <div className="dynamic-option-list">
                <ul>
                    <li>
                        <div className="row">
                            <div className="col-sm-4"><b>Fixed Options</b></div>
                            <div className="col-sm-4"><b>Value</b></div>
                            <div className="col-sm-4"></div>
                        </div>
                    </li>
                    {
                        this.props.element.options.map((option, index) => {
                            let this_key = 'edit_' + option.key;
                            let val = (option.value !== this._setValue(option.label)) ? option.value : ''
                            return (
                                <li className="clearfix" key={this_key}>
                                    <div className="row">
                                        <div className="col-sm-4">
                                            <input tabIndex={index + 1} className="form-control" style={{width: '100%'}}
                                                   type="text"
                                                   name={'label_' + index} placeholder="Option text"
                                                   value={option.label}
                                                   onBlur={this.updateOption.bind(this)}
                                                   onChange={this.editOption.bind(this, index)}/>
                                        </div>
                                        <div className="col-sm-4">
                                            <input className="form-control" type="text" name={'value_' + index}
                                                   value={val} onBlur={this.updateOption.bind(this)}
                                                   onChange={this.editValue.bind(this, index)}/>
                                        </div>
                                        <div className="col-sm-4">
                                            <div className="dynamic-options-actions-buttons">
                                                <button onClick={this.addOption.bind(this, index)}
                                                        className="btn btn-success"><i
                                                    className="fa fa-plus-circle"></i></button>
                                                { index > 0 &&
                                                <button onClick={this.removeOption.bind(this, index)}
                                                        className="btn btn-danger"><i
                                                    className="fa fa-minus-circle"></i></button>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        );
    }
}