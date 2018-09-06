/**
 * <DynamicOptionList />
 */

import React from 'react';
import {guid} from '../../../../utils/CommonUtil';
import SelectWidget from './SelectWidget';
import {Col} from "react-bootstrap";

export default class CascadeActionList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            element: this.props.element,
            data: this.props.data,
            dirty: false
        }
    }

    editOption =(option_index, e) => {
        let target = e.target ? e.target: e;
        let key = target.name;
        let val = target.value;
        let this_element = this.state.element;
        this_element.cascadeActions[option_index][key] = val;
        this.setState({
            element: this_element,
            dirty: true
        },()=>{
            this.updateOption();
        });
    }

    updateOption =()=> {
        let this_element = this.state.element;
        // to prevent ajax calls with no change
        if (this.state.dirty) {
            this.props.updateElement.call(this.props.preview, this_element);
            this.setState({dirty: false});
        }
    }

    addOption = (index) => {
        let this_element = this.state.element;
        this_element.cascadeActions.splice(index + 1, 0, { value: '', actionType:'',actionTypeValue:'',cascadeActionField:'',key: 'cascade_option_' + guid()},);
        this.props.updateElement.call(this.props.preview, this_element);
    }

    removeOption = (index) => {
        let this_element = this.state.element;
        this_element.cascadeActions.splice(index, 1);
        this.props.updateElement.call(this.props.preview, this_element);
    }

    render() {
        return (
            <div className="dynamic-option-list">
                <ul>
                    <li>
                        <div className="row">
                            <div className="col-sm-3"><b>When Value</b></div>
                            <div className="col-sm-3"><b>Action Type</b></div>
                            <div className="col-sm-3"><b>Cascade Fields</b></div>
                            <div className="col-sm-3"></div>
                        </div>
                    </li>
                    {
                        this.props.element.cascadeActions && this.props.element.cascadeActions.map((option, index) => {
                            let this_key = 'editActions_' + option.key;
                            return (
                                <li className="clearfix" key={this_key}>
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <input className="form-control" type="text" name={'value'} placeholder="Value"
                                                   value={option.value} onBlur={this.updateOption} onChange={this.editOption.bind(this, index)}/>
                                        </div>
                                        <div className="col-sm-3">
                                            <Col>
                                                <SelectWidget options={[{value:'show',label:'Show'},{value:'hidden',label:'Hidden'},{value:'required',label:'Required'},{value:'value',label:'Value'}]}
                                                              value={option.actionType}
                                                              onChange={(e)=>{
                                                                  e.name = 'actionType';
                                                                  this.editOption(index,e)
                                                              }}
                                                              clearable={false} name={'actionType'} placeholder="Action"/>
                                            </Col>
                                           <Col>
                                               <input className={option.actionType==='value'?"form-control":'hidden' }
                                                      type="text" name={'actionTypeValue'}
                                                      style={{width:"100%",marginTop:"5px"}}
                                                      value={option.actionTypeValue} onBlur={this.updateOption} onChange={this.editOption.bind(this, index)}/>
                                           </Col>
                                        </div>
                                        <div className="col-sm-3">
                                            <input className="form-control" type="text" name={'cascadeActionField'} placeholder="Action Field"
                                                   value={option.cascadeActionField} onBlur={this.updateOption}
                                                   onChange={this.editOption.bind(this, index)}/>
                                        </div>
                                        <div className="col-sm-3">
                                            <div className="dynamic-options-actions-buttons">
                                                <button onClick={this.addOption.bind(this, index)}
                                                        className="btn btn-success"><i className="fa fa-plus-circle"></i></button>
                                                { index > 0 &&
                                                <button onClick={this.removeOption.bind(this, index)}
                                                        className="btn btn-danger"><i className="fa fa-minus-circle"></i></button>
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