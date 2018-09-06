import React from "react";
import PropTypes from "prop-types";
import { Modal, Button, Tabs, Tab, Col, Row } from "react-bootstrap";
import update from 'immutability-helper';
import Previewbar from '../component/Previewbar';
import FormBuilders from "../component/index";
import * as CommonUtil from "../../../utils/CommonUtil";
import HttpUtil from "../../../utils/HttpUtil";
import "../css/application.css";
import "../css/form-builder-form.css";
import "../css/form-builder.css";
import * as FA from "react-icons/lib/fa";

const initCustomForm = {
    uniqueId: '',
    parentId: '',
    menu: '',
    formBody: '[]',
    createdOn: new Date(),
    createdBy: '',
    updatedOn: new Date(),
    updatedBy: '',
}
export default class FormBuilderView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            menu: '',
            customForm: initCustomForm,
            data: [],
            tabData:{},
            formRelatedData:{},
            selectedTab:'Default',
            selectedTabRelatedTable:'',
            token:props.token,
            showDeleteTabModal:false,
            showAddTabModal:false,
            showEditTabModal:false,
            showSaveSuccessModal:false,
            tabErrorMsg:"",
        }
    }
    componentDidMount(){
        this.setState({
            menu: this.props.menu,
            token:this.props.token
        }, () => {
            if (!CommonUtil.isEmpty(this.state.menu)) {
                this.load(this.state.menu)
            }
        })
    }

    componentWillReceiveProps(nextProps) {
        let premenu = this.state.menu
        this.setState({
            menu: nextProps.menu,
        }, () => {
            if (!CommonUtil.isEmpty(this.state.menu) && premenu !== this.state.menu) {
                this.load(this.state.menu)
            }
        })
    }

    load = (menuid) => {
        let url = "/facilities/customForm/" + menuid;
        HttpUtil.get(url, {}, this.props.dispatch).then((res) => {
            if (res.status === 1 || res.status === '1') {
                let customForm = res.data;
                let formBody = CommonUtil.isEmpty(customForm.formBody) ? [] :JSON.parse(customForm.formBody);
                let formRelatedData = CommonUtil.isEmpty(customForm.formRelatedData) ? {} :JSON.parse(customForm.formRelatedData);
                let tabData={};
                let data = formBody;
                let selectedTab = 'Default';

                if(typeof formBody ==='object' && formBody.constructor !== Array ){
                    tabData = formBody;
                    for (var key in formBody) {
                        let value = formBody[key];
                        data = value;
                        selectedTab = key;
                        break;
                    }
                }
                let selectedTabRelatedTable="";
                if(!CommonUtil.isEmpty(formRelatedData) && formRelatedData.hasOwnProperty(selectedTab)){
                    selectedTabRelatedTable = formRelatedData[selectedTab].relatedTable;
                }
                this.setState({
                    customForm,
                    data,
                    tabData,
                    formRelatedData,
                    selectedTabRelatedTable,
                    selectedTab
                });
            } else {
                console.log(res.message)
            }
        })
    }

    saveData = (data) => {
        let { selectedTab } = this.state;
        if(CommonUtil.isEmpty(selectedTab)){
            this.setState({
                data
            })
        }else{
            let tabData = this.state.tabData;
            tabData[selectedTab]=data;
            this.setState({
                data,
                tabData
            })
        }
    }
    createElement = (elementItem) => {
        let data = CommonUtil.deepClone(this.state.data);
        data = update(data, {$push: [elementItem]})
        this.saveData(data);
    }
    deleteElement = (elementItem) => {
        let data = CommonUtil.deepClone(this.state.data);
        data = update(data, {$splice: [[elementItem, 1]]});
        this.saveData(data);
    }

    saveForm = () => {
        let form = this.state.customForm;
        form.menu=this.state.menu;
        form.updatedBy = this.props.submitter&&this.props.submitter.requestorName
        if (CommonUtil.isEmpty(form.createdBy)) {
            form.createdBy = this.props.submitter&&this.props.submitter.requestorName
        }
        if(!CommonUtil.isEmpty(this.state.tabData)){
            let tabData = this.state.tabData;
            tabData[this.state.selectedTab]=this.state.data;
            let formBody = JSON.stringify(tabData);
            form.formBody = formBody;
        }else if (this.state.data && this.state.data.length > 0) {
            let formBody = JSON.stringify(this.state.data);
            form.formBody = formBody;
        }
        if(!CommonUtil.isEmpty(this.state.formRelatedData)) {
            let formRelatedData = JSON.stringify(this.state.formRelatedData);
            form.formRelatedData = formRelatedData;
        }
        let saveUrl = "/facilities/customForm";
        HttpUtil.post(saveUrl, form, this.props.dispatch).then((res) => {
            if (res.status === 1 || res.status === '1') {
                this.setState({
                    menu: '',
                    customForm: initCustomForm,
                    data: [],
                    showSaveSuccessModal:true
                })
                this.props.closeModal();
            } else {
                console.log(res.message)
            }
        })
    }

    handleSelect=(selectedTab)=> {
        if(!CommonUtil.isEmpty(this.state.tabData)){
            let data = this.state.tabData[selectedTab];
            this.setState({ data,selectedTab });
        }else{
            this.setState({ selectedTab });
        }
        let selectedTabRelatedTable = CommonUtil.isEmpty(this.state.formRelatedData[selectedTab])?"" :this.state.formRelatedData[selectedTab].relatedTable;
        this.setState({ selectedTabRelatedTable });
    }
    addTab =()=>{
        let {tabData,data, newTab,formRelatedData } = this.state;
        if(!CommonUtil.isEmpty(tabData[newTab]))
        {
            this.setState({tabErrorMsg:"The tab name already exists."});
            return;
        }
        else
        {
            this.state.tabErrorMsg="";
        }
        if(CommonUtil.isEmpty(tabData)){
            tabData["Default"]=data;
        }
        tabData[newTab]=[];
        formRelatedData[newTab]={};
        data = tabData[newTab];
        this.setState({
            data,
            tabData,
            selectedTab:newTab,
            showAddTabModal:false,
            newTab:'',
            formRelatedData,
            selectedTabRelatedTable:''
        })
    }
    updateTab = ()=>{
        let newTabData = {};
        let newFormRelatedData = {};
        let { tabData, data,editTab, newTab,formRelatedData } = this.state;
        if(!CommonUtil.isEmpty(tabData[newTab]) && editTab!=newTab)
        {
            this.setState({tabErrorMsg:"The tab name already exists."});
            return;
        }
        else
        {
            this.state.tabErrorMsg="";
        }
        for (let key in tabData) {
            if(key === editTab){
                newTabData[newTab]=data;
            }else{
                newTabData[key]=tabData[key];
            }
        }
        for (let key in formRelatedData) {
            if(key === editTab){
                newFormRelatedData[newTab]=formRelatedData[editTab];
            }else{
                newFormRelatedData[key]=formRelatedData[key];
            }
        }
        this.setState({
            tabData:newTabData,
            selectedTab:newTab,
            showEditTabModal:false,
            editTab:'',
            newTab:'',
            formRelatedData:newFormRelatedData
        })
    }
    toggleDeleteTabModal = ()=>{
        this.setState({
            showDeleteTabModal:!this.state.showDeleteTabModal
        })
    }
    toggleSaveSuccessModal =()=>{
        this.setState({
            showSaveSuccessModal:!this.state.showSaveSuccessModal
        })
    }
    deleteTab = ()=>{
        let { tabData, editTab,formRelatedData,selectedTabRelatedTable } = this.state;
        delete tabData[editTab];
        delete formRelatedData[editTab];
        let data = [];
        let selectedTab = "";
        for (let key in tabData) {
            let value = tabData[key];
            data = value;
            selectedTab = key;
            break;
        }
        for (let key in formRelatedData) {
            selectedTabRelatedTable = formRelatedData[selectedTab].relatedTable;
            break;
        }
        this.setState({
            showDeleteTabModal:false,
            tabData,
            formRelatedData,
            data,
            selectedTab,
            editTab:'',
            newTab:'',
            selectedTabRelatedTable,
            showEditTabModal:false
        })
    }
    render() {
        let uploadPath = global['SERVER_URL'].replace("/rest", "") +"/facilities/uploadAttach?method=upload&requestType=CustomForm&mainId="+this.state.menu

        let tabs=[];
        let tabNum=0;
        if (!CommonUtil.isEmpty(this.state.tabData)) {
            tabs=[];
            for (let key in this.state.tabData) {
                tabNum=tabNum+1;
            }
        }

        if (!CommonUtil.isEmpty(this.state.tabData)) {
            tabs=[];
            if(tabNum===1)
            {
                for (var key in this.state.tabData) {
                    let value = this.state.tabData[key];
                    tabs.push(
                        <FormBuilders.ReactFormBuilder key="tab_first_default" variables={[]}
                                                       upload_path={uploadPath}
                                                       data={ value } token={this.state.token}
                                                       save={ this.saveForm }  saveData = { this.saveData }
                                                       createElement={ this.createElement }  deleteElement={ this.deleteElement }
                                                       {...this.props}
                        />
                    )
                }
            }
            else
            {
                let index=1;
                for (let key in this.state.tabData) {
                    let value = this.state.tabData[key];
                    let tabKey="Tab_"+key+"_"+index;
                    tabs.push(
                        <Tab key={tabKey} eventKey={key} title={key}>
                            <FormBuilders.ReactFormBuilder variables={[]}
                                                           upload_path={uploadPath}
                                                           data={ value } token={this.state.token}
                                                           save={ this.saveForm }  saveData = { this.saveData }
                                                           createElement={ this.createElement }  deleteElement={ this.deleteElement }
                                                           {...this.props}
                            />
                        </Tab>
                    )
                    index=index+1;
                }
            }

        }
        else
        {
            tabs.push(<FormBuilders.ReactFormBuilder key="tab_default" variables={[]}
                                           upload_path={uploadPath}
                                           data={ this.state.data } token={this.state.token}
                                           save={ this.saveForm }  saveData = { this.saveData }
                                           createElement={ this.createElement }  deleteElement={ this.deleteElement }
                                           {...this.props}
            />)
        }

        return (
            <Modal show={ this.props.showModel } onHide={this.props.closeModal }
                   bsSize="large" aria-labelledby="contained-modal-title-lg" backdrop="static"
                   dialogClassName="modal90PerWidth">
                <Modal.Body >
                    <Previewbar variables={[]} data={ this.state.data } token={this.state.token} menuTitle={this.props.menuTitle}
                                upload_path={uploadPath} formData={ this.state.customForm } {...this.props}/>
                    <div>
                        <Row>
                            <Col xs={2} className="text-left" >
                                <Button style={{margin:"5px"}} title="Add Tab" onClick={() => {
                                    this.setState({
                                        showAddTabModal: true,
                                        editTab:"",
                                        newTab:""
                                    })}}><FA.FaPlus size={25} color="#000000"/></Button>
                                <Button style={{margin:"5px"}} title="Edit Tab" className={tabNum===1?"hidden":""} onClick={() => {
                                    this.setState({
                                        showEditTabModal: true,
                                        editTab:this.state.selectedTab,
                                        newTab:this.state.selectedTab
                                    })}}><FA.FaEdit size={25} color="#000000"/></Button>
                            </Col>
                            <Col xs={5} className="text-left"><label>Related Table:</label><input style={{margin:'6px'}} type="text" value={this.state.selectedTabRelatedTable} onChange={(e)=>{
                                let target = e ? e.target:e;
                                let val = target.value;
                                let formRelatedData=this.state.formRelatedData;
                                let tabRelatedData=CommonUtil.isEmpty(formRelatedData[this.state.selectedTab])?{}:formRelatedData[this.state.selectedTab];
                                formRelatedData[this.state.selectedTab] = update(tabRelatedData, {"relatedTable":{$set: val}});
                                this.setState({
                                    formRelatedData,
                                     selectedTabRelatedTable:val
                                })
                            }}/> </Col>
                        </Row>

                    </div>
                    <div>
                        <Tabs activeKey={this.state.selectedTab}  onSelect={this.handleSelect} id="controlled-tab-example" >
                            { tabs }
                        </Tabs>
                    </div>

                    <Modal show={ this.state.showSaveSuccessModal } onHide={this.toggleSaveSuccessModal }
                           className="deleteSectionModal" aria-labelledby="contained-modal-title" backdrop="static">
                        <Modal.Body>
                            <div style={{fontSize: "larger", marginBottom: "20px", textAlign:"center"}}>
                                Save success!
                            </div>
                            <div className="operationDiv">
                                <button className="btn" onClick={ this.toggleSaveSuccessModal }>Ok</button>
                            </div>
                        </Modal.Body>
                    </Modal>

                    <Modal show={ this.state.showDeleteTabModal } onHide={this.toggleDeleteTabModal }
                           className="deleteSectionModal" aria-labelledby="contained-modal-title" backdrop="static">
                        <Modal.Body>
                            <div style={{fontSize: "larger", marginBottom: "20px", textAlign:"center"}}>
                                Are you sure to delete the {this.state.editTab } tab ?
                            </div>
                            <div className="operationDiv">
                                <button className="btn" onClick={ this.deleteTab }>Yes</button>
                                <button className="btn" onClick={ this.toggleDeleteTabModal }>No</button>
                            </div>
                        </Modal.Body>
                    </Modal>

                    <Modal show={this.state.showAddTabModal} onHide={() => {this.setState({showAddTabModal: false,tabErrorMsg:""})}} aria-labelledby="contained-modal-title" backdrop="static">
                        <Modal.Header closeButton>
                            <div>Add Tab</div>
                        </Modal.Header>
                        <Modal.Body>
                            <div style={{height:'100px',padding:'20px'}}>
                                <Row>
                                    <Col xs={3} className="text-right" ><label>Tab Name:</label></Col>
                                    <Col xs={5}><input type="text" value={this.state.newTab} onChange={(e)=>{
                                        let target = e ? e.target:e;
                                        let val = target.value;
                                        this.setState({
                                            newTab:val
                                        })
                                    }}/>
                                    </Col>
                                    <Col xs={3}> <Button bsStyle="primary" onClick={this.addTab}>Add</Button></Col>
                                </Row>
                                {
                                    CommonUtil.isEmpty(this.state.tabErrorMsg)?"":   <Row><Col xs={8} className="text-center" style={{color:"red",marginTop:"5px"}}>{this.state.tabErrorMsg}</Col></Row>
                                }
                            </div>
                        </Modal.Body>
                    </Modal>

                    <Modal show={this.state.showEditTabModal} onHide={() => {this.setState({showEditTabModal: false,tabErrorMsg:""})}} aria-labelledby="contained-modal-title" backdrop="static">
                        <Modal.Header closeButton>
                            <div>Edit Tab</div>
                        </Modal.Header>
                        <Modal.Body>
                            <div style={{height:'100px',padding:'20px'}}>
                                <Row>
                                    <Col xs={3} className="text-right" ><label>Tab Name:</label></Col>
                                    <Col xs={5}><input type="text" value={this.state.newTab} onChange={(e)=>{
                                        let target = e ? e.target:e;
                                        let val = target.value;
                                        this.setState({
                                            newTab:val
                                        })
                                    }}/>
                                    </Col>
                                    <Col xs={4}>
                                        <Button bsStyle="primary" onClick={this.updateTab}>Update</Button>
                                        <Button style={{marginLeft:"5px"}} type="button" onClick={this.deleteTab}>Delete</Button>
                                    </Col>
                                </Row>
                                {
                                    CommonUtil.isEmpty(this.state.tabErrorMsg)?"":   <Row><Col xs={8} className="text-center" style={{color:"red",marginTop:"5px"}}>{this.state.tabErrorMsg}</Col></Row>
                                }
                            </div>
                        </Modal.Body>
                    </Modal>
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle="primary" disabled={this.state.selectedTab === "Add Tab" || this.state.selectedTab === "Edit Tab" } onClick={ this.saveForm }>Save</Button>
                    <Button onClick={ this.props.closeModal }>Close</Button>
                </Modal.Footer>
            </Modal>
        )
    }
    static defaultProps = {
        menu:"",
    }
    static propTypes = {
        menu: PropTypes.string,
        submitter: PropTypes.object,
        token: PropTypes.object
    }
}
