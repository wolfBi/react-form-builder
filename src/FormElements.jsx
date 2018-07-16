import React from 'react';
import xss from 'xss';
import moment from 'moment';
import update from 'immutability-helper';
import Select from 'react-select';
import ReactDatePicker from 'react-datepicker';
// import SortableItemMixin from 'react-anything-sortable/SortableItemMixin';
import ReactBootstrapSlider from  'react-bootstrap-slider';
import HeaderBar from './HeaderBar';
import StarRating from './component/StarRating';
import SelectWidget from './component/SelectWidget';
import FineUploader from './component/FineUploader';
import CommonUtils from './CommonUtils';

import 'react-datepicker/dist/react-datepicker.css'

let FormElements = {};
let myxss = new xss.FilterXSS({
  whiteList: {
    u: [],
    br: [],
    b: [],
    i: [],
    a: [],
    ins: [],
    ol: ['style'],
    ul: ['style'],
    li: [],
    p: ['style'],
    sub: [],
    sup: [],
    div: ['style'],
    em: [],
    strong: [],
    span: ['style']
  }
});

class Header extends React.Component {
  // mixins: [SortableItemMixin],
  render() {
    let headerClasses = 'dynamic-input ' + this.props.data.element + '-input';
    let classNames = 'static';
    if (this.props.data.bold) {
      classNames += ' bold';
    }
    if (this.props.data.italic) {
      classNames += ' italic';
    }

    let baseClasses = CommonUtils.getElementsClass(this.props.data);

    return (
      <div className={baseClasses}>
        { !this.props.mutable &&
        <div>
          { this.props.data.pageBreakBefore &&
          <div className="preview-page-break">Page Break</div>
          }
          <HeaderBar parent={this.props.parent} editModeOn={this.props.editModeOn} data={this.props.data}
                     onDestroy={this.props._onDestroy} onEdit={this.props.onEdit} static={this.props.data.static}
                     required={this.props.data.required}/>
        </div>
        }
        <h3 className={classNames} dangerouslySetInnerHTML={{__html: myxss.process(this.props.data.content)}}/>
      </div>
    );
  }
}

class Paragraph extends React.Component {
  // mixins: [SortableItemMixin],
  render() {
    let classNames = 'static';
    if (this.props.data.bold) {
      classNames += ' bold';
    }
    if (this.props.data.italic) {
      classNames += ' italic';
    }

    let baseClasses = CommonUtils.getElementsClass(this.props.data);

    return (
      <div className={baseClasses}>
        { !this.props.mutable &&
        <div>
          { this.props.data.pageBreakBefore &&
          <div className="preview-page-break">Page Break</div>
          }
          <HeaderBar parent={this.props.parent} editModeOn={this.props.editModeOn} data={this.props.data}
                     onDestroy={this.props._onDestroy} onEdit={this.props.onEdit} static={this.props.data.static}
                     required={this.props.data.required}/>
        </div>
        }
        <p className={classNames} dangerouslySetInnerHTML={{__html: myxss.process(this.props.data.content)}}/>
      </div>
    );
  }
}

class Label extends React.Component {
  // mixins: [SortableItemMixin],
  render() {
    let classNames = 'static';
    if (this.props.data.bold) {
      classNames += ' bold';
    }
    if (this.props.data.italic) {
      classNames += ' italic';
    }

    let baseClasses = CommonUtils.getElementsClass(this.props.data);
    return (
      <div className={baseClasses}>
        { !this.props.mutable &&
        <div>
          { this.props.data.pageBreakBefore &&
          <div className="preview-page-break">Page Break</div>
          }
          <HeaderBar parent={this.props.parent} editModeOn={this.props.editModeOn} data={this.props.data}
                     onDestroy={this.props._onDestroy} onEdit={this.props.onEdit} static={this.props.data.static}
                     required={this.props.data.required}/>
        </div>
        }
        <label className={classNames} dangerouslySetInnerHTML={{__html: myxss.process(this.props.data.content)}}/>
      </div>
    );
  }
}

class LineBreak extends React.Component {
  // mixins: [SortableItemMixin],
  render() {

    let baseClasses = CommonUtils.getElementsClass(this.props.data);

    return (
      <div className={baseClasses}>
        { !this.props.mutable &&
        <div>
          { this.props.data.pageBreakBefore &&
          <div className="preview-page-break">Page Break</div>
          }
          <HeaderBar parent={this.props.parent} editModeOn={this.props.editModeOn} data={this.props.data}
                     onDestroy={this.props._onDestroy} onEdit={this.props.onEdit} static={this.props.data.static}
                     required={this.props.data.required}/>
        </div>
        }
        <hr />
      </div>
    );
  }
}

