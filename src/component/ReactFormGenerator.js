/**
 * <Form />
 */

import React from 'react';
import { EventEmitter } from 'fbemitter';
import { Button } from "react-bootstrap";
import update from 'immutability-helper';
import FormValidator from './FormValidator';
import * as FormElements from './FormElements';
import HttpUtil from '../../../utils/HttpUtil';
import LogUtil from '../../../utils/LogUtil';
import * as CommonUtil from '../../../utils/CommonUtil';
import moment from 'moment';
import "../css/application.css";
import "../css/form-builder-form.css";
import "../css/form-builder.css";

export default class ReactFormGenerator extends React.Component {
    constructor(props) {
        super(props);
        this.emitter = new EventEmitter();
        this.state = {
            preData:props.data,
            data:props.data,
            postData:{},
            allFieldsMap:{},
            cascadeParent:{},
            cascadeFieldOptionMap:{},
            cascadeActionMap:{}
        }
    }

    componentDidMount(){
        let { data } = this.props;
        if(data && data.length >0){
            let postData = {}, allFieldsMap={},
                cascadeParent={}, cascadeFieldOptionMap={},cascadeActionMap={},newData=[];

            let  field_name, cascadeField,cascadeFieArr=[],cascadeActions=[];
            newData = data && data.map((element)=>{
                if(element.element !== 'Header' && element.element !== 'Label' && element.element !== 'Paragraph' && element.hasOwnProperty("field_name")){
                    field_name = element["field_name"];
                    postData[field_name] = "";
                    if(element.hasOwnProperty("defaultValue")) {
                        postData[field_name]= element["defaultValue"];
                    }else if(element.hasOwnProperty("defaultToday") && (element["defaultToday"] || element["defaultToday"]==="true")) {
                        postData[field_name]= moment().format('MM/DD/YYYY');
                    }else if(element.element ==='FMNO' && element.needDefault){
                        postData[field_name]= this.props.submitter?(this.props.submitter.firstName + ' ' + this.props.submitter.lastName+'/'+ this.props.submitter.FMNO):'';
                    }
                    allFieldsMap[field_name] = element;
                    if(element.hasOwnProperty("canCascadeOption") && element.canCascadeOption){
                        cascadeField = element["cascadeField"];
                        cascadeFieArr = cascadeField.split(',');
                        cascadeFieArr && cascadeFieArr.map((cField)=>{
                            cascadeParent[cField] = field_name
                        })
                        cascadeActions = element["cascadeActions"];
                        if(cascadeActions && cascadeActions.length >0){
                            cascadeActionMap[field_name]=cascadeActions;
                        }
                    }
                    if(element.hasOwnProperty("serverDictKey") && !CommonUtil.isEmpty(element.serverDictKey)){
                        cascadeFieldOptionMap[field_name] = [];
                    }
                    if(!element.hasOwnProperty("hidden") && !element.hidden){
                        newData.push(element);
                    }

                }
                return element;
            })

            this.setState({
                preData:data,
                data:newData,
                postData,
                allFieldsMap,
                cascadeParent,
                cascadeFieldOptionMap,
                cascadeActionMap
            },()=>{
                this.initOptions();
            })
        }
    }

    componentWillReceiveProps(nextProps){
        let { data } = nextProps;
        if(data && data.length >0){
            let postData = {}, allFieldsMap={},
                cascadeParent={}, cascadeFieldOptionMap={},cascadeActionMap={},newData=[];

            let  field_name, cascadeField,cascadeFieArr=[],cascadeActions=[];
            newData = data && data.map((element)=>{
                if(element.element !== 'Header' && element.element !== 'Label' && element.element !== 'Paragraph' && element.hasOwnProperty("field_name")){
                    field_name = element["field_name"];
                    if(!element.hasOwnProperty("hidden") && !element.hidden){
                        postData[field_name] = "";
                    }
                    allFieldsMap[field_name] = element;
                    if(element.hasOwnProperty("canCascadeOption") && element.canCascadeOption){
                        cascadeField = element["cascadeField"];
                        cascadeFieArr = cascadeField.split(',');
                        cascadeFieArr && cascadeFieArr.map((casField)=>{
                            cascadeParent[casField] = field_name
                        })
                        cascadeActions = element["cascadeActions"];
                        if(cascadeActions && cascadeActions.length >0){
                            cascadeActionMap[field_name]=cascadeActions;
                        }
                    }
                    if(element.hasOwnProperty("serverDictKey") && !CommonUtil.isEmpty(element.serverDictKey)){
                        cascadeFieldOptionMap[field_name] = [];
                    }
                }
                return element
            })

            this.setState({
                preData:data,
                data:newData,
                postData,
                allFieldsMap,
                cascadeParent,
                cascadeFieldOptionMap,
                cascadeActionMap
            },()=>{
                this.initOptions();
            })
        }
    }

