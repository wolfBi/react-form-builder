import React from 'react';
import xss from 'xss';
import moment from 'moment';
import update from 'immutability-helper';
import { Col } from 'react-bootstrap'
import FA from 'react-fontawesome'
import ReactDatePicker from 'react-datepicker';
import ReactBootstrapSlider from  'react-bootstrap-slider';
import HeaderBar from './HeaderBar';
import StarRating from './elements/StarRating';
import SelectWidget from './elements/SelectWidget';
import SelectAsync from './elements/SelectAsync';
import FineUploader from './elements/FineUploader';
import HourMinSelect from './elements/HourMinSelect';
import * as CommonUtil from '../utils/CommonUtil';
import HttpUtil from '../utils/HttpUtil';
import datePickerIcon from '../../../images/Calendar.png';
// import SortableItemMixin from 'react-anything-sortable/SortableItemMixin';
import 'react-datepicker/dist/react-datepicker.css'
import "../css/bootstrap-slider.css";

let myxss = new xss.FilterXSS({
    whiteList: {
        u: [],
        br: [],
        b: [],
        i: [],
        a: ['href','target'],
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

const isRequired = (props)=>{
    if(props.data && props.data.hasOwnProperty('required') && props.data.required === true && (!props.hasOwnProperty('read_only') || !props.read_only) ){
        // return <span className="label-required label label-danger">Required</span>
        return "reuired-true dispalyInline";
    }else {
        return " dispalyInline ";
    }
}
const getElementsClass = (elementData) => {
    let baseClasses = 'SortableItem rfb-item';
    if (elementData.pageBreakBefore) {
        baseClasses += ' alwaysbreak';
    }
    if (elementData.compWidth && elementData.compWidth > 0 && elementData.compWidth <= 12 ) {
        baseClasses += ' col-xs-'+elementData.compWidth;
    }else{
        baseClasses += ' col-xs-12 ';
    }
    return baseClasses;
}

class InlineLayout extends React.Component {
    render(){
        let colxs = this.props.compWidth && this.props.compWidth <= 6 ? 4 : 2
        if(this.props.inline){
            return <div className="form-group" style={{marginBottom:'15px'}}>
                <Col xs={colxs} style={{padding:'0',textAlign:'right'}}>{this.props.label}</Col>
                <Col xs={12-colxs}>{this.props.children}</Col>
            </div>
        }else{
            return <div className="form-group" style={{marginBottom:'15px'}}>
                {this.props.label}
                {this.props.children}
            </div>
        }
    }
}

export class Header extends React.Component {
    // mixins: [SortableItemMixin],
    render() {
        //let headerClasses = 'dynamic-input ' + this.props.data.element + '-input';
        let classNames = 'static';
        if (this.props.data.bold) {
            classNames += ' bold';
        }
        if (this.props.data.italic) {
            classNames += ' italic';
        }

        let baseClasses = getElementsClass(this.props.data);

        return (
            <div className={baseClasses}>
                { !this.props.mutable &&
                <div>
                    { this.props.data.pageBreakBefore &&
                    <div className="preview-page-break">Page Break</div>
                    }
                    <HeaderBar parent={this.props.parent} editModeOn={this.props.editModeOn} data={this.props.data}
                               onDestroy={this.props._onDestroy} onEdit={this.props.onEdit}
                               static={this.props.data.static}
                               required={this.props.data.required}/>
                </div>
                }
                <h3 className={classNames} dangerouslySetInnerHTML={{__html: this.props.data.content}}/>
            </div>
        );
    }
}

export class Paragraph extends React.Component {
    // mixins: [SortableItemMixin],
    render() {
        let classNames = 'static';
        if (this.props.data.bold) {
            classNames += ' bold';
        }
        if (this.props.data.italic) {
            classNames += ' italic';
        }

        let baseClasses = getElementsClass(this.props.data);

        return (
            <div className={baseClasses}>
                { !this.props.mutable &&
                <div>
                    { this.props.data.pageBreakBefore &&
                    <div className="preview-page-break">Page Break</div>
                    }
                    <HeaderBar parent={this.props.parent} editModeOn={this.props.editModeOn} data={this.props.data}
                               onDestroy={this.props._onDestroy} onEdit={this.props.onEdit}
                               static={this.props.data.static}
                               required={this.props.data.required}/>
                </div>
                }
                <p className={classNames} dangerouslySetInnerHTML={{__html: this.props.data.content}}/>
            </div>
        );
    }
}

export class Label extends React.Component {
    // mixins: [SortableItemMixin],
    render() {
        let classNames = 'static';
        if (this.props.data.bold) {
            classNames += ' bold';
        }
        if (this.props.data.italic) {
            classNames += ' italic';
        }

        let baseClasses = getElementsClass(this.props.data);
        return (
            <div className={baseClasses}>
                { !this.props.mutable &&
                <div>
                    { this.props.data.pageBreakBefore &&
                    <div className="preview-page-break">Page Break</div>
                    }
                    <HeaderBar parent={this.props.parent} editModeOn={this.props.editModeOn} data={this.props.data}
                               onDestroy={this.props._onDestroy} onEdit={this.props.onEdit}
                               static={this.props.data.static}
                               required={this.props.data.required}/>
                </div>
                }
                <label className={classNames}
                       dangerouslySetInnerHTML={{__html: this.props.data.content}}/>
            </div>
        );
    }
}

export class LineBreak extends React.Component {
    // mixins: [SortableItemMixin],
    render() {
        let baseClasses = getElementsClass(this.props.data);
        return (
            <div className={baseClasses}>
                { !this.props.mutable &&
                <div>
                    { this.props.data.pageBreakBefore &&
                    <div className="preview-page-break">Page Break</div>
                    }
                    <HeaderBar parent={this.props.parent} editModeOn={this.props.editModeOn} data={this.props.data}
                               onDestroy={this.props._onDestroy} onEdit={this.props.onEdit}
                               static={this.props.data.static}
                               required={this.props.data.required}/>
                </div>
                }
                <hr />
            </div>
        );
    }
}

export class TextInput extends React.Component {
    constructor(props) {
        super(props);
        this.inputField = "child_ref_" + this.props.data.field_name;//React.createRef();
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

        let baseClasses = getElementsClass(this.props.data);

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
                               onDestroy={this.props._onDestroy} onEdit={this.props.onEdit}
                               static={this.props.data.static}
                               required={this.props.data.required}/>
                </div>
                }
                <InlineLayout inline={this.props.data.inline} compWidth={this.props.data.compWidth}
                    label={ <label className={(!this.props.data.inline ? "form-label" : "")+isRequired(this.props)}>
                        <span dangerouslySetInnerHTML={{__html: myxss.process(this.props.data.label)}}/>
                    </label>} >
                    <input {...props} style={this.props.data.inline ? {display: 'inline-flex'} : {}}
                           onClick={() => {
                               if (this.props.data.supportJS && this.props.data.hasOwnProperty('onClickStr')
                                   && !CommonUtil.isEmpty(this.props.data.onClickStr)) {
                                   eval(this.props.data.onClickStr)
                               }
                           }} onChange={(e) => {
                        if (this.props.data.supportJS && this.props.data.hasOwnProperty('onChangeStr')
                            && !CommonUtil.isEmpty(this.props.data.onChangeStr)) {
                            let target = e && e.target ? e.target : e;
                            let name = target.name;
                            let value = target.value;
                            let onChangeStr = this.props.data.onChangeStr;
                            onChangeStr = onChangeStr.replace(/'name'/g, name);
                            onChangeStr = onChangeStr.replace(/'value'/g, value);
                            eval(onChangeStr)
                        }
                    }} onBlur={() => {
                        if (this.props.data.supportJS && this.props.data.hasOwnProperty('onBlurStr')
                            && !CommonUtil.isEmpty(this.props.data.onBlurStr)) {
                            eval(this.props.data.onBlurStr)
                        }
                    }}/>
                </InlineLayout>
            </div>
        );
    }
}

export class NumberInput extends React.Component {
    constructor(props) {
        super(props);
        this.inputField = "child_ref_" + this.props.data.field_name;//React.createRef();
    }

    render() {
        let props = {};
        props.type = "number";
        props.className = "form-control";
        props.name = this.props.data.field_name;

        if (this.props.mutable) {
            props.defaultValue = this.props.defaultValue;
            props.ref = "child_ref_" + this.props.data.field_name;
        }

        if (this.props.read_only) {
            props.disabled = "disabled";
        }

        let baseClasses = getElementsClass(this.props.data);

        return (
            <div className={baseClasses}>
                { !this.props.mutable &&
                <div>
                    { this.props.data.pageBreakBefore &&
                    <div className="preview-page-break">Page Break</div>
                    }
                    <HeaderBar parent={this.props.parent} editModeOn={this.props.editModeOn} data={this.props.data}
                               onDestroy={this.props._onDestroy} onEdit={this.props.onEdit}
                               static={this.props.data.static}
                               required={this.props.data.required}/>
                </div>
                }
                <InlineLayout inline={this.props.data.inline}  compWidth={this.props.data.compWidth}
                              label={ <label className={(!this.props.data.inline ? "form-label" : "")+isRequired(this.props)}>
                    <span dangerouslySetInnerHTML={{__html: myxss.process(this.props.data.label)}}/>
                </label>} >
                    <input {...props} style={this.props.data.inline ? {display: 'inline-flex'} : {}}
                           onClick={() => {
                               if (this.props.data.supportJS && this.props.data.hasOwnProperty('onClickStr')
                                   && !CommonUtil.isEmpty(this.props.data.onClickStr)) {
                                   eval(this.props.data.onClickStr)
                               }
                           }} onChange={(e) => {
                        if (this.props.data.supportJS && this.props.data.hasOwnProperty('onChangeStr')
                            && !CommonUtil.isEmpty(this.props.data.onChangeStr)) {
                            let target = e && e.target ? e.target : e;
                            let name = target.name;
                            let value = target.value;
                            let onChangeStr = this.props.data.onChangeStr;
                            onChangeStr = onChangeStr.replace(/'name'/g, name);
                            onChangeStr = onChangeStr.replace(/'value'/g, value);
                            eval(onChangeStr)
                        }
                    }} onBlur={() => {
                        if (this.props.data.supportJS && this.props.data.hasOwnProperty('onBlurStr')
                            && !CommonUtil.isEmpty(this.props.data.onBlurStr)) {
                            eval(this.props.data.onBlurStr)
                        }
                    }}/>
                </InlineLayout>
            </div>
        );
    }
}

export class TextArea extends React.Component {
    constructor(props) {
        super(props);
        this.inputField = "child_ref_" + this.props.data.field_name;//React.createRef();
    }

    render() {
        let props = {};
        props.className = "";
        props.name = this.props.data.field_name;

        if (this.props.read_only) {
            props.disabled = "disabled";
        }

        if (this.props.mutable) {
            props.defaultValue = this.props.defaultValue;
            // props.ref = this.inputField;
        }

        let baseClasses = getElementsClass(this.props.data);

        return (
            <div className={baseClasses}>
                { !this.props.mutable &&
                <div>
                    { this.props.data.pageBreakBefore &&
                    <div className="preview-page-break">Page Break</div>
                    }
                    <HeaderBar parent={this.props.parent} editModeOn={this.props.editModeOn} data={this.props.data}
                               onDestroy={this.props._onDestroy} onEdit={this.props.onEdit}
                               static={this.props.data.static}
                               required={this.props.data.required}/>
                </div>
                }
                <InlineLayout inline={this.props.data.inline} compWidth={12}
                    label={ <label style={this.props.data.inline ? {verticalAlign: 'top'} : {}}
                                   className={(!this.props.data.inline ? "form-label" : "")+isRequired(this.props)}>
                        <span dangerouslySetInnerHTML={{__html: myxss.process(this.props.data.label)}}/>
                    </label> } >
                    <textarea {...props} style={{width:'100%'}} onClick={() => {
                        if (this.props.data.supportJS && this.props.data.hasOwnProperty('onClickStr')
                            && !CommonUtil.isEmpty(this.props.data.onClickStr)) {
                            eval(this.props.data.onClickStr)
                        }
                    }} onChange={(e) => {
                        if (this.props.data.supportJS && this.props.data.hasOwnProperty('onChangeStr')
                            && !CommonUtil.isEmpty(this.props.data.onChangeStr)) {
                            let target = e && e.target ? e.target : e;
                            let name = target.name;
                            let value = target.value;
                            let onChangeStr = this.props.data.onChangeStr;
                            onChangeStr = onChangeStr.replace(/'name'/g, name);
                            onChangeStr = onChangeStr.replace(/'value'/g, value);
                            eval(onChangeStr)
                        }
                    }} onBlur={() => {
                        if (this.props.data.supportJS && this.props.data.hasOwnProperty('onBlurStr')
                            && !CommonUtil.isEmpty(this.props.data.onBlurStr)) {
                            eval(this.props.data.onBlurStr)
                        }
                    }}/>
                </InlineLayout>
            </div>
        );
    }
}

export class TimePicker extends React.Component {
    constructor(props) {
        super(props);
        this.inputField = "child_ref_" + this.props.data.field_name;//React.createRef();

        this.state = {
            value: "",
            placeholder: 'HH:mm',
        };
    }

    handleChange = (value) => {
        this.setState({
            value
        })
    };

    render() {
        let props = {};
        props.type = "time";
        props.className = "";
        props.name = this.props.data.field_name;
        props.value = this.state.value;
        if (this.props.mutable) {
            props.defaultValue = this.props.defaultValue;
            props.ref = this.inputField;
        }

        if (this.props.read_only) {
            props.disabled = "disabled";
        }

        let baseClasses = getElementsClass(this.props.data);
        return (
            <div className={baseClasses}>
                { !this.props.mutable &&
                <div>
                    { this.props.data.pageBreakBefore &&
                    <div className="preview-page-break">Page Break</div>
                    }
                    <HeaderBar parent={this.props.parent} editModeOn={this.props.editModeOn} data={this.props.data}
                               onDestroy={this.props._onDestroy} onEdit={this.props.onEdit}
                               static={this.props.data.static}
                               required={this.props.data.required}/>
                </div>
                }
                <InlineLayout inline={this.props.data.inline}  compWidth={this.props.data.compWidth}
                    label={ <label className={(!this.props.data.inline ? "form-label" : "")+isRequired(this.props)}>
                        <span dangerouslySetInnerHTML={{__html: myxss.process(this.props.data.label)}}/>
                    </label>} >
                    <div style={this.props.data.inline ? {display: 'inline-flex'} : {}}>
                        { this.props.data.readOnly &&
                        <input type="text"
                               name={props.name}
                               ref={props.ref}
                               readOnly="true"
                               dateFormat="HH:mm"
                               placeholder={this.state.placeholder}
                               value={this.state.value}
                               className="form-control"/>
                        }
                        <HourMinSelect {...props} onChangeHandler={this.handleChange}/>
                    </div>
                </InlineLayout>
            </div>
        );
    }
}

export class DatePicker extends React.Component {
    constructor(props) {
        super(props);
        this.inputField = "child_ref_" + this.props.data.field_name;//React.createRef();
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
        let value = "", internalValue = undefined;
        if (this.props.data.defaultToday && !this.state.defaultToday) {
            value = moment().format('MM/DD/YYYY');
            internalValue = moment(this.state.value);
        }
        this.setState({
            value, internalValue, defaultToday: this.props.data.defaultToday
        })
    }

    render() {
        let props = {};
        props.type = "date";
        props.className = "";
        props.name = this.props.data.field_name;

        var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

        if (this.props.mutable) {
            props.defaultValue = this.props.defaultValue;
            props.ref = this.inputField;
        }

        if (this.props.read_only) {
            props.disabled = "disabled";
        }
        props.value=this.state.value
        let baseClasses = getElementsClass(this.props.data);

        const dataDiv = <div >
            {/*<FA name="calendar" style={{marginRight: '3px', marginLeft: '3px', marginTop: '3px', marginBottom: '3px'}}/>*/}
            <img src={datePickerIcon} style={{marginRight: '3px', marginLeft: '3px', marginTop: '3px', marginBottom: '3px'}} alt=""/>
            <input type="text" className='widget-date-input' style={{width: '131px', background: 'white'}} id={props.name}
                   name={props.name} disabled={true} value={this.state.value} />
        </div>;
        return (
            <div className={baseClasses}>
                { !this.props.mutable &&
                <div>
                    { this.props.data.pageBreakBefore &&
                    <div className="preview-page-break">Page Break</div>
                    }
                    <HeaderBar parent={this.props.parent} editModeOn={this.props.editModeOn} data={this.props.data}
                               onDestroy={this.props._onDestroy} onEdit={this.props.onEdit}
                               static={this.props.data.static}
                               required={this.props.data.required}/>
                </div>
                }
                <InlineLayout inline={this.props.data.inline}  compWidth={this.props.data.compWidth}
                              label={ <label className={(!this.props.data.inline ? "form-label" : "")+isRequired(this.props)}>
                    <span dangerouslySetInnerHTML={{__html: myxss.process(this.props.data.label)}}/>
                </label>} >
                    <div style={this.props.data.inline ? {display: 'inline-flex'} : {}} className="commonInput">
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
                                         onChange={this.handleChange}
                                         selected={this.state.internalValue}
                                         minDate={this.props.hasOwnProperty("disabledPastDate") && this.props.disabledPastDate === false ? null : moment()}
                                         todayButton={'Today'}
                                         isClearable={true}
                                         dateFormat="MM/DD/YYYY"
                                         placeholderText={this.state.placeholder}/>
                        }
                        { !iOS && !this.props.data.readOnly &&
                        <input type="hidden" ref={props.ref} name={props.name} value={this.state.value} /> }
                    </div>
                </InlineLayout>
            </div>
        );
    }
}