class TextInput extends React.Component {
  constructor(props) {
    super(props);
    this.inputField = React.createRef();
  }

  render() {
    let props = {};
    props.type = "text";
    props.className = "form-control";
    props.name = this.props.data.field_name;
    if (this.props.mutable) {
      props.defaultValue = this.props.defaultValue;
      props.ref = this.inputField;
    }

    let baseClasses = CommonUtils.getElementsClass(this.props.data);

    if (this.props.read_only) {
      props.disabled = "disabled";
    }

    return (
      <div className={baseClasses}>
        { !this.props.mutable &&
        <div>
          { this.props.data.pageBreakBefore &&
          <div className="preview-page-break">Page Break</div>
          }
          <HeaderBar parent={this.props.parent} editModeOn={this.props.editModeOn} data={this.props.data}
                     onDestroy={this.props._onDestroy} onEdit={this.props.onEdit} static={this.props.data.static}
                     required={this.props.data.required}/>
        </div>
        }
        <div className="form-group">
          <label>
            <span dangerouslySetInnerHTML={{__html: myxss.process(this.props.data.label)}}/>

            { (this.props.data.hasOwnProperty('required') && this.props.data.required === true && !this.props.read_only) &&
            <span className="label-required label label-danger">Required</span>
            }
          </label>
          <input {...props} onClick={()=>{ if(this.props.data.supportJS && this.props.data.hasOwnProperty('onClickStr')
            && !CommonUtils.isEmpty(this.props.data.onClickStr)){
            eval(this.props.data.onClickStr)
          }}} onChange={(e)=>{
            if(this.props.data.supportJS && this.props.data.hasOwnProperty('onChangeStr')
            && !CommonUtils.isEmpty(this.props.data.onChangeStr)){
              let target = e && e.target ? e.target : e;
              let name = target.name;
              let value = target.value;
              let onChangeStr = this.props.data.onChangeStr;
              onChangeStr = onChangeStr.replace(/'name'/g,name);
              onChangeStr = onChangeStr.replace(/'value'/g,value);
              eval(onChangeStr)
          }}} onBlur={()=>{ if(this.props.data.supportJS && this.props.data.hasOwnProperty('onBlurStr')
            && !CommonUtils.isEmpty(this.props.data.onBlurStr)){
            eval(this.props.data.onBlurStr)
          }}} />
        </div>
      </div>
    );
  }
}

class NumberInput extends React.Component {
  constructor(props) {
    super(props);
    this.inputField = React.createRef();
  }

  render() {
    let props = {};
    props.type = "number";
    props.className = "form-control";
    props.name = this.props.data.field_name;

    if (this.props.mutable) {
      props.defaultValue = this.props.defaultValue;
      props.ref = this.inputField;
    }

    if (this.props.data.width) {
      baseClasses += ' col-xs-' + this.props.data.width;
    } else {
      baseClasses += ' col-xs-12 ';
    }
    if (this.props.read_only) {
      props.disabled = "disabled";
    }

    let baseClasses = CommonUtils.getElementsClass(this.props.data);

    return (
      <div className={baseClasses}>
        { !this.props.mutable &&
        <div>
          { this.props.data.pageBreakBefore &&
          <div className="preview-page-break">Page Break</div>
          }
          <HeaderBar parent={this.props.parent} editModeOn={this.props.editModeOn} data={this.props.data}
                     onDestroy={this.props._onDestroy} onEdit={this.props.onEdit} static={this.props.data.static}
                     required={this.props.data.required}/>
        </div>
        }
        <div className="form-group">
          <label>
            <span dangerouslySetInnerHTML={{__html: myxss.process(this.props.data.label)}}/>

            { (this.props.data.hasOwnProperty('required') && this.props.data.required === true && !this.props.read_only) &&
            <span className="label-required label label-danger">Required</span>
            }
          </label>
          <input {...props} onClick={()=>{ if(this.props.data.supportJS && this.props.data.hasOwnProperty('onClickStr')
            && !CommonUtils.isEmpty(this.props.data.onClickStr)){
            eval(this.props.data.onClickStr)
          }}} onChange={(e)=>{
            if(this.props.data.supportJS && this.props.data.hasOwnProperty('onChangeStr')
            && !CommonUtils.isEmpty(this.props.data.onChangeStr)){
              let target = e && e.target ? e.target : e;
              let name = target.name;
              let value = target.value;
              let onChangeStr = this.props.data.onChangeStr;
              onChangeStr = onChangeStr.replace(/'name'/g,name);
              onChangeStr = onChangeStr.replace(/'value'/g,value);
              eval(onChangeStr)
          }}} onBlur={()=>{ if(this.props.data.supportJS && this.props.data.hasOwnProperty('onBlurStr')
            && !CommonUtils.isEmpty(this.props.data.onBlurStr)){
            eval(this.props.data.onBlurStr)
          }}}  />
        </div>
      </div>
    );
  }
}

