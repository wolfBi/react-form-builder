/**
 * <Form />
 */

import React from 'react';
import ReactDOM from 'react-dom';
import {EventEmitter} from 'fbemitter';
import { Button } from "react-bootstrap";
import FormValidator from './FormValidator';
import * as FormElements from './FormElements';
import HttpUtil from '../utils/HttpUtil';
import LogUtil from '../utils/LogUtil';
import "../css/application.css";
import "../css/form-builder-form.css";
import "../css/form-builder.css";

export default class ReactFormGenerator extends React.Component {

    form;
    inputs = {};

    constructor(props) {
        super(props);
        this.emitter = new EventEmitter();
    }

    _checkboxesDefaultValue=(item)=> {
        let defaultChecked = [];
        item.options.forEach(option => {
            defaultChecked.push(this.props.answer_data[`option_${option.key}`])
        })
        return defaultChecked;
    }

    _isIncorrect=(item)=> {
        let incorrect = false;
        if (item.canHaveAnswer) {
            const ref = this.inputs[item.field_name];
            if (item.element === 'Checkboxes' || item.element === 'RadioButtons') {
                item.options.forEach(option => {
                    let $option = ReactDOM.findDOMNode(ref.options[`child_ref_${option.key}`]);
                    if ((option.hasOwnProperty('correct') && !$option.checked) || (!option.hasOwnProperty('correct') && $option.checked)) {
                        incorrect = true;
                    }
                })
            } else {
                let $item = null
                if (item.element === 'Rating') {
                    $item = {};
                    $item.value = ref.inputField.current.state.rating;
                    if ($item.value.toString() !== item.correct) {
                        incorrect = true;
                    }
                } else {
                    if (item.element === 'AsyncDropdown') {
                        $item = {};
                        $item.value = ref.inputField.current.state.value
                    } else if (item.element === 'DatePicker') {
                        $item = {};
                        $item.value = ref.inputField.current.state.value
                    } else {
                        $item = ReactDOM.findDOMNode(ref.inputField.current);
                        $item.value = $item.value.trim();
                    }

                    if ($item.value.toLowerCase() !== item.correct.trim().toLowerCase()) {
                        incorrect = true;
                    }
                }
            }
        }
        return incorrect;
    }

    _isInvalid =(item,formData)=> {
        let invalid = false;

        if (item.required === true) {
            let val = formData[item.field_name]
            if(val ==='' || val === null || val === undefined){
                invalid = true;
            }

            // const ref = this.refs[item.field_name].refs[`child_ref_${item.field_name}`];
            // if (item.element === 'Checkboxes' || item.element === 'RadioButtons') {
            //     let checked_options = 0;
            //     item.options.forEach(option => {
            //         let $option = ReactDOM.findDOMNode(this.refs[item.field_name].refs[`child_ref_${option.key}`]);
            //         if ($option.checked) {
            //             checked_options += 1;
            //         }
            //     })
            //     if (checked_options < 1) {
            //         // errors.push(item.label + ' is required!');
            //         invalid = true;
            //     }
            // } else {
            //     let $item = null
            //     if (item.element === 'Rating') {
            //         $item = {};
            //         $item.value = ref.state.rating;
            //         if ($item.value === 0) {
            //             invalid = true;
            //         }
            //     } else {
            //         if (item.element === 'AsyncDropdown') {
            //             $item = {};
            //             $item.value = ref.state.value
            //         } else if (item.element === 'DatePicker') {
            //             $item = {};
            //             $item.value = ref.state.value
            //         } else {
            //             $item = ReactDOM.findDOMNode(ref);
            //             $item.value = $item.value.trim();
            //         }
            //
            //         if ($item.value === undefined || $item.value.length < 1) {
            //             invalid = true;
            //         }
            //     }
            // }
        }
        return invalid;
    }

    handleSubmit = (e) => {
        e.preventDefault();

        let formData =  new FormData(this.form);
        let realFormData ={}
        for (var key of formData.keys()) {
            realFormData[key] = formData.get(key)
        }
        let errors = this.validateForm(realFormData);
        // Publish errors, if any.
        this.emitter.emit('formValidation', errors);
        // Only submit if there are no errors.
        if (errors.length < 1) {
            let formData = {};
            if(this.props.formData){
                formData =  this.props.formData;
            }
            formData.formData =  JSON.stringify(realFormData);
            HttpUtil.post(this.props.form_action,formData).then((responseData)=>{
                if(responseData){
                    LogUtil.info(responseData);
                }
                if(this.props.submitCallback){
                    this.props.submitCallback();
                }
            });
        }else{
            LogUtil.info("form data ",realFormData)
        }
    }