    initOptions=()=>{
        let { allFieldsMap,cascadeFieldOptionMap } =this.state;
        let rootField = this.recursionCascadeRoot();
        for(let i = 0; i < rootField.length; i++ ){
            if(cascadeFieldOptionMap[rootField[i]] && cascadeFieldOptionMap[rootField[i]].length === 0){
                this.getOption(allFieldsMap[rootField[i]])
            }
        }
    }

    recursionCascadeRoot=()=>{
        let {cascadeParent,postData} =this.state;
        let rootField = []
        for(let sunField in cascadeParent){
            if(cascadeParent.hasOwnProperty(sunField)) {
                let akey = this.recursionCascade(cascadeParent[sunField]);
                if(!CommonUtil.isEmpty(postData[sunField])){
                    rootField.push(sunField)
                }
                rootField.push(...akey)
            }else{
                rootField.push(sunField)
            }
        }
        return rootField;
    }

    recursionCascade =(key ='')=>{
        let sunRootField = []
        let {cascadeParent,postData} =this.state;
        if(cascadeParent.hasOwnProperty(key)) {
            if(!CommonUtil.isEmpty(postData[key])){
                sunRootField.push(key)
            }
            let ssunRootField = this.recursionCascade(cascadeParent[key]);
            sunRootField.push(...ssunRootField)
        }else{
            sunRootField.push(key)
        }
        return sunRootField;
    }

    handleChange = (e,element) => {
        let name = element.field_name;
        let target = e.target ? e.target:e;
        let val = target.hasOwnProperty("value") ? target.value:target;
        if(element.element === 'AsyncDropdown' || element.element === 'Dropdown'){
            if(element.multiple){
                val = []
                for(let key in target){
                    val.push(target[key].value && target[key].value.value?target[key].value.value:"");
                }
            }else
            {
                val=target.value && target.value.value?target.value:"";
            }
        }
        let preVal = CommonUtil.deepClone(this.state.postData[name]);
        let newData = update(this.state.postData,{[name]:{$set:val }})
        this.setState({postData: newData},()=>{
            this.changeAfter(name,val,preVal,element);
            if (element && element.supportJS && element.hasOwnProperty('onChangeStr')
                && !CommonUtil.isEmpty(element.onChangeStr)) {
                let onChangeStr = element.onChangeStr;
                onChangeStr = onChangeStr.replace(/'name'/g, name);
                onChangeStr = onChangeStr.replace(/'value'/g, val);
                eval(onChangeStr)
            }
        });
    };