class TextArea extends React.Component {
  constructor(props) {
    super(props);
    this.inputField = React.createRef();
  }

  render() {
    let props = {};
    props.className = "form-control";
    props.name = this.props.data.field_name;

    if (this.props.read_only) {
      props.disabled = "disabled";
    }

    if (this.props.mutable) {
      props.defaultValue = this.props.defaultValue;
      props.ref = this.inputField;
    }

    let baseClasses = CommonUtils.getElementsClass(this.props.data);

    return (
      <div className={baseClasses}>
        { !this.props.mutable &&
        <div>
          { this.props.data.pageBreakBefore &&
          <div className="preview-page-break">Page Break</div>
          }
          <HeaderBar parent={this.props.parent} editModeOn={this.props.editModeOn} data={this.props.data}
                     onDestroy={this.props._onDestroy} onEdit={this.props.onEdit} static={this.props.data.static}
                     required={this.props.data.required}/>
        </div>
        }
        <div className="form-group">
          <label>
            <span dangerouslySetInnerHTML={{__html: myxss.process(this.props.data.label)}}/>
            { (this.props.data.hasOwnProperty('required') && this.props.data.required === true && !this.props.read_only) &&
            <span className="label-required label label-danger">Required</span>
            }
          </label>
          <textarea {...props}  onClick={()=>{ if(this.props.data.supportJS && this.props.data.hasOwnProperty('onClickStr')
            && !CommonUtils.isEmpty(this.props.data.onClickStr)){
            eval(this.props.data.onClickStr)
          }}} onChange={(e)=>{
            if(this.props.data.supportJS && this.props.data.hasOwnProperty('onChangeStr')
            && !CommonUtils.isEmpty(this.props.data.onChangeStr)){
              let target = e && e.target ? e.target : e;
              let name = target.name;
              let value = target.value;
              let onChangeStr = this.props.data.onChangeStr;
              onChangeStr = onChangeStr.replace(/'name'/g,name);
              onChangeStr = onChangeStr.replace(/'value'/g,value);
              eval(onChangeStr)
          }}} onBlur={()=>{ if(this.props.data.supportJS && this.props.data.hasOwnProperty('onBlurStr')
            && !CommonUtils.isEmpty(this.props.data.onBlurStr)){
            eval(this.props.data.onBlurStr)
          }}} />
        </div>
      </div>
    );
  }
}

class DatePicker extends React.Component {
  constructor(props) {
    super(props);
    this.inputField = React.createRef();
    let value, internalValue;

    if (props.data.defaultToday && (props.defaultValue === '' || props.defaultValue === undefined)) {
      value = moment().format('MM/DD/YYYY');
      internalValue = moment();
    } else {
      value = props.defaultValue;

      if (props.defaultValue !== '' && props.defaultValue !== undefined) {
        internalValue = moment(value, 'MM/DD/YYYY');
      }
    }

    this.state = {
      value: value,
      internalValue: internalValue,
      placeholder: 'MM/DD/YYYY',
      defaultToday: props.data.defaultToday
    };
  }

  handleChange = (dt) => {
    if (dt && dt.target) {

      var placeholder = (dt && dt.target && dt.target.value === '') ? 'MM/DD/YYYY' : '';
      var formattedDate = (dt.target.value) ? moment(dt.target.value).format('YYYY-MM-DD') : '';

      this.setState({
        value: formattedDate,
        internalValue: formattedDate,
        placeholder: placeholder
      });

    } else {
      this.setState({
        value: (dt) ? dt.format('MM/DD/YYYY') : '',
        internalValue: dt,
        placeholder: placeholder
      });
    }
  };

  componentWillReceiveProps(nextProps) {

    if (this.props.data.defaultToday && !this.state.defaultToday) {
      this.state.value = moment().format('MM/DD/YYYY');
      this.state.internalValue = moment(this.state.value);
    } else if (!this.props.data.defaultToday && this.state.defaultToday) {
      this.state.value = '';
      this.state.internalValue = undefined;
    }

    this.state.defaultToday = this.props.data.defaultToday;
  }

