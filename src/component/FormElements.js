import React from 'react';
import xss from 'xss';
import moment from 'moment';
import FA from 'react-fontawesome'
import update from 'immutability-helper';
import ReactDatePicker from 'react-datepicker';
import ReactBootstrapSlider from  'react-bootstrap-slider';
import { Col } from 'react-bootstrap'
import HeaderBar from './HeaderBar';
import MessagePopup from '../../../MessagePopup.js';
import StarRating from './elements/StarRating';
import SelectWidget from './elements/SelectWidget';
import SelectAsync from './elements/SelectAsync';
import FineUploader from './elements/FineUploader';
import HourMinSelect from './elements/HourMinSelect';
import * as CommonUtil from '../../../utils/CommonUtil';
import HttpUtil from '../../../utils/HttpUtil';
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
    return " dispalyInline ";
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
    if(elementData.hidden){
        baseClasses += ' form-item-hidden ';
    }
    return baseClasses;
}

class InlineLayout extends React.Component {
    render(){
        let labelCol=parseInt(this.props.labelWidth?this.props.labelWidth:4,10);
        let inputCol=parseInt(this.props.inputWidth?this.props.inputWidth:8,10);
        if(this.props.inline){
            return <div className="form-group" style={{marginBottom:'15px'}}>
                { labelCol===0?false: <Col xs={labelCol} style={{padding:'0',textAlign:'right'}}>{this.props.label}</Col>}
                <Col xs={inputCol}>{this.props.children}</Col>
            </div>
        }else{
            return <div className="form-group" style={{marginBottom:'15px'}}>
                { labelCol===0?false:this.props.label}
                {this.props.children}
            </div>
        }
    }
}

class HeaderBarPanel extends React.Component {
    render(){
        let rtn = !this.props.mutable ?
            <div>
                { this.props.data.pageBreakBefore &&
                <div className="preview-page-break">Page Break</div>
                }
                <HeaderBar parent={this.props.parent} editModeOn={this.props.editModeOn} data={this.props.data}
                           onDestroy={this.props._onDestroy} copyElement={this.props.copyElement}  onEdit={this.props.onEdit}
                           static={this.props.data.static}
                           required={this.props.data.required}/>
            </div>:false
        return rtn
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
                <HeaderBarPanel {...this.props} />
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
                <HeaderBarPanel {...this.props} />
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
                <HeaderBarPanel {...this.props} />
                <label style={{width:"100%"}} className={classNames}
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
                <HeaderBarPanel {...this.props} />
                <hr />
            </div>
        );
    }
}