export class Dropdown extends React.Component {
    constructor(props) {
        super(props);
        this.inputField = "child_ref_" + this.props.data.field_name;//React.createRef();
    }

    render() {
        let props = {};
        props.className = "form-control";
        props.name = this.props.data.field_name;

        if (this.props.mutable) {
            props.defaultValue = this.props.defaultValue;
            props.ref = this.inputField;
        }
        props.creatable = this.props.data.creatable;
        props.clearable = this.props.data.clearable;
        props.multi = this.props.data.multiple;
        props.options = this.props.data.options;
        if (this.props.read_only) {
            props.disabled = "disabled";
        }

        let baseClasses = getElementsClass(this.props.data);

        return (
            <div className={baseClasses}>
                { !this.props.mutable &&
                <div>
                    { this.props.data.pageBreakBefore &&
                    <div className="preview-page-break">Page Break</div>
                    }
                    <HeaderBar parent={this.props.parent} editModeOn={this.props.editModeOn} data={this.props.data}
                               onDestroy={this.props._onDestroy} onEdit={this.props.onEdit}
                               static={this.props.data.static}
                               required={this.props.data.required}/>
                </div>
                }

                <InlineLayout inline={this.props.data.inline}  compWidth={this.props.data.compWidth}
                              label={ <label className={(!this.props.data.inline ? "form-label" : "")+isRequired(this.props)}>
                    <span dangerouslySetInnerHTML={{__html: myxss.process(this.props.data.label)}}/>
                </label>} >
                    <div style={this.props.data.inline ? {display: 'inline-flex'} : {}}>
                        <SelectWidget {...props}
                            onClick={() => {
                                if (this.props.data.supportJS && this.props.data.hasOwnProperty('onClickStr')
                                    && !CommonUtil.isEmpty(this.props.data.onClickStr)) {
                                    eval(this.props.data.onClickStr)
                                }
                            }} onChange={(e) => {
                                let target = e && e.target ? e.target : e;
                                let name = target.name;
                                let value = target.value;
                                if (this.props.data.supportJS && this.props.data.hasOwnProperty('onChangeStr')
                                    && !CommonUtil.isEmpty(this.props.data.onChangeStr)) {
                                    let onChangeStr = this.props.data.onChangeStr;
                                    onChangeStr = onChangeStr.replace(/'name'/g, name);
                                    onChangeStr = onChangeStr.replace(/'value'/g, value);
                                    eval(onChangeStr)
                                }
                            }} onBlur={() => {
                                if (this.props.data.supportJS && this.props.data.hasOwnProperty('onBlurStr')
                                    && !CommonUtil.isEmpty(this.props.data.onBlurStr)) {
                                    eval(this.props.data.onBlurStr)
                                }
                            }}>
                        </SelectWidget>
                    </div>
                </InlineLayout>
            </div>
        );
    }
}