  render() {
    let props = {};
    props.type = "date";
    props.className = "form-control";
    props.name = this.props.data.field_name;

    var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    if (this.props.mutable) {
      props.defaultValue = this.props.defaultValue;
      props.ref = this.inputField;
    }

    if (this.props.read_only) {
      props.disabled = "disabled";
    }

    let baseClasses = CommonUtils.getElementsClass(this.props.data);

    const dataDiv = <div >
      <i className="fa fa-calendar" style={{marginRight: '3px', marginLeft: '3px', marginTop: '3px', marginBottom: '3px'}} />
      <input className='widget-date-input' style={{width: '131px',background:'white'}} id={this.props.id} ref='input'
             name={this.props.name} disabled={true}
             value={this.state.value}
             onChange={this.props.onChange}
             disabledPastDate ={true}
      />
    </div>;
    return (
      <div className={baseClasses}>
        { !this.props.mutable &&
        <div>
          { this.props.data.pageBreakBefore &&
          <div className="preview-page-break">Page Break</div>
          }
          <HeaderBar parent={this.props.parent} editModeOn={this.props.editModeOn} data={this.props.data}
                     onDestroy={this.props._onDestroy} onEdit={this.props.onEdit} static={this.props.data.static}
                     required={this.props.data.required}/>
        </div>
        }
        <div className="form-group">
          <label>
            <span dangerouslySetInnerHTML={{__html: myxss.process(this.props.data.label)}}/>
            { (this.props.data.hasOwnProperty('required') && this.props.data.required === true && !this.props.read_only) &&
            <span className="label-required label label-danger">Required</span>
            }
          </label>
          <div>
            { this.props.data.readOnly &&
            <input type="text"
                   name={props.name}
                   ref={props.ref}
                   readOnly="true"
                   dateFormat="MM/DD/YYYY"
                   placeholder={this.state.placeholder}
                   value={this.state.value}
                   className="form-control"/>
            }
            { iOS && !this.props.data.readOnly &&
            <input type="date"
                   name={props.name}
                   ref={props.ref}
                   onChange={this.handleChange}
                   dateFormat="MM/DD/YYYY"
                   placeholder={this.state.placeholder}
                   value={this.state.value}
                   className="form-control"/>
            }
            { !iOS && !this.props.data.readOnly &&
            <ReactDatePicker customInput={dataDiv}
               name={props.name}
               ref={props.ref}
               onChange={this.handleChange}
               selected={this.state.internalValue}
               minDate={this.props.hasOwnProperty("disabledPastDate")&&this.props.disabledPastDate === false ? null : moment()}
               todayButton={'Today'}
               /*className="form-control"*/
               isClearable={true}
               dateFormat="MM/DD/YYYY"
               placeholderText={this.state.placeholder}/>
            }
          </div>
        </div>
      </div>
    );
  }
}

class Dropdown extends React.Component {
  constructor(props) {
    super(props);
    this.inputField = React.createRef();
  }

  render() {
    let props = {};
    props.className = "form-control";
    props.name = this.props.data.field_name;

    if (this.props.mutable) {
      props.defaultValue = this.props.defaultValue;
      props.ref = this.inputField;
    }
    props.value = this.props.data.value;
    props.creatable = this.props.data.creatable;
    props.clearable = this.props.data.clearable;

    if (this.props.read_only) {
      props.disabled = "disabled";
    }

    let baseClasses = CommonUtils.getElementsClass(this.props.data);

    return (
      <div className={baseClasses}>
        { !this.props.mutable &&
        <div>
          { this.props.data.pageBreakBefore &&
          <div className="preview-page-break">Page Break</div>
          }
          <HeaderBar parent={this.props.parent} editModeOn={this.props.editModeOn} data={this.props.data}
                     onDestroy={this.props._onDestroy} onEdit={this.props.onEdit} static={this.props.data.static}
                     required={this.props.data.required}/>
        </div>
        }
        <div className="form-group">
          <label>
            <span dangerouslySetInnerHTML={{__html: myxss.process(this.props.data.label)}}/>
            { (this.props.data.hasOwnProperty('required') && this.props.data.required === true && !this.props.read_only) &&
            <span className="label-required label label-danger">Required</span>
            }
          </label>
          <SelectWidget {...props} options={this.props.data.options}
            onClick={()=>{ if(this.props.data.supportJS && this.props.data.hasOwnProperty('onClickStr')
              && !CommonUtils.isEmpty(this.props.data.onClickStr)){
              eval(this.props.data.onClickStr)
            }}} onChange={(e)=>{
            if(this.props.data.supportJS && this.props.data.hasOwnProperty('onChangeStr')
            && !CommonUtils.isEmpty(this.props.data.onChangeStr)){
              let target = e && e.target ? e.target : e;
              let name = target.name;
              let value = target.value;
              let onChangeStr = this.props.data.onChangeStr;
              onChangeStr = onChangeStr.replace(/'name'/g,name);
              onChangeStr = onChangeStr.replace(/'value'/g,value);
              eval(onChangeStr)
          }}} onBlur={()=>{ if(this.props.data.supportJS && this.props.data.hasOwnProperty('onBlurStr')
            && !CommonUtils.isEmpty(this.props.data.onBlurStr)){
            eval(this.props.data.onBlurStr)
          }}} >
            {/*{this.props.data.options.map(function (option) {
              let this_key = 'preview_' + option.key;
              return <option value={option.value} key={this_key}>{option.text}</option>;
            })}*/}
          </SelectWidget>
        </div>
      </div>
    );
  }
}