    changeAfter = (name,val,preVal,element)=>{
        if(val !== preVal){
            let { allFieldsMap, cascadeActionMap, data, postData } = this.state;
            let thisOptions = allFieldsMap[name];
            if(thisOptions && thisOptions.canCascadeOption && thisOptions.cascadeField && !CommonUtil.isEmpty(thisOptions.cascadeField)){
                let cascadeFieArr = thisOptions.cascadeField.split(',');
                cascadeFieArr && cascadeFieArr.map((cascadeField)=>{
                    let sonOption = allFieldsMap[cascadeField];
                    if(sonOption){
                        this.getOption(sonOption,element.multiple);
                    }
                })
            }
            let newData = data;
            let actions = cascadeActionMap[name];
            if(actions){
                let preActions = [];
                let localActions = [];
                actions&&actions.map((actionOptions)=>{
                    if(!CommonUtil.isEmpty(actionOptions.value)&&!CommonUtil.isEmpty(actionOptions.actionType)&&!CommonUtil.isEmpty(actionOptions.cascadeActionField)){
                        if(!CommonUtil.isEmpty(preVal) && preVal === actionOptions.value){
                            preActions.push(actionOptions);
                        }else if(!CommonUtil.isEmpty(val) && val === actionOptions.value){
                            localActions.push(actionOptions);
                        }
                    }
                })
                let field_name;
                preActions && preActions.map((actionOptions)=>{
                    let casArr = actionOptions.cascadeActionField.split(',');
                    newData = data && data.map((element)=>{
                            field_name = element["field_name"]
                            if(element.hasOwnProperty("field_name") && casArr.indexOf(field_name)>=0){
                                if(actionOptions.actionType === 'show'){
                                    element.hidden = true;
                                    delete postData[field_name];
                                }else if(actionOptions.actionType === 'hidden'){
                                    element.hidden = false;
                                    postData[field_name] = "";
                                }else if(actionOptions.actionType === 'required'){
                                    element.required = false;
                                }else if(actionOptions.actionType === 'value'){
                                    element.value = actionOptions.actionTypeValue;
                                    postData[field_name]="";
                                }
                            }
                            return element
                        })
                })
                localActions&&localActions.map((actionOptions)=>{
                    let casArr = actionOptions.cascadeActionField.split(',');
                    newData = data && data.map((element)=>{
                            field_name = element["field_name"]
                            if(element.hasOwnProperty("field_name") && casArr.indexOf(field_name)>=0){
                                if(actionOptions.actionType === 'show'){
                                    element.hidden = false;
                                    delete postData[field_name];
                                }else if(actionOptions.actionType === 'hidden'){
                                    element.hidden = true;
                                    delete postData[field_name];
                                }else if(actionOptions.actionType === 'required'){
                                    element.required = true;
                                }else if(actionOptions.actionType === 'value'){
                                    element.value = actionOptions.actionTypeValue;
                                    postData[field_name]=actionOptions.actionTypeValue
                                }
                            }
                            return element
                        })
                })
            }
            this.setState({
                data:newData,
                postData
            })
        }
    }

    loadOptionsHandle = (serverDictKey, parentValue,key ) => {
        let api_url = serverDictKey.startsWith("http")? (serverDictKey+parentValue):('/common/options/'+serverDictKey)
        return HttpUtil.get(api_url, {parentValue:parentValue},this.props.dispatch).then(json => {
            let items = json.data && json.data.map((item) => {
                    return {
                        "value": item.value,
                        "label": item.label
                    };
                });
            let cascadeFieldOptionMap = update(this.state.cascadeFieldOptionMap,{[key]:{$set:items }});
            this.setState({
                cascadeFieldOptionMap
            })
        })
    }

    getOption=(option,multiple = false)=>{
        let { postData, cascadeParent } = this.state;
        let serverDictKey = option.serverDictKey;
        if(!CommonUtil.isEmpty(serverDictKey)){
            let key = cascadeParent[option.field_name];
            let parentValue = "";
            if(key){
                parentValue = postData[key];
            }
            if(multiple){
                parentValue = parentValue[0];
            }
            if(parentValue === undefined){
                parentValue = "";
            }
            this.loadOptionsHandle(serverDictKey,parentValue,option.field_name)
        }
    }