export class AsyncDropdown extends React.Component {
    constructor(props) {
        super(props);
        this.inputField = "child_ref_" + this.props.data.field_name;//React.createRef();
    }

    state = {value: this.props.defaultValue !== undefined ? this.props.defaultValue.split(",") : []};

    handleChange = (e) => {
        this.setState({value: e});
        if (this.props.data.supportJS && this.props.data.hasOwnProperty('onChangeStr')
            && !CommonUtil.isEmpty(this.props.data.onChangeStr)) {
            let target = e && e.target ? e.target : e;
            let name = target.name;
            let value = target.value;
            let onChangeStr = this.props.data.onChangeStr;
            onChangeStr = onChangeStr.replace(/'name'/g, name);
            onChangeStr = onChangeStr.replace(/'value'/g, value);
            eval(onChangeStr)
        }
    };
    loadOptionsHandle = (input) => {
        let {loadOptionUrl, responseFeild, labelFeild, valueFeild,needAuthorization} = this.props.data;
        let token = this.props.token
        let api_url = loadOptionUrl + input
        let authorization = {};
        if(needAuthorization){
            authorization = {Authorization: `${token.tokenType} ${token.accessToken}`}
        }
        return HttpUtil.get(api_url, {}, undefined, false, false,authorization).then(json => {
            var items = json.response[responseFeild] && json.response[responseFeild].map((item) => {
                    return {
                        "value": item[valueFeild],
                        "label": item[labelFeild]
                    };
                });
            return {options: items};
        })
    }