export class TextInput extends React.Component {
    render() {
        let props = {};
        props.type = "text";
        props.name = this.props.data.field_name;
        props.placeholder= this.props.data.placeholder;
        props.value = this.props.value;
        if(this.props.value===undefined || this.props.value==="")
        {
            props.value=(this.props.data.defaultValue===undefined || this.props.data.defaultValue===""?"":this.props.data.defaultValue)
        }
        if (this.props.read_only) {
            props.disabled = "disabled";
        }
        let baseClasses = getElementsClass(this.props.data);

        return (
            <div className={baseClasses} id={"div_form_item_"+this.props.data.field_name}>
                <HeaderBarPanel {...this.props} />
                <InlineLayout inline={this.props.data.inline} compWidth={this.props.data.compWidth}
                              labelWidth={this.props.data.labelWidth} inputWidth={this.props.data.inputWidth}
                    label={ <label className={(!this.props.data.inline ? "form-label" : "")+isRequired(this.props)}>
                        <span dangerouslySetInnerHTML={{__html: myxss.process(this.props.data.label)}}/>
                    </label>} >
                    <input {...props} value={props.value} style={this.props.data.inline ? {display: 'inline-flex'} : {}}
                           onClick={() => {
                               if (this.props.data.supportJS && this.props.data.hasOwnProperty('onClickStr')
                                   && !CommonUtil.isEmpty(this.props.data.onClickStr)) {
                                   eval(this.props.data.onClickStr)
                               }
                           }} onChange={(e)=>{this.props.handleChange(e,this.props.data)}} onBlur={() => {
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
    render() {
        let props = {};
        props.type = "number";
        props.name = this.props.data.field_name;
        props.placeholder= this.props.data.placeholder;
        props.value = this.props.value;
        if(this.props.value===undefined || this.props.value==="")
        {
            props.value=(this.props.data.defaultValue===undefined || this.props.data.defaultValue===""?"":this.props.data.defaultValue)
        }
        if (this.props.read_only) {
            props.disabled = "disabled";
        }

        let baseClasses = getElementsClass(this.props.data);

        return (
            <div className={baseClasses} id={"div_form_item_"+this.props.data.field_name}>
                <HeaderBarPanel {...this.props} />
                <InlineLayout inline={this.props.data.inline}  compWidth={this.props.data.compWidth}
                              labelWidth={this.props.data.labelWidth} inputWidth={this.props.data.inputWidth}
                              label={ <label className={(!this.props.data.inline ? "form-label" : "")+isRequired(this.props)}>
                    <span dangerouslySetInnerHTML={{__html: myxss.process(this.props.data.label)}}/>
                </label>} >
                    <input {...props} value={props.value} style={this.props.data.inline ? {display: 'inline-flex'} : {}}
                        onClick={() => {
                               if (this.props.data.supportJS && this.props.data.hasOwnProperty('onClickStr')
                                   && !CommonUtil.isEmpty(this.props.data.onClickStr)) {
                                   eval(this.props.data.onClickStr)
                               }
                           }} onChange={(e)=>{this.props.handleChange(e,this.props.data)}}
                        onBlur={() => {
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
    render() {
        let props = {};
        props.className = "";
        props.name = this.props.data.field_name;
        props.value = this.props.value;
        if(this.props.value===undefined || this.props.value==="")
        {
            props.value=(this.props.data.defaultValue===undefined || this.props.data.defaultValue===""?"":this.props.data.defaultValue)
        }
        if (this.props.read_only) {
            props.disabled = "disabled";
        }

        let baseClasses = getElementsClass(this.props.data);

        return (
            <div className={baseClasses} id={"div_form_item_"+this.props.data.field_name}>
                <HeaderBarPanel {...this.props} />
                <InlineLayout inline={this.props.data.inline} compWidth={this.props.data.compWidth}
                              labelWidth={this.props.data.labelWidth} inputWidth={this.props.data.inputWidth}
                    label={ <label style={this.props.data.inline ? {verticalAlign: 'top'} : {}}
                                   className={(!this.props.data.inline ? "form-label" : "")+isRequired(this.props)}>
                        <span dangerouslySetInnerHTML={{__html: myxss.process(this.props.data.label)}}/>
                    </label> } >
                    <textarea {...props} value={props.value} style={{width:'100%'}} onClick={() => {
                        if (this.props.data.supportJS && this.props.data.hasOwnProperty('onClickStr')
                            && !CommonUtil.isEmpty(this.props.data.onClickStr)) {
                            eval(this.props.data.onClickStr)
                        }
                    }} onChange={(e)=>{this.props.handleChange(e,this.props.data)}}
                    onBlur={() => {
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
    handleChange = (timevalue) => {
        let name = this.props.data.field_name;
        let value = !CommonUtil.isEmpty(timevalue) ? (moment.isMoment(timevalue) ? timevalue.format("HH:mm") : timevalue) : null;
        let target = {
            name,
            value
        }
        this.props.handleChange(target,this.props.data)
    };

    render() {
        let props = {};
        props.type = "time";
        props.className = "";
        props.name = this.props.data.field_name;
        props.value = this.props.value;

        props.disabled=false;
        let readOnly=this.props.read_only || this.props.data.readOnly?true:false;
        if (this.props.read_only) {
            props.disabled = true;
        }
        let baseClasses = getElementsClass(this.props.data);
        return (
            <div className={baseClasses} id={"div_form_item_"+this.props.data.field_name}>
                <HeaderBarPanel {...this.props} />
                <InlineLayout inline={this.props.data.inline}  compWidth={this.props.data.compWidth}
                              labelWidth={this.props.data.labelWidth} inputWidth={this.props.data.inputWidth}
                              label={ <label className={(!this.props.data.inline ? "form-label" : "")+isRequired(this.props)}>
                        <span dangerouslySetInnerHTML={{__html: myxss.process(this.props.data.label)}}/>
                    </label>} >
                    <div style={this.props.data.inline ? {display: 'flex'} : {}}>
                        { readOnly ?<input type="text" {...props} readOnly="true" placeholder= 'HH:mm'value={props.value}/>
                        :<HourMinSelect {...props} onChangeHandler={this.handleChange}/>}
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
            value = props.value;
            if (props.value !== '' && props.value !== undefined) {
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

    componentWillReceiveProps(nextProps) {
        let value = "", internalValue = undefined;
        if (nextProps.data.defaultToday && !this.state.defaultToday) {
            value = moment().format('MM/DD/YYYY');
            internalValue = moment(this.state.value);
        }else {
            value = nextProps.value;
            if (nextProps.value !== '' && nextProps.value !== undefined) {
                internalValue = moment(value, 'MM/DD/YYYY');
            }
        }
        this.setState({
            value, internalValue, defaultToday: nextProps.data.defaultToday
        })
    }

    handleChange = (dt) => {
        if (dt && dt.target) {

            var placeholder = (dt && dt.target && dt.target.value === '') ? 'MM/DD/YYYY' : '';
            var formattedDate = (dt.target.value) ? moment(dt.target.value).format('YYYY-MM-DD') : '';

            this.setState({
                value: formattedDate,
                internalValue: formattedDate,
                placeholder: placeholder
            },()=>{
                this.props.handleChange(dt.target,this.props.data)
            });

        } else {
            this.setState({
                value: (dt) ? dt.format('MM/DD/YYYY') : '',
                internalValue: dt,
                placeholder: placeholder
            },()=>{
                let name = this.props.data.field_name;
                this.props.handleChange({name,value:this.state.value},this.props.data)
            });
        }
    };


    render() {
        let props = {};
        props.type = "date";
        props.className = "";
        props.name = this.props.data.field_name;

        var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        props.disabled=false;
        if (this.props.read_only) {
            props.disabled = true;
        }
        let readOnly=this.props.read_only || this.props.data.readOnly?true:false;
        props.value=this.state.value
        let baseClasses = getElementsClass(this.props.data);
        const dataDiv = <div style={{width:'100%',display:'flex'}}>
            <img src={datePickerIcon} style={{margin: '3px'}} alt=""/>
            <input type="text" className='widget-date-input' style={{width: '100%', background: 'white'}} id={props.name}
                   name={props.name} disabled={true} value={this.state.value} />
        </div>;
        return (
            <div className={baseClasses} id={"div_form_item_"+this.props.data.field_name}>
                <HeaderBarPanel {...this.props} />
                <InlineLayout inline={this.props.data.inline}  compWidth={this.props.data.compWidth}
                              labelWidth={this.props.data.labelWidth} inputWidth={this.props.data.inputWidth}
                              label={ <label className={(!this.props.data.inline ? "form-label" : "")+isRequired(this.props)}>
                    <span dangerouslySetInnerHTML={{__html: myxss.process(this.props.data.label)}}/>
                </label>} >
                    <div style={this.props.data.inline ? {display: 'inline-flex',width:"100%"} : {}} className="commonInput">
                        { readOnly &&
                        <input type="text"
                               name={props.name}
                               readOnly="true"
                               value={this.state.value}
                               />
                        }{/*className="form-control"*/}
                        { iOS && !readOnly &&
                        <input type="date"
                               name={props.name}
                               onChange={this.handleChange}

                               placeholder={this.state.placeholder}
                               value={this.state.value}
                               />
                        }
                        { !iOS && !readOnly &&
                        <ReactDatePicker customInput={dataDiv}
                                         onChange={this.handleChange}
                                         selected={this.state.internalValue}
                                         minDate={this.props.hasOwnProperty("disabledPastDate") && this.props.disabledPastDate === false ? null : moment()}
                                         dateFormat="MM/DD/YYYY"
                                         placeholderText={this.state.placeholder}/>
                        }
                        { !iOS && !readOnly &&
                        <input type="hidden" name={props.name} value={this.state.value} /> }
                    </div>
                </InlineLayout>
            </div>
        );
    }
}

export class Dropdown extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: props.value?props.value:this.props.data.defaultValue===undefined || this.props.data.defaultValue===""?"":this.props.data.defaultValue,
        };
    }
    componentWillReceiveProps(nextprops) {
        this.setState({
            value: nextprops.value
        });
    }
    render() {
        let props = {};
        props.name = this.props.data.field_name;
        props.value=this.state.value;
        props.creatable = this.props.data.creatable;
        props.clearable = this.props.data.clearable;
        props.multi = this.props.data.multiple;
        props.options = []
        if(this.props.options && this.props.options.length >0){
            let option = this.props.options;
            for(let i=0;i<option.length;i++)
            {
                if(option[i].label!="")
                {
                    props.options.push(option[i]);
                }
            }

        }
        if(this.props.data.options && this.props.data.options.length >0){
            let option = this.props.data.options;
            for(let j=0;j<option.length;j++)
            {
                if(option[j].label!="")
                {
                    props.options.push(option[j]);
                }
            }
        }
        props.disabled=false;
        if (this.props.read_only) {
            props.disabled = true;
        }

        let baseClasses = getElementsClass(this.props.data);

        return (
            <div className={baseClasses} id={"div_form_item_"+this.props.data.field_name}>
                <HeaderBarPanel {...this.props} />

                <InlineLayout inline={this.props.data.inline}  compWidth={this.props.data.compWidth}
                              labelWidth={this.props.data.labelWidth} inputWidth={this.props.data.inputWidth}
                              label={ <label className={(!this.props.data.inline ? "form-label" : "")+isRequired(this.props)}>
                    <span dangerouslySetInnerHTML={{__html: myxss.process(this.props.data.label)}}/>
                </label>} >
                    <div style={this.props.data.inline ? {display: 'inline-flex',width:'100%',textAlign:"left"} : {}}>
                        <SelectWidget {...props}
                            onClick={() => {
                                if (this.props.data.supportJS && this.props.data.hasOwnProperty('onClickStr')
                                    && !CommonUtil.isEmpty(this.props.data.onClickStr)) {
                                    eval(this.props.data.onClickStr)
                                }
                            }} onChange={(e)=>{
                                    this.setState({value: e},()=>{
                                        let name = this.props.data.field_name;
                                        let value = this.state.value;
                                        this.props.handleChange({name,value},this.props.data)
                                    });
                                }}
                            onBlur={() => {
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
        this.state = {value: this.props.value !== undefined ? this.props.value : ""};
    }

    handleChange = (e) => {
        this.setState({value: e},()=>{
            let name = this.props.data.field_name;
            let value = this.state.value;
            this.props.handleChange({name,value},this.props.data)
        });
    };

    loadOptionsHandle = (input) => {
        let {loadOptionUrl, responseFeild, labelFeild, valueFeild,needAuthorization} = this.props.data;
        if(loadOptionUrl && !CommonUtil.isEmpty(loadOptionUrl)){
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
        }else {
            return new Promise((resolve, reject)=>{
                let options = this.props.options &&this.props.options.filter((option)=>{return option.label.indexOf(input)>=0 ||option.value.indexOf(input)>=0  })
                return resolve({ options: options })
            })
        }
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
        props.disabled=false;
        if (this.props.read_only) {
            props.disabled = true;
        }

        props.value = this.state.value;

        let baseClasses = getElementsClass(this.props.data);
        return (
            <div className={baseClasses} id={"div_form_item_"+this.props.data.field_name}>
                <HeaderBarPanel {...this.props} />
                <InlineLayout inline={this.props.data.inline} compWidth={this.props.data.compWidth}
                              labelWidth={this.props.data.labelWidth} inputWidth={this.props.data.inputWidth}
                              label={ <label className={(!this.props.data.inline ? "form-label" : "")+isRequired(this.props)}>
                    <span dangerouslySetInnerHTML={{__html: myxss.process(this.props.data.label)}}/>
                </label>} >
                    <div style={this.props.data.inline ? {display: 'inline-flex',width:"100%"} : {}}>
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
        this.state={
            value:props.value ?props.value:((this.props.data.defaultValue===undefined || this.props.data.defaultValue===""?[]:this.props.data.defaultValue))
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            value:nextProps.value ?nextProps.value:((nextProps.data.defaultValue===undefined || nextProps.data.defaultValue===""?[]:nextProps.data.defaultValue))
        })
    }

    onChange = (value)=>{
        let stateValue = this.state.value
        if(stateValue && stateValue.indexOf(value) >=0 ){
            stateValue = update(this.state.value,{$splice:[[stateValue.indexOf(value),1]]})
        }else{
            stateValue = update(this.state.value,{$push:[value]})
        }
        this.setState({
            value:stateValue
        },()=>{
            let name = this.props.data.field_name;
            this.props.handleChange({name,value:this.state.value},this.props.data)
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
            <div className={baseClasses} id={"div_form_item_"+this.props.data.field_name}>
                <HeaderBarPanel {...this.props} />
                <InlineLayout inline={this.props.data.inline} compWidth={this.props.data.compWidth}
                              labelWidth={this.props.data.labelWidth} inputWidth={this.props.data.inputWidth}
                              label={ <label className={(!this.props.data.inline ? "form-label" : "")+isRequired(this.props)}  style={this.props.data.inline ? {verticalAlign: 'top'} : {}}>
                    <span dangerouslySetInnerHTML={{__html: myxss.process(this.props.data.label)}}/>
                </label>} >
                    <div style={this.props.data.inline ? {display: 'inline-block',textAlign:'left'} : {}}>
                        <input name={this.props.data.field_name} type="hidden" value={this.state.value} />
                        {this.props.options && this.props.options.map((option,index) => {
                            let props = {};
                            props.name = self.props.data.field_name;
                            props.type = "checkbox"
                            props.value = option.value;
                            props.disabled=false;
                            if (self.props.read_only) {
                                props.disabled =true;
                            }
                            let this_key = 'previewcheckbox_' + props.name+index;
                            return (
                                <label className={classNames} key={this_key}>
                                    <input {...props} checked={this.state.value && this.state.value.indexOf(option.value)>=0} onClick={() => {
                                        this.onChange(option.value)
                                        if (this.props.data.supportJS && this.props.data.hasOwnProperty('onClickStr')
                                            && !CommonUtil.isEmpty(this.props.data.onClickStr)) {
                                            eval(this.props.data.onClickStr)
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
                        {this.props.data.options && this.props.data.options.map((option) => {
                            let this_key = 'preview_' + option.key;
                            let props = {};
                            props.name = self.props.data.field_name;// 'option_' + option.key;
                            props.type = "checkbox"
                            props.value = option.value;
                            props.disabled=false;
                            if (self.props.read_only) {
                                props.disabled =true;
                            }
                            return (
                                <label className={classNames} key={this_key}>
                                    <input {...props} checked={this.state.value && this.state.value.indexOf(option.value)>=0} onClick={() => {
                                        this.onChange(option.value)
                                        if (this.props.data.supportJS && this.props.data.hasOwnProperty('onClickStr')
                                            && !CommonUtil.isEmpty(this.props.data.onClickStr)) {
                                            eval(this.props.data.onClickStr)
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
        this.state={
            value:props.value?props.value:(this.props.data.defaultValue===undefined || this.props.data.defaultValue===""?"":this.props.data.defaultValue)
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            value:nextProps.value?nextProps.value:(nextProps.data.defaultValue===undefined || nextProps.data.defaultValue===""?"":nextProps.data.defaultValue)
        })
    }

    onChange = (value)=>{
        this.setState({
            value
        },()=>{
            let name = this.props.data.field_name;
            this.props.handleChange({name,value:this.state.value},this.props.data)
        })
    }
    render() {
        let self = this;
        let classNames = 'radio-label';
        if (this.props.data.optionInline) {
            classNames += ' option-inline';
        }

        let baseClasses = getElementsClass(this.props.data);

        return (
            <div className={baseClasses} id={"div_form_item_"+this.props.data.field_name}>
                <HeaderBarPanel {...this.props} />

                <InlineLayout inline={this.props.data.inline}  compWidth={this.props.data.compWidth}
                              labelWidth={this.props.data.labelWidth} inputWidth={this.props.data.inputWidth}
                              label={ <label className={(!this.props.data.inline ? "form-label" : "")+isRequired(this.props)}  style={this.props.data.inline ? {verticalAlign: 'top'} : {}}>
                    <span dangerouslySetInnerHTML={{__html: myxss.process(this.props.data.label)}}/>
                </label>} >
                    <div style={this.props.data.inline ? {display: 'inline-block',textAlign:'left'} : {}}>
                        {this.props.options && this.props.options.map((option,index) => {
                            let props = {};
                            props.name = self.props.data.field_name;
                            props.type = "radio"
                            props.value = option.value;
                            props.disabled=false;
                            if (self.props.read_only) {
                                props.disabled =true;
                            }
                            let this_key = 'preview_' + props.name+index;
                            return (
                                <label className={classNames} key={this_key} style={{whiteSpace:'nowrap'}}>
                                    <input {...props}  checked={this.state.value === option.value } onClick={() => {
                                        this.onChange(option.value)
                                        if (this.props.data.supportJS && this.props.data.hasOwnProperty('onClickStr')
                                            && !CommonUtil.isEmpty(this.props.data.onClickStr)) {
                                            eval(this.props.data.onClickStr)
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
                        {this.props.data.options && this.props.data.options.map((option) => {
                            let this_key = 'preview_' + option.key;
                            let props = {};
                            props.name = self.props.data.field_name;
                            props.type = "radio"
                            props.value = option.value;
                            props.disabled=false;
                            if (self.props.read_only) {
                                props.disabled = true;
                            }
                            return (
                                <label className={classNames} key={this_key} style={{whiteSpace:'nowrap'}}>
                                    <input {...props}  checked={this.state.value === option.value } onClick={() => {
                                        this.onChange(option.value)
                                        if (this.props.data.supportJS && this.props.data.hasOwnProperty('onClickStr')
                                            && !CommonUtil.isEmpty(this.props.data.onClickStr)) {
                                            eval(this.props.data.onClickStr)
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
                <HeaderBarPanel {...this.props} />
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
    render() {
        let props = {};
        props.name = this.props.data.field_name;
        props.ratingAmount = 5;
        props.rating = (this.props.value !== undefined && this.props.value.length) ? parseFloat(this.props.value, 10) : 0;


        let baseClasses = getElementsClass(this.props.data);

        return (
            <div className={baseClasses}>
                <HeaderBarPanel {...this.props} />

                <InlineLayout inline={this.props.data.inline}  compWidth={this.props.data.compWidth}
                              labelWidth={this.props.data.labelWidth} inputWidth={this.props.data.inputWidth}
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
                <HeaderBarPanel {...this.props} />
                <div className="form-group">
                    <a target="_blank" href={this.props.data.href}>
                        <span style={{color:'blue',textDecoration:'underline',cursor:'hand'}}
                            dangerouslySetInnerHTML={{__html: myxss.process(this.props.data.content)}}/>
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
                <HeaderBarPanel {...this.props} />
                <div className="form-group">
                    <a href={this.props.data.file_path}>
                        <span style={{color:'blue',cursor:'hand'}}
                            dangerouslySetInnerHTML={{__html: myxss.process(this.props.data.content)}}/>
                    </a>
                </div>
            </div>
        );
    }
}

export class DayMonYearPicker extends React.Component {
    constructor(props) {
        super(props);
        let value = props.value;
        let day ="", month ="", year ="";
        if(!CommonUtil.isEmpty(value)){
            let arr = value.split('/');
            if(arr.length === 3){
                day = arr[0];
                month = arr[1];
                year = arr[2];
            }
        }
        this.state={
            day,
            month,
            year
        }
    }

    handleFieldChange = (event, fieldName) => {
        let target = event.target ? event.target : event;
        let name = fieldName ? fieldName : target.name;
        let value = target.value;
        let newState = update(this.state, {
            [name]: {$set: value}
        });

        this.setState(newState,()=>{
            let newValue = !CommonUtil.isEmpty(this.state.month)&&!CommonUtil.isEmpty(this.state.day) &&!CommonUtil.isEmpty(this.state.year) ? (this.state.month+'/'+this.state.day+'/'+this.state.year) : '';
            if(!CommonUtil.isEmpty(newValue)){
                let name = this.props.data.field_name;
                this.props.handleChange({name,value:newValue},this.props.data);
            }
        })
    }

    getOptions = (begin, end) =>{
        let options = [];
        for(let i=begin; i<=end; i++){
            options.push({value:i,label:i});
        }
        return options;
    }

    render() {
        let minYear = this.props.data.minYear?parseInt(this.props.data.minYear,10):(new Date().getYear()+1900-80);
        let maxYear = this.props.data.maxYear?parseInt(this.props.data.maxYear,10):(new Date().getYear()+1900);
        if( maxYear < minYear ){
            maxYear = new Date().getYear()+1900;
        }
        if(maxYear < minYear){
            minYear = new Date().getYear()+1900-80;
        }
        let baseClasses = getElementsClass(this.props.data);
        let readOnly=this.props.data.readOnly || this.props.read_only?true:false;
        let value = !CommonUtil.isEmpty(this.state.month)&&!CommonUtil.isEmpty(this.state.day)&&!CommonUtil.isEmpty(this.state.year)?
                (this.state.month+'/'+this.state.day+'/'+this.state.year):'';
        return (
            <div className={baseClasses} id={"div_form_item_"+this.props.data.field_name}>
                <HeaderBarPanel {...this.props} />
                <InlineLayout inline={this.props.data.inline} compWidth={this.props.data.compWidth}
                              labelWidth={this.props.data.labelWidth} inputWidth={this.props.data.inputWidth}
                              label={ <label className={(!this.props.data.inline ? "form-label" : "")+isRequired(this.props)}  style={this.props.data.inline ? {verticalAlign: 'top'} : {}}>
                                  <span dangerouslySetInnerHTML={{__html: myxss.process(this.props.data.label)}}/>
                              </label>} >
                    <div style={this.props.data.inline ? {display: 'inline-block',textAlign:'left',width:"100%"} : {}}>
                        <input type="hidden" name={this.props.data.field_name} value={value}/>
                        <Col xs={4} style={{paddingLeft:"0px"}}><SelectWidget options={this.getOptions(1, 31)}
                                                  value={this.state.day}
                                                  onChange={(event)=>{this.handleFieldChange(event, "day");}}
                                                  clearable={false}
                                                  disabled={readOnly}
                                                  placeholder="Day"/></Col>
                        <Col xs={4} style={{paddingLeft:"0px"}}><SelectWidget options={this.getOptions(1, 12)}
                                                  value={this.state.month}
                                                  onChange={(event)=>{this.handleFieldChange(event, "month");}}
                                                  clearable={false}
                                                  disabled={readOnly}
                                                  placeholder="Month"/></Col>
                        <Col xs={4} style={{paddingLeft:"0px",paddingRight:"0px"}}><SelectWidget options={this.getOptions(minYear, maxYear)}
                                                  value={this.state.year}
                                                  onChange={(event)=>{this.handleFieldChange(event, "year");}}
                                                  clearable={false}
                                                  disabled={readOnly}
                                                  placeholder="Year"/></Col>
                    </div>
                </InlineLayout>
            </div>
        );
    }
}

export class UploadFile extends React.Component {
    handleFieldChange = (data) => {
        let value="";
        if(data===null || data==="null" || data.length<=0 || data===[])
        {
            value="";
        }
        else
        {
            value=data.length;
        }
        let name = this.props.data.field_name;
        this.props.handleChange({name,value},this.props.data);
    }
    render() {
        let baseClasses = getElementsClass(this.props.data);
        return (
            <div className={baseClasses} id={"div_form_item_"+this.props.data.field_name}>
                <HeaderBarPanel {...this.props} />
                <InlineLayout inline={this.props.data.inline} compWidth={this.props.data.compWidth}
                              labelWidth={this.props.data.labelWidth} inputWidth={this.props.data.inputWidth}
                              label={ <label className={(!this.props.data.inline ? "form-label" : "")+isRequired(this.props)} >
                    <span dangerouslySetInnerHTML={{__html: myxss.process(this.props.data.label)}}/>
                </label>} >
                    <div style={{textAlign:'left'}}>
                        <FineUploader {...this.props } {...this.props.data } addFileText={this.props.data.addFileText} onCloseCallback={(data)=>{this.handleFieldChange(data)}} isRequiredClassName={isRequired(this.props)} />
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
                <HeaderBarPanel {...this.props} />
                <InlineLayout inline={this.props.data.inline}  compWidth={this.props.data.compWidth}
                              labelWidth={this.props.data.labelWidth} inputWidth={this.props.data.inputWidth}
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

        props.defaultValue = this.props.defaultValue !== undefined ? parseInt(this.props.defaultValue, 10) : parseInt(this.props.data.defaultValue, 10);

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
                <HeaderBarPanel {...this.props} />
                <InlineLayout inline={this.props.data.inline}  compWidth={this.props.data.compWidth}
                              labelWidth={this.props.data.labelWidth} inputWidth={this.props.data.inputWidth}
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
FormElements.DayMonYearPicker = DayMonYearPicker;

export default FormElements;