    handleSubmit = (e) => {
        e.preventDefault();
        let { postData } = this.state;

        let data_items = this.state.data;
        data_items && data_items.forEach(item => {
            if (item.hasOwnProperty("field_name") ) {
                if(item.hidden){
                    delete postData[item.field_name];
                }else{
                    if(!postData.hasOwnProperty(item.field_name)){
                        postData[item.field_name] = "";
                    }else{
                        let val = postData[item.field_name]
                        if(val){
                            if(item.element === 'Checkboxes' || (item.element !== 'UploadFile' && item.multiple)){
                                postData[item.field_name] = val.join(',');
                            }
                        }
                    }
                }
            }
        });

        let errors = this.validateForm(postData);
        // Publish errors, if any.
        this.emitter.emit('formValidation', errors);
        // Only submit if there are no errors.
        if (errors.length < 1) {
            let formData = {};
            if(this.props.formData){
                formData =  this.props.formData;
                formData.formData =  JSON.stringify(postData);
                formData.formBody =  JSON.stringify(this.state.data);
            }else{
                formData = postData;
            }
            HttpUtil.post(this.props.form_action,formData,this.props.dispatch).then((responseData)=>{
                if(responseData){
                    LogUtil.info(responseData);
                }
                if(this.props.submitCallback){
                    this.props.submitCallback();
                }
            });
        }else {

        }
    }

    validateForm =(formData)=> {
        let errors = [];
        let data_items = this.state.data;

        data_items && data_items.forEach(item => {
            if (item.hasOwnProperty("field_name") ) {
                let invalid = false;
                if (!item.hidden && item.required) {
                    let val = formData[item.field_name]
                    if(val ==='' || val === null || val === undefined){
                        invalid = true;
                    }
                }
                if( invalid){
                    let label = item.label;
                    label =label.replace(/<div>/g,'').replace(/<\/div>/g,'');
                    errors.push(`${label} is required!`);
                }
            }
        });

        return errors;
    }


    getSimpleElement(item) {
        const Element = FormElements[item.element];
        if(Element){
            return (<Element key={`form_${item.id}`} mutable={true} data={item}/>);
        }
        return false;
    }

    getInputElement(item) {
        const Input = FormElements[item.element];
        if(Input){
            return (<Input handleChange={this.handleChange}
                           mutable={true} options={this.state.cascadeFieldOptionMap[item.field_name]}
                           key={`form_${item.id}`}
                           data={item}
                           read_only={this.props.read_only}
                           value={this.state.postData[item.field_name]} />);
        }
        return false;
    }

    render() {
        let data_items = this.state.data;
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
                case 'DayMonYearPicker':
                    return this.getInputElement(item);
                case 'Checkboxes':
                    return <FormElements.Checkboxes read_only={this.props.read_only}
                                    value={this.state.postData[item.field_name]}
                                    options={this.state.cascadeFieldOptionMap[item.field_name]}
                                    handleChange={this.handleChange} mutable={true}
                                    key={`form_${item.id}`} data={item} />
                case 'UploadFile':
                    return <FormElements.UploadFile url={this.props.upload_path} handleChange={this.handleChange} read_only={this.props.read_only}
                                    deleteUrl={this.props.deleteUrl} key={`form_${item.id}`} data={item} mutable={true} />
                case 'AsyncDropdown':
                    return <FormElements.AsyncDropdown handleChange={this.handleChange}
                                    options={this.state.cascadeFieldOptionMap[item.field_name]}
                                    value={this.state.postData[item.field_name]}
                                    token={this.props.token} read_only={this.props.read_only}
                                    key={`form_${item.id}`} data={item} mutable={true} />
                case 'Image':
                    return <FormElements.Image key={`form_${item.id}`} data={item}
                                    defaultValue={this.props.answer_data[item.field_name]} mutable={true} />
                case 'Download':
                    return <FormElements.Download key={`form_${item.id}`} data={item} mutable={true} />
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
                    </div>
                    <div style={{clear:"both", textAlign:"center"}} className="small_vertical_space">
                        { !this.props.hide_actions &&
                        <Button bsStyle="primary" style={{float:'none'}} onClick={this.handleSubmit} >{actionName}</Button>
                        } &nbsp;&nbsp;
                        { !this.props.hide_actions && this.props.back_action &&
                        <Button style={{float:'none'}} onClick={this.props.back_action} >{backName}</Button>
                        }
                    </div>
                </form>
            </div>
        )
    }
}

ReactFormGenerator.defaultProps = {validateForCorrectness: false};