    render() {
        let props = {};
        props.multi = true;
        props.name = this.props.data.field_name;
        props.onChange = this.handleChange;
        props.loadOptionUrl = this.loadOptionUrl;
        props.creatable = this.props.data.creatable;
        props.clearable = this.props.data.clearable;
        props.multi = this.props.data.multiple;

        if (!this.props.mutable) {
            // props.value = options[0].text
        } // to show a sample of what tags looks like
        if (this.props.mutable) {
            props.ref = this.inputField;
        }
        props.value = this.state.value;

        let baseClasses = getElementsClass(this.props.data);
        return (
            <div className={baseClasses}>
                { !this.props.mutable &&
                <div>
                    { this.props.data.pageBreakBefore &&
                    <div className="preview-page-break">Page Break</div>
                    }
                    <HeaderBar parent={this.props.parent} editModeOn={this.props.editModeOn} data={this.props.data}
                               onDestroy={this.props._onDestroy} onEdit={this.props.onEdit}
                               static={this.props.data.static}
                               required={this.props.data.required}/>
                </div>
                }
                <InlineLayout inline={this.props.data.inline} compWidth={this.props.data.compWidth}
                              label={ <label className={(!this.props.data.inline ? "form-label" : "")+isRequired(this.props)}>
                    <span dangerouslySetInnerHTML={{__html: myxss.process(this.props.data.label)}}/>
                </label>} >
                    <div style={this.props.data.inline ? {display: 'inline-flex'} : {}}>
                        <SelectAsync {...props} loadOptions={this.loadOptionsHandle}
                                     onClick={() => {
                                         if (this.props.data.supportJS && this.props.data.hasOwnProperty('onClickStr')
                                             && !CommonUtil.isEmpty(this.props.data.onClickStr)) {
                                             eval(this.props.data.onClickStr)
                                         }
                                     }} onBlur={() => {
                            if (this.props.data.supportJS && this.props.data.hasOwnProperty('onBlurStr')
                                && !CommonUtil.isEmpty(this.props.data.onBlurStr)) {
                                eval(this.props.data.onBlurStr)
                            }
                        }}/>
                    </div>
                </InlineLayout>
            </div>
        );
    }
}