class Tags extends React.Component {
  constructor(props) {
    super(props);
    this.inputField = React.createRef();
  }

  state = {value: this.props.defaultValue !== undefined ? this.props.defaultValue.split(",") : []};

  handleChange = (e) => {
    this.setState({value: e});
  };

  render() {
    let options = this.props.data.options.map(option => {
      option.label = option.text;
      return option;
    })
    let props = {};
    props.multi = true;
    props.name = this.props.data.field_name;
    props.onChange = this.handleChange;

    props.options = options;
    if (!this.props.mutable) {
      props.value = options[0].text
    } // to show a sample of what tags looks like
    if (this.props.mutable) {
      props.value = this.state.value;
      props.ref = this.inputField;
    }

    let baseClasses = CommonUtils.getElementsClass(this.props.data);
    return (
      <div className={baseClasses}>
        { !this.props.mutable &&
        <div>
          { this.props.data.pageBreakBefore &&
          <div className="preview-page-break">Page Break</div>
          }
          <HeaderBar parent={this.props.parent} editModeOn={this.props.editModeOn} data={this.props.data}
                     onDestroy={this.props._onDestroy} onEdit={this.props.onEdit} static={this.props.data.static}
                     required={this.props.data.required}/>
        </div>
        }
        <div className="form-group">
          <label>
            <span dangerouslySetInnerHTML={{__html: myxss.process(this.props.data.label)}}/>
            { (this.props.data.hasOwnProperty('required') && this.props.data.required === true && !this.props.read_only) &&
            <span className="label-required label label-danger">Required</span>
            }
          </label>
          <Select {...props}  onClick={()=>{ if(this.props.data.supportJS && this.props.data.hasOwnProperty('onClickStr')
            && !CommonUtils.isEmpty(this.props.data.onClickStr)){
            eval(this.props.data.onClickStr)
          }}} onChange={(e)=>{
            if(this.props.data.supportJS && this.props.data.hasOwnProperty('onChangeStr')
            && !CommonUtils.isEmpty(this.props.data.onChangeStr)){
              let target = e && e.target ? e.target : e;
              let name = target.name;
              let value = target.value;
              let onChangeStr = this.props.data.onChangeStr;
              onChangeStr = onChangeStr.replace(/'name'/g,name);
              onChangeStr = onChangeStr.replace(/'value'/g,value);
              eval(onChangeStr)
          }}} onBlur={()=>{ if(this.props.data.supportJS && this.props.data.hasOwnProperty('onBlurStr')
            && !CommonUtils.isEmpty(this.props.data.onBlurStr)){
            eval(this.props.data.onBlurStr)
          }}} />
        </div>
      </div>
    );
  }
}

class Checkboxes extends React.Component {
  constructor(props) {
    super(props);
    this.options = {};
  }

  render() {
    let self = this;
    let classNames = 'checkbox-label';
    if (this.props.data.inline) {
      classNames += ' option-inline';
    }

    let baseClasses = CommonUtils.getElementsClass(this.props.data);

    return (
      <div className={baseClasses}>
        { !this.props.mutable &&
        <div>
          { this.props.data.pageBreakBefore &&
          <div className="preview-page-break">Page Break</div>
          }
          <HeaderBar parent={this.props.parent} editModeOn={this.props.editModeOn} data={this.props.data}
                     onDestroy={this.props._onDestroy} onEdit={this.props.onEdit} static={this.props.data.static}
                     required={this.props.data.required}/>
        </div>
        }
        <div className="form-group">
          <label className="form-label">
            <span dangerouslySetInnerHTML={{__html: myxss.process(this.props.data.label)}}/>
            { (this.props.data.hasOwnProperty('required') && this.props.data.required === true && !this.props.read_only) &&
            <span className="label-required label label-danger">Required</span>
            }
          </label>
          {this.props.data.options.map((option) => {
            let this_key = 'preview_' + option.key;
            let props = {};
            props.name = 'option_' + option.key;

            props.type = "checkbox"
            props.value = option.value;
            if (self.props.mutable) {
              props.defaultChecked = self.props.defaultValue.indexOf(option.value) > -1 ? true : false;
            }
            return (
              <label className={classNames} key={this_key}>
                <input ref={c => {
                  if (c && self.props.mutable) {
                    self.options[`child_ref_${option.key}`] = c;
                  }
                } } {...props}  onClick={()=>{ if(this.props.data.supportJS && this.props.data.hasOwnProperty('onClickStr')
                  && !CommonUtils.isEmpty(this.props.data.onClickStr)){
                  eval(this.props.data.onClickStr)
                }}} onChange={(e)=>{
                  if(this.props.data.supportJS && this.props.data.hasOwnProperty('onChangeStr')
                  && !CommonUtils.isEmpty(this.props.data.onChangeStr)){
                    let target = e && e.target ? e.target : e;
                    let name = target.name;
                    let value = target.value;
                    let onChangeStr = this.props.data.onChangeStr;
                    onChangeStr = onChangeStr.replace(/'name'/g,name);
                    onChangeStr = onChangeStr.replace(/'value'/g,value);
                    eval(onChangeStr)
                }}} onBlur={()=>{ if(this.props.data.supportJS && this.props.data.hasOwnProperty('onBlurStr')
                  && !CommonUtils.isEmpty(this.props.data.onBlurStr)){
                  eval(this.props.data.onBlurStr)
                }}} /> {option.text}
              </label>
            )
          })}
        </div>
      </div>
    );
  }
}