    validateForm =(formData)=> {
        let errors = [];
        let data_items = this.props.data;

        if (this.props.display_short) {
            data_items = this.props.data.filter((i) => i.alternateForm === true);
        }

        data_items && data_items.forEach(item => {
            if (this._isInvalid(item,formData)) {
                let label = item.label;
                label =label.replace(/<div>/g,'').replace(/<\/div>/g,'');
                errors.push(`${label} is required!`);
            }
            // if (this.props.validateForCorrectness && this._isIncorrect(item)) {
            //     errors.push(`${item.label} was answered incorrectly!`);
            // }
        });

        return errors;
    }

    getInputElement(item) {
        const Input = FormElements[item.element];
        return (<Input
            handleChange={this.handleChange}
            ref={c => this.inputs[item.field_name] = c}
            mutable={true}
            key={`form_${item.id}`}
            data={item}
            read_only={this.props.read_only}
            defaultValue={this.props.answer_data[item.field_name]}/>);
    }

    getSimpleElement(item) {
        const Element = FormElements[item.element];
        return (<Element mutable={true} key={`form_${item.id}`} data={item}/>);
    }

    render() {
        let data_items = this.props.data;

        if (this.props.display_short) {
            data_items = this.props.data.filter((i) => i.alternateForm === true);
        }

        data_items && data_items.forEach((item) => {
            if (item.readOnly && item.variableKey && this.props.variables[item.variableKey]) {
                this.props.answer_data[item.field_name] = this.props.variables[item.variableKey];
            }
        });

        let items = data_items && data_items.map(item => {
            switch (item.element) {
                case 'TextInput':
                case 'NumberInput':
                case 'TextArea':
                case 'Dropdown':
                case 'DatePicker':
                case 'TimePicker':
                case 'RadioButtons':
                case 'Rating':
                case 'Tags':
                case 'Range':
                    return this.getInputElement(item);
                case 'Checkboxes':
                    return <FormElements.Checkboxes ref={c => this.inputs[item.field_name] = c}
                                                    read_only={this.props.read_only}
                                                    handleChange={this.handleChange} mutable={true}
                                                    key={`form_${item.id}`} data={item}
                                                    defaultValue={this._checkboxesDefaultValue(item)}/>
                case 'Image':
                    return <FormElements.Image ref={c => this.inputs[item.field_name] = c}
                                               handleChange={this.handleChange} mutable={true}
                                               key={`form_${item.id}`} data={item}
                                               defaultValue={this.props.answer_data[item.field_name]}/>
                case 'Download':
                    return <FormElements.Download mutable={true}
                                                  key={`form_${item.id}`} data={item}/>
                case 'UploadFile':
                    return <FormElements.UploadFile url={this.props.upload_path} read_only={this.props.read_only}
                                                    mutable={true} key={`form_${item.id}`} data={item}/>
                case 'AsyncDropdown':
                    return <FormElements.AsyncDropdown token={this.props.token} read_only={this.props.read_only}
                        mutable={true} key={`form_${item.id}`} data={item} />
                case 'FMNO':
                    return <FormElements.FMNO token={this.props.token} read_only={this.props.read_only}
                                   mutable={true} key={`form_${item.id}`} data={item}/>
                case 'CCTextInput':
                    return <FormElements.CCTextInput token={this.props.token} read_only={this.props.read_only}
                                                       mutable={true} key={`form_${item.id}`} data={item}/>
                default:
                    return this.getSimpleElement(item);
            }
        })

        let actionName = (this.props.action_name) ? this.props.action_name : 'Submit';
        let backName = (this.props.back_name) ? this.props.back_name : 'Cancel';

        return (
            <div>
                <FormValidator emitter={this.emitter}/>
                <form encType='multipart/form-data' ref={c => this.form = c} action={this.props.form_action}
                      onSubmit={this.handleSubmit} method={this.props.form_method}>
                    <div className='react-form-builder-form'>
                        {items}
                        <div className='btn-toolbar pull-right'>
                            { !this.props.hide_actions &&
                            <Button className='btn btn-school btn-big btn-agree' onClick={this.handleSubmit} >{actionName}</Button>
                            }
                            { !this.props.hide_actions && this.props.back_action &&
                            <Button onClick={this.props.back_action}
                               className='btn btn-default btn-cancel btn-big'>{backName}</Button>
                            }
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

ReactFormGenerator.defaultProps = {validateForCorrectness: false};