export class Checkboxes extends React.Component {
    constructor(props) {
        super(props);
        this.options = {};
        this.state={
            value:[]
        }
    }
    onChange = (value)=>{
        let stateValue = this.state.value
        if(stateValue.indexOf(value) >=0 ){
            stateValue = update(this.state.value,{$splice:[[stateValue.indexOf(value),1]]})
        }else{
            stateValue = update(this.state.value,{$push:[value]})
        }
        this.setState({
            value:stateValue
        })
    }
    render() {
        let self = this;
        let classNames = 'checkbox-label';
        if (this.props.data.optionInline) {
            classNames += ' option-inline';
        }

        let baseClasses = getElementsClass(this.props.data);

        return (
            <div className={baseClasses}>
                { !this.props.mutable &&
                <div>
                    { this.props.data.pageBreakBefore &&
                    <div className="preview-page-break">Page Break</div>
                    }
                    <HeaderBar parent={this.props.parent} editModeOn={this.props.editModeOn} data={this.props.data}
                               onDestroy={this.props._onDestroy} onEdit={this.props.onEdit}
                               static={this.props.data.static}
                               required={this.props.data.required}/>
                </div>
                }
                <InlineLayout inline={this.props.data.inline} compWidth={this.props.data.compWidth}
                              label={ <label className={(!this.props.data.inline ? "form-label" : "")+isRequired(this.props)}  style={this.props.data.inline ? {verticalAlign: 'top'} : {}}>
                    <span dangerouslySetInnerHTML={{__html: myxss.process(this.props.data.label)}}/>
                </label>} >
                    <div style={this.props.data.inline ? {display: 'inline-block',textAlign:'left'} : {}}>
                        <input name={this.props.data.field_name} type="hidden" value={this.state.value} />
                        {this.props.data.options.map((option) => {
                            let this_key = 'preview_' + option.key;
                            let props = {};
                            props.name = self.props.data.field_name;// 'option_' + option.key;
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
                                    } } {...props} checked={this.state.value.indexOf(option.value)>=0} onClick={() => {
                                        this.onChange(option.value)
                                        if (this.props.data.supportJS && this.props.data.hasOwnProperty('onClickStr')
                                            && !CommonUtil.isEmpty(this.props.data.onClickStr)) {
                                            eval(this.props.data.onClickStr)
                                        }
                                    }} onChange={(e) => {
                                        if (this.props.data.supportJS && this.props.data.hasOwnProperty('onChangeStr')
                                            && !CommonUtil.isEmpty(this.props.data.onChangeStr)) {
                                            let target = e && e.target ? e.target : e;
                                            let name = target.name;
                                            let value = target.value;
                                            let onChangeStr = this.props.data.onChangeStr;
                                            onChangeStr = onChangeStr.replace(/'name'/g, name);
                                            onChangeStr = onChangeStr.replace(/'value'/g, value);
                                            eval(onChangeStr)
                                        }
                                    }} onBlur={() => {
                                        if (this.props.data.supportJS && this.props.data.hasOwnProperty('onBlurStr')
                                            && !CommonUtil.isEmpty(this.props.data.onBlurStr)) {
                                            eval(this.props.data.onBlurStr)
                                        }
                                    }}/> {option.label}
                                </label>
                            )
                        })}
                    </div>
                </InlineLayout>
            </div>
        );
    }
}