class RadioButtons extends React.Component {
  constructor(props) {
    super(props);
    this.options = {};
  }

  render() {
    let self = this;
    let classNames = 'radio-label';
    if (this.props.data.inline) {
      classNames += ' option-inline';
    }

    let baseClasses = CommonUtils.getElementsClass(this.props.data);

    return (
      <div className={baseClasses}>
        { !this.props.mutable &&
        <div>
          { this.props.data.pageBreakBefore &&
          <div className="preview-page-break">Page Break</div>
          }
          <HeaderBar parent={this.props.parent} editModeOn={this.props.editModeOn} data={this.props.data}
                     onDestroy={this.props._onDestroy} onEdit={this.props.onEdit} static={this.props.data.static}
                     required={this.props.data.required}/>
        </div>
        }
        <div className="form-group">
          <label className="form-label">
            <span dangerouslySetInnerHTML={{__html: myxss.process(this.props.data.label)}}/>
            { (this.props.data.hasOwnProperty('required') && this.props.data.required === true && !this.props.read_only) &&
            <span className="label-required label label-danger">Required</span>
            }
          </label>
          {this.props.data.options.map((option) => {
            let this_key = 'preview_' + option.key;
            let props = {};
            props.name = self.props.data.field_name;

            props.type = "radio"
            props.value = option.value;
            if (self.props.mutable) {
              props.defaultChecked = (self.props.defaultValue !== undefined && self.props.defaultValue.indexOf(option.value) > -1) ? true : false;
            }
            return (
              <label className={classNames} key={this_key}>
                <input ref={c => {
                  if (c && self.props.mutable) {
                    self.options[`child_ref_${option.key}`] = c;
                  }
                } } {...props}  onClick={()=>{ if(this.props.data.supportJS && this.props.data.hasOwnProperty('onClickStr')
                  && !CommonUtils.isEmpty(this.props.data.onClickStr)){
                  eval(this.props.data.onClickStr)
                }}} onChange={(e)=>{
                  if(this.props.data.supportJS && this.props.data.hasOwnProperty('onChangeStr')
                  && !CommonUtils.isEmpty(this.props.data.onChangeStr)){
                    let target = e && e.target ? e.target : e;
                    let name = target.name;
                    let value = target.value;
                    let onChangeStr = this.props.data.onChangeStr;
                    onChangeStr = onChangeStr.replace(/'name'/g,name);
                    onChangeStr = onChangeStr.replace(/'value'/g,value);
                    eval(onChangeStr)
                }}} onBlur={()=>{ if(this.props.data.supportJS && this.props.data.hasOwnProperty('onBlurStr')
                  && !CommonUtils.isEmpty(this.props.data.onBlurStr)){
                  eval(this.props.data.onBlurStr)
                }}} /> {option.text}
              </label>
            )
          })}
        </div>
      </div>
    );
  }
}

class Image extends React.Component {
  // mixins: [SortableItemMixin],
  render() {
    var style = (this.props.data.center) ? {textAlign: 'center'} : {};

    let baseClasses = CommonUtils.getElementsClass(this.props.data);

    return (
      <div className={baseClasses} style={style}>
        { !this.props.mutable &&
        <HeaderBar parent={this.props.parent} editModeOn={this.props.editModeOn} data={this.props.data}
                   onDestroy={this.props._onDestroy} onEdit={this.props.onEdit} required={this.props.data.required}/>
        }
        { this.props.data.src &&
        <img src={this.props.data.src} width={this.props.data.width} height={this.props.data.height}/>
        }
        { !this.props.data.src &&
        <div className="no-image">No Image</div>
        }
      </div>
    );
  }
}

