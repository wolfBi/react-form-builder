import React from "react";
import PropTypes from "prop-types";
import Tabs from '../../../components/Tabs';
import { isEmpty, deepClone, guid } from "../../../utils/CommonUtil";
import ReactFormGenerator from '../component/ReactFormGenerator';
import HttpUtil from "../../../utils/HttpUtil";
import "../css/application.css";
import "../css/form-builder-form.css";
import "../css/form-builder.css";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import ObjectAssign from "object-assign";

let initCustomFormData ={
    uniqueId: '',
    parentId:'',
    formId:'',
    formBody:'',
    formData:'',
    createdOn: new Date(),
    createdBy: '',
    updatedOn: new Date(),
    updatedBy: '',
    requester:{}
}

class FormGeneratorView extends React.Component {
    constructor(props) {
        super(props);
        initCustomFormData.createdBy = props.submitter&&props.submitter.requestorName;
        initCustomFormData.updatedBy = props.submitter&&props.submitter.requestorName;
        initCustomFormData.requesterJson = JSON.stringify(props.submitter)
        this.state = {
            menu: '',
            customForm: []
        }
    }
    componentDidMount(){
        this.setState({
            menu:this.props.menu,
        },()=>{
            console.log(this.state.menu)
            if(!isEmpty(this.state.menu)){
                this.loadForm(this.state.menu)
            }
        })
    }
    componentWillReceiveProps(nextProps) {
        let premenu = deepClone(this.state.menu)
        initCustomFormData.uniqueId = guid();
        initCustomFormData.createdBy = nextProps.submitter&&nextProps.submitter.requestorName
        initCustomFormData.updatedBy = nextProps.submitter&&nextProps.submitter.requestorName
        initCustomFormData.requesterJson = JSON.stringify(nextProps.submitter)
        this.setState({
            menu:nextProps.menu,
        },()=>{
            if(!isEmpty(this.state.menu) && premenu !== this.state.menu){
                this.loadForm(this.state.menu)
            }
        })
    }
    loadForm = (menuid)=>{
        let url = "/facilities/customForm/"+menuid;
        HttpUtil.get(url,{menuid},this.props.dispatch).then((res)=>{
            if(res.status ===1 || res.status ==='1'){
                let customForm = JSON.parse(res.data.formBody)
                initCustomFormData.formId = menuid;
                initCustomFormData.formBody = res.data.formBody;
                this.setState({
                    customForm,
                });
            }else{
                console.log(res.message)
            }
        })
    }

    render() {
        let tabs = [];
        let tab = undefined;
        let hasTabs = false;
        let { customForm } = this.state;
        if (customForm !== null && customForm !== undefined ) {
            if(typeof customForm ==='object' && customForm.constructor !== Array ){//has tabs
                hasTabs = true;
                let i =1;
                for (var key in customForm) {
                    let value = customForm[key];
                    let customFormData = deepClone(initCustomFormData);
                    customFormData.uniqueId = guid();
                    customFormData.tabName=key
                    if(i ===1){
                        tab = <div >
                            <ReactFormGenerator
                                upload_path={global['SERVER_URL'].replace("/rest", "") +"/facilities/uploadAttach?method=upload&requestType="+key+"&mainId="+customFormData.uniqueId}
                                deleteUrl={global['SERVER_URL'].replace("/rest", "") + "/facilities/uploadAttach?method=delete&requestType="+key+"&mainId=" +customFormData.uniqueId}
                                form_action="/facilities/customFormData"
                                form_method="POST"
                                variables={[]} submitter={this.props.submitter}
                                token={this.props.token}
                                submitCallback={()=>{this.props.closeModal(true)}}
                                read_only={this.props.readOnly}
                                formData={customFormData}
                                dispatch={this.props.dispatch}
                                data={ value }/>
                        </div>;
                        hasTabs = false;
                    }else if(i >1){
                        hasTabs = true;
                    }
                    i++;
                    tabs.push(
                        <div name={key} key={key}>
                            <ReactFormGenerator
                                upload_path={global['SERVER_URL'].replace("/rest", "") +"/facilities/uploadAttach?method=upload&requestType="+key+"&mainId="+customFormData.uniqueId}
                                deleteUrl={global['SERVER_URL'].replace("/rest", "") + "/facilities/uploadAttach?method=delete&requestType="+key+"&mainId=" +customFormData.uniqueId}
                                form_action="/facilities/customFormData"
                                form_method="POST"
                                variables={[]}
                                token={this.props.token}
                                submitCallback={()=>{this.props.closeModal(true)}}
                                read_only={this.props.readOnly}
                                submitter={this.props.submitter}
                                formData={customFormData}
                                dispatch={this.props.dispatch}
                                data={ value }/>
                        </div>
                    )
                }
            }
        }
        if(hasTabs){
            return <Tabs>{tabs}</Tabs>
        }else{
            return <div>{tab}</div>
        }
    }

    static defaultProps = {
        menu:"",
        hideHeader:false,
        readOnly:false,
    }
    static propTypes = {
        menu: PropTypes.string,
        menuTitle:PropTypes.string,
        hideHeader:PropTypes.bool,
        readOnly:PropTypes.bool,
        submitter: PropTypes.object,
        token: PropTypes.object,
        showModel:PropTypes.bool,
        closeModal:PropTypes.func,
    }
}
const mapStateToProps = (state, ownProps) => {
    let {token} = state;
    return {token};
}
const mapDispatchToProps = (dispatch, ownProps) => {
    return bindActionCreators(ObjectAssign({}, {}, {dispatch}), dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(FormGeneratorView);