export class RadioButtons extends React.Component {
    constructor(props) {
        super(props);
        this.options = {};
    }

    render() {
        let self = this;
        let classNames = 'radio-label';
        if (this.props.data.optionInline) {
            classNames += ' option-inline';
        }

        let baseClasses = getElementsClass(this.props.data);

        return (
            <div className={baseClasses}>
                { !this.props.mutable &&
                <div>
                    { this.props.data.pageBreakBefore &&
                    <div className="preview-page-break">Page Break</div>
                    }
                    <HeaderBar parent={this.props.parent} editModeOn={this.props.editModeOn} data={this.props.data}
                               onDestroy={this.props._onDestroy} onEdit={this.props.onEdit}
                               static={this.props.data.static}
                               required={this.props.data.required}/>
                </div>
                }

                <InlineLayout inline={this.props.data.inline}  compWidth={this.props.data.compWidth}
                              label={ <label className={(!this.props.data.inline ? "form-label" : "")+isRequired(this.props)}  style={this.props.data.inline ? {verticalAlign: 'top'} : {}}>
                    <span dangerouslySetInnerHTML={{__html: myxss.process(this.props.data.label)}}/>
                </label>} >
                    <div style={this.props.data.inline ? {display: 'inline-block',textAlign:'left'} : {}}>
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
                                <label className={classNames} key={this_key} style={{whiteSpace:'nowrap'}}>
                                    <input ref={c => {
                                        if (c && self.props.mutable) {
                                            self.options[`child_ref_${option.key}`] = c;
                                        }
                                    } } {...props} onClick={() => {
                                        if (this.props.data.supportJS && this.props.data.hasOwnProperty('onClickStr')
                                            && !CommonUtil.isEmpty(this.props.data.onClickStr)) {
                                            eval(this.props.data.onClickStr)
                                        }
                                    }} onChange={(e) => {
                                        if (this.props.data.supportJS && this.props.data.hasOwnProperty('onChangeStr')
                                            && !CommonUtil.isEmpty(this.props.data.onChangeStr)) {
                                            let target = e && e.target ? e.target : e;
                                            let name = target.name;
                                            let value = target.value;
                                            let onChangeStr = this.props.data.onChangeStr;
                                            onChangeStr = onChangeStr.replace(/'name'/g, name);
                                            onChangeStr = onChangeStr.replace(/'value'/g, value);
                                            eval(onChangeStr)
                                        }
                                    }} onBlur={() => {
                                        if (this.props.data.supportJS && this.props.data.hasOwnProperty('onBlurStr')
                                            && !CommonUtil.isEmpty(this.props.data.onBlurStr)) {
                                            eval(this.props.data.onBlurStr)
                                        }
                                    }}/> {option.label}
                                </label>
                            )
                        })}
                    </div>
                </InlineLayout>
            </div>
        );
    }
}