class Rating extends React.Component {
  constructor(props) {
    super(props);
    this.inputField = React.createRef();
  }

  render() {
    let props = {};
    props.name = this.props.data.field_name;
    props.ratingAmount = 5;

    if (this.props.mutable) {
      props.rating = (this.props.defaultValue !== undefined && this.props.defaultValue.length) ? parseFloat(this.props.defaultValue, 10) : 0;
      props.editing = true;
      props.ref = this.inputField;
    }

    let baseClasses = CommonUtils.getElementsClass(this.props.data);

    return (
      <div className={baseClasses}>
        { !this.props.mutable &&
        <div>
          { this.props.data.pageBreakBefore &&
          <div className="preview-page-break">Page Break</div>
          }
          <HeaderBar parent={this.props.parent} editModeOn={this.props.editModeOn} data={this.props.data}
                     onDestroy={this.props._onDestroy} onEdit={this.props.onEdit} static={this.props.data.static}
                     required={this.props.data.required}/>
        </div>
        }
        <div className="form-group">
          <label>
            <span dangerouslySetInnerHTML={{__html: myxss.process(this.props.data.label)}}/>
            { (this.props.data.hasOwnProperty('required') && this.props.data.required === true && !this.props.read_only) &&
            <span className="label-required label label-danger">Required</span>
            }
          </label>
          <StarRating {...props} />
        </div>
      </div>
    );
  }
}

class HyperLink extends React.Component {
  // mixins: [SortableItemMixin],
  render() {
    let baseClasses = CommonUtils.getElementsClass(this.props.data);

    return (
      <div className={baseClasses}>
        { !this.props.mutable &&
        <div>
          { this.props.data.pageBreakBefore &&
          <div className="preview-page-break">Page Break</div>
          }
          <HeaderBar parent={this.props.parent} editModeOn={this.props.editModeOn} data={this.props.data}
                     onDestroy={this.props._onDestroy} onEdit={this.props.onEdit} static={this.props.data.static}
                     required={this.props.data.required}/>
        </div>
        }
        <div className="form-group">
          <a target="_blank" href={this.props.data.href}>
            <span dangerouslySetInnerHTML={{__html: myxss.process(this.props.data.content)}}/>
          </a>
        </div>
      </div>
    );
  }
}

class Download extends React.Component {
  // mixins: [SortableItemMixin],
  render() {
    let baseClasses = CommonUtils.getElementsClass(this.props.data);

    return (
      <div className={baseClasses}>
        { !this.props.mutable &&
        <div>
          { this.props.data.pageBreakBefore &&
          <div className="preview-page-break">Page Break</div>
          }
          <HeaderBar parent={this.props.parent} editModeOn={this.props.editModeOn} data={this.props.data}
                     onDestroy={this.props._onDestroy} onEdit={this.props.onEdit} static={this.props.data.static}
                     required={this.props.data.required}/>
        </div>
        }
        <div className="form-group">
          <a href={this.props.download_path + this.props.data.file_path}>
            <span dangerouslySetInnerHTML={{__html: myxss.process(this.props.data.content)}}/>
          </a>
        </div>
      </div>
    );
  }
}


class UploadFile extends React.Component {

  render() {
    let baseClasses = CommonUtils.getElementsClass(this.props.data);

    return (
      <div className={baseClasses}>
        { !this.props.mutable &&
        <div>
          { this.props.data.pageBreakBefore &&
          <div className="preview-page-break">Page Break</div>
          }
          <HeaderBar parent={this.props.parent} editModeOn={this.props.editModeOn} data={this.props.data}
                     onDestroy={this.props._onDestroy} onEdit={this.props.onEdit} static={this.props.data.static}
                     required={this.props.data.required}/>
        </div>
        }
        <div className="form-group">
          <FineUploader {...this.props } {...this.props.data } />
        </div>
      </div>
    );
  }
}

class Camera extends React.Component {
  // mixins: [SortableItemMixin],

  state = {img: null};

  displayImage = (e) => {
    var self = this;
    var target = e.target;
    var file, reader;

    if (target.files && target.files.length) {
      file = target.files[0];
      reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onloadend = function () {
        self.setState({
          img: reader.result
        });
      }
    }
  };

  clearImage = () => {
    this.setState({
      img: null
    })
  };

