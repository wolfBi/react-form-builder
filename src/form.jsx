/**
 * <Form />
 */

import React from 'react';
import ReactDOM from 'react-dom';
import {EventEmitter} from 'fbemitter';
import FormValidator from './form-validator';
import {Image, Checkboxes, Signature, Download} from './form-elements';
//Header,Paragraph,Label,LineBreak,TextInput,NumberInput,TextArea,Dropdown,DatePicker,RadioButtons,Rating,Tags,HyperLink,Camera,Range,
import * as FormElements from './form-elements';

export default class ReactForm extends React.Component {

  form;
  inputs = {};

  constructor(props) {
    super(props);
    this.emitter = new EventEmitter();
  }

  _checkboxesDefaultValue(item) {
    let defaultChecked = [];
    item.options.forEach(option => {
      defaultChecked.push(this.props.answer_data[`option_${option.key}`])
    })
    return defaultChecked;
  }

  _isIncorrect(item) {
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
          if (item.element === 'Tags') {
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

  _isInvalid(item) {
    let invalid = false;
    if (item.required === true) {
      const ref = this.inputs[item.field_name];
      if (item.element === 'Checkboxes' || item.element === 'RadioButtons') {
        let checked_options = 0;
        item.options.forEach(option => {
          let $option = ReactDOM.findDOMNode(ref.options[`child_ref_${option.key}`]);
          if ($option.checked) {
            checked_options += 1;
          }
        })
        if (checked_options < 1) {
          // errors.push(item.label + ' is required!');
          invalid = true;
        }
      } else {
        let $item = null
        if (item.element === 'Rating') {
          $item = {};
          $item.value = ref.inputField.current.state.rating;
          if ($item.value === 0) {
            invalid = true;
          }
        } else {
          if (item.element === 'Tags') {
            $item = {};
            $item.value = ref.inputField.current.state.value
          } else if (item.element === 'DatePicker') {
            $item = {};
            $item.value = ref.inputField.current.state.value
          } else {
            $item = ReactDOM.findDOMNode(ref.inputField.current);
            $item.value = $item.value.trim();
          }

          if ($item.value === undefined || $item.value.length < 1) {
            invalid = true;
          }
        }
      }
    }
    return invalid;
  }

  _getSignatureImg(item) {
    let $canvas_sig = this.refs[item.field_name].refs[`canvas_${item.field_name}`]
    let base64 = $canvas_sig.toDataURL().replace('data:image/png;base64,', '');
    let isEmpty = $canvas_sig.isEmpty();
    let $input_sig = ReactDOM.findDOMNode(ref.inputField.current);
    if (isEmpty) {
      $input_sig.value = '';
    } else {
      $input_sig.value = base64;
    }
    return true;
  }

  handleSubmit(e) {
    e.preventDefault();

    let $form = ReactDOM.findDOMNode(this.form);
    let errors = this.validateForm();

    // Publish errors, if any.
    this.emitter.emit('formValidation', errors);

    // Only submit if there are no errors.
    if (errors.length < 1) {
      $form.submit();
    }
  }

  validateForm() {
    let errors = [];
    let data_items = this.props.data;

    if (this.props.display_short) {
      data_items = this.props.data.filter((i) => i.alternateForm === true);
    }

    data_items.forEach(item => {
      if (item.element === 'Signature') {
        this._getSignatureImg(item);
      }

      if (this._isInvalid(item)) {
        errors.push(`${item.label} is required!`);
      }

      if (this.props.validateForCorrectness && this._isIncorrect(item)) {
        errors.push(`${item.label} was answered incorrectly!`);
      }
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

    data_items.forEach((item) => {
      if (item.readOnly && item.variableKey && this.props.variables[item.variableKey]) {
        this.props.answer_data[item.field_name] = this.props.variables[item.variableKey];
      }
    });

    let items = data_items.map(item => {
      switch (item.element) {

        case 'TextInput':
        case 'NumberInput':
        case 'TextArea':
        case 'Dropdown':
        case 'DatePicker':
        case 'RadioButtons':
        case 'Rating':
        case 'Tags':
        case 'Range':
          return this.getInputElement(item);
        case 'Checkboxes':
          return <Checkboxes ref={c => this.inputs[item.field_name] = c} read_only={this.props.read_only}
                             handleChange={this.handleChange} mutable={true} key={`form_${item.id}`} data={item}
                             defaultValue={this._checkboxesDefaultValue(item)}/>
        case 'Image':
          return <Image ref={c => this.inputs[item.field_name] = c} handleChange={this.handleChange} mutable={true}
                        key={`form_${item.id}`} data={item} defaultValue={this.props.answer_data[item.field_name]}/>
        case 'Download':
          return <Download download_path={this.props.download_path} mutable={true} key={`form_${item.id}`} data={item}/>
        default:
          return this.getSimpleElement(item);
      }
    })

    let formTokenStyle = {
      display: 'none'
    }

    let actionName = (this.props.action_name) ? this.props.action_name : 'Submit';
    let backName = (this.props.back_name) ? this.props.back_name : 'Cancel';

    return (
      <div>
        <FormValidator emitter={this.emitter}/>
        <div className='react-form-builder-form'>
          <form encType='multipart/form-data' ref={c => this.form = c} action={this.props.form_action}
                onSubmit={this.handleSubmit.bind(this)} method={this.props.form_method}>
            { this.props.authenticity_token &&
            <div style={formTokenStyle}>
              <input name='utf8' type='hidden' value='&#x2713;'/>
              <input name='authenticity_token' type='hidden' value={this.props.authenticity_token}/>
              <input name='task_id' type='hidden' value={this.props.task_id}/>
            </div>
            }
            {items}
            <div className='btn-toolbar'>
              { !this.props.hide_actions &&
              <input type='submit' className='btn btn-school btn-big btn-agree' value={actionName}/>
              }
              { !this.props.hide_actions && this.props.back_action &&
              <a href={this.props.back_action} className='btn btn-default btn-cancel btn-big'>{backName}</a>
              }
            </div>
          </form>
        </div>
      </div>
    )
  }
}

ReactForm.defaultProps = {validateForCorrectness: false};
