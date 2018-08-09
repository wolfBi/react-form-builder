import React from "react";
import PropTypes from "prop-types";
import Tabs from '../components/elements/Tabs';
import { isEmpty,deepClone } from "../utils/CommonUtil";
import ReactFormGenerator from '../component/ReactFormGenerator';
import HttpUtil from "../utils/HttpUtil";
import "../css/application.css";
import "../css/form-builder-form.css";
import "../css/form-builder.css";

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

export default class FormGeneratorView extends React.Component {
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
        let hasTabs = false;
        let { customForm } = this.state;
        if (customForm !== null && customForm !== undefined ) {
            if(typeof customForm ==='object' && customForm.constructor !== Array ){//has tabs
                hasTabs = true;
                for (var key in customForm) {
                    let value = customForm[key];
                    initCustomFormData.tabName=key
                    tabs.push(
                        <div name={key}>
                            <ReactFormGenerator
                                upload_path={this.props.uploadPath}
                                answer_data={{}}
                                token={this.props.token}
                                back_action={()=>{this.props.closeModal(false) }}
                                submitCallback={()=>{this.props.closeModal(true)}}
                                form_action="/customFormData/"
                                form_method="POST"
                                formData={initCustomFormData}
                                variables={[]}
                                data={ value }/>
                        </div>
                    )
                }
            }
        }
        return (<div>
            { hasTabs ? <Tabs>{tabs}</Tabs>
                :<ReactFormGenerator
                    upload_path={this.props.uploadPath}
                    answer_data={{}}
                    token={this.props.token}
                    back_action={()=>{this.props.closeModal(false) }}
                    submitCallback={()=>{this.props.closeModal(true)}}
                    form_action="/customFormData/"
                    form_method="POST"
                    formData={initCustomFormData}
                    variables={[]}
                    data={this.state.customForm}/>}
            </div>
        )
    }

    static defaultProps = {
        menu:"",
        hideHeader:false,
    }
    static propTypes = {
        menu: PropTypes.string,
        menuTitle:PropTypes.string,
        hideHeader:PropTypes.bool,
        submitter: PropTypes.object,
        token: PropTypes.object,
        showModel:PropTypes.bool,
        closeModal:PropTypes.func,
    }
}