  render() {
    let baseClasses = CommonUtils.getElementsClass(this.props.data);

    return (
      <div className={baseClasses}>
        { !this.props.mutable &&
        <div>
          { this.props.data.pageBreakBefore &&
          <div className="preview-page-break">Page Break</div>
          }
          <HeaderBar parent={this.props.parent} editModeOn={this.props.editModeOn} data={this.props.data}
                     onDestroy={this.props._onDestroy} onEdit={this.props.onEdit} static={this.props.data.static}
                     required={this.props.data.required}/>
        </div>
        }
        <div className="form-group">
          <label>
            {this.props.data.label}
            { (this.props.data.hasOwnProperty('required') && this.props.data.required === true && !this.props.read_only) &&
            <span className="label-required label label-danger">Required</span>
            }
          </label>
          <div className="image-upload-container">
            { !this.state.img &&
            <div>
              <input type="file" accept="image/*" capture="camera" className="image-upload"
                     onChange={this.displayImage}/>
              <div className="image-upload-control">
                <div className="btn btn-default btn-school"><i className="fa fa-camera"></i> Upload Photo</div>
                <p>Select an image from your computer or device.</p>
              </div>
            </div>
            }
            { this.state.img &&
            <div>
              <img src={ this.state.img } height="100" className="image-upload-preview"/><br />
              <div className="btn btn-school btn-image-clear" onClick={this.clearImage}>
                <i className="fa fa-times"></i> Clear Photo
              </div>
            </div>
            }
          </div>
        </div>
      </div>
    );
  }
}

class Range extends React.Component {
  constructor(props) {
    super(props);
    this.inputField = React.createRef();
  }

  render() {
    let props = {};
    props.type = "range";
    props.name = this.props.data.field_name;
    props.list = "tickmarks_" + this.props.data.field_name;
    props.min = this.props.data.min_value;
    props.max = this.props.data.max_value;
    props.step = this.props.step !== undefined ? parseInt(this.props.step, 10) : parseInt(this.props.data.step, 10);;

    props.defaultValue = this.props.defaultValue !== undefined ? parseInt(this.props.defaultValue, 10) : parseInt(this.props.data.default_value, 10);

    if (this.props.mutable) {
      props.ref = this.inputField;
    }

    let datalist = [];
    for (var i = parseInt(this.props.data.min_value, 10); i <= parseInt(this.props.data.max_value, 10); i += parseInt(this.props.data.step, 10)) {
      datalist.push(i);
    }

    let oneBig = 100 / (datalist.length - 1);

    let _datalist = datalist.map((d, idx) => {
      return <option key={props.list + '_' + idx}>{d}</option>
    })

    let visible_marks = datalist.map((d, idx) => {
      let option_props = {};
      let w = oneBig;
      if (idx === 0 || idx === datalist.length - 1)
        w = oneBig / 2;
      option_props.key = props.list + '_label_' + idx;
      option_props.style = {width: w + '%'};
      if (idx === datalist.length - 1)
        option_props.style = {width: w + '%', textAlign: 'right'};
      return <label {...option_props}>{d}</label>
    })

    let baseClasses = CommonUtils.getElementsClass(this.props.data);

    return (
      <div className={baseClasses}>
        { !this.props.mutable &&
        <div>
          { this.props.data.pageBreakBefore &&
          <div className="preview-page-break">Page Break</div>
          }
          <HeaderBar parent={this.props.parent} editModeOn={this.props.editModeOn} data={this.props.data}
                     onDestroy={this.props._onDestroy} onEdit={this.props.onEdit} static={this.props.data.static}
                     required={this.props.data.required}/>
        </div>
        }
        <div className="form-group">
          <label>
            {this.props.data.label}
            { (this.props.data.hasOwnProperty('required') && this.props.data.required === true && !this.props.read_only) &&
            <span className="label-required label label-danger">Required</span>
            }
          </label>
          <div className="range">
            <div className="clearfix">
              <span className="pull-left">{this.props.data.min_label}</span>
              <span className="pull-right">{this.props.data.max_label}</span>
            </div>
            <ReactBootstrapSlider
              name={props.name}
              value={props.defaultValue}
              step={props.step}
              max={this.props.data.max_value}
              min={this.props.data.min_value}/>
          </div>
          <div className="visible_marks">
            {visible_marks}
          </div>
          <datalist id={props.list}>
            {_datalist}
          </datalist>
        </div>
      </div>
    );
  }
}

FormElements.Header = Header;
FormElements.Paragraph = Paragraph;
FormElements.Label = Label;
FormElements.LineBreak = LineBreak;
FormElements.TextInput = TextInput;
FormElements.NumberInput = NumberInput;
FormElements.TextArea = TextArea;
FormElements.Dropdown = Dropdown;
FormElements.Checkboxes = Checkboxes;
FormElements.DatePicker = DatePicker;
FormElements.RadioButtons = RadioButtons;
FormElements.Image = Image;
FormElements.Rating = Rating;
FormElements.Tags = Tags;
FormElements.HyperLink = HyperLink;
FormElements.Download = Download;
FormElements.UploadFile = UploadFile;
FormElements.Camera = Camera;
FormElements.Range = Range;

module.exports = FormElements;