export class Image extends React.Component {
    // mixins: [SortableItemMixin],
    render() {
        var style = (this.props.data.center) ? {textAlign: 'center'} : {};

        let baseClasses = getElementsClass(this.props.data);

        return (
            <div className={baseClasses} style={style}>
                { !this.props.mutable &&
                <HeaderBar parent={this.props.parent} editModeOn={this.props.editModeOn} data={this.props.data}
                           onDestroy={this.props._onDestroy} onEdit={this.props.onEdit}
                           required={this.props.data.required}/>
                }
                { this.props.data.src &&
                <img src={this.props.data.src} width={this.props.data.width} height={this.props.data.height} alt="" />
                }
                { !this.props.data.src &&
                <div className="no-image">No Image</div>
                }
            </div>
        );
    }
}

export class Rating extends React.Component {
    constructor(props) {
        super(props);
        this.inputField = "child_ref_" + this.props.data.field_name;//React.createRef();
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

        let baseClasses = getElementsClass(this.props.data);

        return (
            <div className={baseClasses}>
                { !this.props.mutable &&
                <div>
                    { this.props.data.pageBreakBefore &&
                    <div className="preview-page-break">Page Break</div>
                    }
                    <HeaderBar parent={this.props.parent} editModeOn={this.props.editModeOn} data={this.props.data}
                               onDestroy={this.props._onDestroy} onEdit={this.props.onEdit}
                               static={this.props.data.static}
                               required={this.props.data.required}/>
                </div>
                }

                <InlineLayout inline={this.props.data.inline}  compWidth={this.props.data.compWidth}
                              label={ <label className={(!this.props.data.inline ? "form-label" : "")+isRequired(this.props)} >
                    <span dangerouslySetInnerHTML={{__html: myxss.process(this.props.data.label)}}/>
                </label>} >
                    <div style={this.props.data.inline ? {display: 'inline-block'} : {}}>
                        <StarRating {...props} />
                    </div>
                </InlineLayout>
            </div>
        );
    }
}

export class HyperLink extends React.Component {
    // mixins: [SortableItemMixin],
    render() {
        let baseClasses = getElementsClass(this.props.data);

        return (
            <div className={baseClasses}>
                { !this.props.mutable &&
                <div>
                    { this.props.data.pageBreakBefore &&
                    <div className="preview-page-break">Page Break</div>
                    }
                    <HeaderBar parent={this.props.parent} editModeOn={this.props.editModeOn} data={this.props.data}
                               onDestroy={this.props._onDestroy} onEdit={this.props.onEdit}
                               static={this.props.data.static}
                               required={this.props.data.required}/>
                </div>
                }
                <div className="form-group">
                    <a target="_blank" href={this.props.data.href}>
                        <span style={{color:'blue',textDecoration:'underline',cursor:'hand'}} dangerouslySetInnerHTML={{__html: myxss.process(this.props.data.content)}}/>
                    </a>
                </div>
            </div>
        );
    }
}

export class Download extends React.Component {
    // mixins: [SortableItemMixin],
    render() {
        let baseClasses = getElementsClass(this.props.data);

        return (
            <div className={baseClasses}>
                { !this.props.mutable &&
                <div>
                    { this.props.data.pageBreakBefore &&
                    <div className="preview-page-break">Page Break</div>
                    }
                    <HeaderBar parent={this.props.parent} editModeOn={this.props.editModeOn} data={this.props.data}
                               onDestroy={this.props._onDestroy} onEdit={this.props.onEdit}
                               static={this.props.data.static}
                               required={this.props.data.required}/>
                </div>
                }
                <div className="form-group">
                    <a href={this.props.data.file_path}>
                        <span style={{color:'blue',cursor:'hand'}} dangerouslySetInnerHTML={{__html: myxss.process(this.props.data.content)}}/>
                    </a>
                </div>
            </div>
        );
    }
}


export class UploadFile extends React.Component {
    render() {
        let baseClasses = getElementsClass(this.props.data);

        return (
            <div className={baseClasses}>
                { !this.props.mutable &&
                <div>
                    { this.props.data.pageBreakBefore &&
                    <div className="preview-page-break">Page Break</div>
                    }
                    <HeaderBar parent={this.props.parent} editModeOn={this.props.editModeOn} data={this.props.data}
                               onDestroy={this.props._onDestroy} onEdit={this.props.onEdit}
                               static={this.props.data.static}
                               required={this.props.data.required}/>
                </div>
                }
                <InlineLayout inline={this.props.data.inline} compWidth={this.props.data.compWidth}
                              label={ <label className={(!this.props.data.inline ? "form-label" : "")+isRequired(this.props)} >
                    <span dangerouslySetInnerHTML={{__html: myxss.process(this.props.data.label)}}/>
                </label>} >
                    <div style={{textAlign:'left'}}>
                        <FineUploader {...this.props } {...this.props.data } isRequiredClassName={isRequired(this.props)} />
                    </div>
                </InlineLayout>
            </div>
        );
    }
}

export class Camera extends React.Component {
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
        let baseClasses = getElementsClass(this.props.data);

        return (
            <div className={baseClasses}>
                { !this.props.mutable &&
                <div>
                    { this.props.data.pageBreakBefore &&
                    <div className="preview-page-break">Page Break</div>
                    }
                    <HeaderBar parent={this.props.parent} editModeOn={this.props.editModeOn} data={this.props.data}
                               onDestroy={this.props._onDestroy} onEdit={this.props.onEdit}
                               static={this.props.data.static}
                               required={this.props.data.required}/>
                </div>
                }
                <InlineLayout inline={this.props.data.inline}  compWidth={this.props.data.compWidth}
                              label={ <label className={(!this.props.data.inline ? "form-label" : "")+isRequired(this.props)} >
                    <span dangerouslySetInnerHTML={{__html: myxss.process(this.props.data.label)}}/>
                </label>} >
                    <div className="image-upload-container">
                        { !this.state.img &&
                        <div>
                            <input type="file" accept="image/*" capture="camera" className="image-upload"
                                   onChange={this.displayImage}/>
                            <div className="image-upload-control">
                                <div className="btn btn-default btn-school"><FA name="camera"/> Upload Photo</div>
                            </div>
                        </div>
                        }
                        { this.state.img &&
                        <div>
                            <img src={ this.state.img } height="100" className="image-upload-preview" alt={this.props.data.label} /><br />
                            <div className="btn btn-school btn-image-clear" onClick={this.clearImage}>
                                <FA name="times"/> Clear Photo
                            </div>
                        </div>
                        }
                    </div>
                </InlineLayout>
            </div>
        );
    }
}

export class Range extends React.Component {
    constructor(props) {
        super(props);
        this.inputField = "child_ref_" + this.props.data.field_name;//React.createRef();
    }

    render() {
        let props = {};
        props.type = "range";
        props.name = this.props.data.field_name;
        props.list = "tickmarks_" + this.props.data.field_name;
        props.min = this.props.data.min_value;
        props.max = this.props.data.max_value;
        props.step = this.props.step !== undefined ? parseInt(this.props.step, 10) : parseInt(this.props.data.step, 10);
        ;

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

        let baseClasses = getElementsClass(this.props.data);

        return (
            <div className={baseClasses}>
                { !this.props.mutable &&
                <div>
                    { this.props.data.pageBreakBefore &&
                    <div className="preview-page-break">Page Break</div>
                    }
                    <HeaderBar parent={this.props.parent} editModeOn={this.props.editModeOn} data={this.props.data}
                               onDestroy={this.props._onDestroy} onEdit={this.props.onEdit}
                               static={this.props.data.static}
                               required={this.props.data.required}/>
                </div>
                }
                <InlineLayout inline={this.props.data.inline}  compWidth={this.props.data.compWidth}
                              label={ <label className={(!this.props.data.inline ? "form-label" : "")+isRequired(this.props)}  style={this.props.data.inline ? {verticalAlign: 'top'} : {}}>
                    <span dangerouslySetInnerHTML={{__html: myxss.process(this.props.data.label)}}/>
                </label>} >
                    <div style={this.props.data.inline ? {display: 'inline-block', width: "60%"} : {}}>
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
                </InlineLayout>
            </div>
        );
    }
}

let FormElements = {};
FormElements.Header = Header;
FormElements.Paragraph = Paragraph;
FormElements.Label = Label;
FormElements.LineBreak = LineBreak;
FormElements.TextInput = TextInput;
FormElements.NumberInput = NumberInput;
FormElements.TextArea = TextArea;
FormElements.Dropdown = Dropdown;
FormElements.AsyncDropdown = AsyncDropdown;
FormElements.Checkboxes = Checkboxes;
FormElements.RadioButtons = RadioButtons;
FormElements.DatePicker = DatePicker;
FormElements.TimePicker = TimePicker;
FormElements.HyperLink = HyperLink;
FormElements.Download = Download;
FormElements.UploadFile = UploadFile;
FormElements.Camera = Camera;
FormElements.Image = Image;
FormElements.Rating = Rating;
FormElements.Range = Range;

export default FormElements;
