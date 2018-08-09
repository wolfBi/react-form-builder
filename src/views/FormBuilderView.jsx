import React from "react";
import PropTypes from "prop-types";
import { Modal, Button, Tabs, Tab, Col } from "react-bootstrap";
import update from 'immutability-helper';
import Previewbar from '../component/Previewbar';
import FormBuilders from "../component/index";
import * as CommonUtil from "../utils/CommonUtil";
import HttpUtil from "../utils/HttpUtil";
import "../css/application.css";
import "../css/form-builder-form.css";
import "../css/form-builder.css";

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
            selectedTab:'Default',
            token:props.token,
            showDeleteTabModal:false,
            showSaveSuccessModal:false
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
        let url = "/customForm/" + menuid;
        HttpUtil.get(url, {}, this.props.dispatch).then((res) => {
            if (res.status === 1 || res.status === '1') {
                let customForm = res.data;
                let formBody = CommonUtil.isEmpty(customForm.formBody) ? [] :JSON.parse(customForm.formBody);
                let tabData={};
                let data = formBody;
                let selectedTab = 'Default';
                if(typeof formBody ==='object' && formBody.constructor !== Array ){
                    tabData = formBody;
                    for (var key in formBody) {
                        let value = formBody;
                        data = value;
                        selectedTab = key;
                        break;
                    }
                }
                this.setState({
                    customForm,
                    data,
                    tabData,
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
        if("Add Tab"===selectedTab){
            this.setState({
                selectedTab,
                editTab:'',
                newTab:''
            });
        }else if("Edit Tab"===selectedTab){
            this.setState({
                selectedTab,
                editTab:this.state.selectedTab,
                newTab:this.state.selectedTab
            });
        }else if(!CommonUtil.isEmpty(this.state.tabData)){
            let data = this.state.tabData[selectedTab];
            this.setState({ data,selectedTab });
        }
    }
    addTab =()=>{
        let {tabData,data, newTab } = this.state;
        if(CommonUtil.isEmpty(tabData)){
            tabData["Default"]=data;
        }
        tabData[newTab]=[];
        this.setState({
            tabData,
            selectedTab:newTab,
            newTab:''
        })
    }
    updateTab = ()=>{
        let { tabData, data,editTab, newTab } = this.state;
        tabData[newTab]=data;
        delete tabData[editTab];
        this.setState({
            tabData,
            selectedTab:newTab,
            editTab:'',
            newTab:''
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
        let { tabData, editTab } = this.state;
        delete tabData[editTab];
        let data = "";
        let selectedTab = "";
        for (var key in tabData) {
            let value = "";
            data = value;
            selectedTab = key;
            break;
        }
        this.setState({
            showDeleteTabModal:false,
            tabData,
            data,
            selectedTab,
            editTab:'',
            newTab:''
        })
    }
    render() {
        let uploadPath = this.props.uploadPath

        let tabs=[];
        tabs.push(
            <Tab eventKey={"Default"} title={"Default"}>
                <FormBuilders.ReactFormBuilder variables={[]}
                    upload_path={uploadPath}
                    data={ this.state.data } token={this.state.token}
                    save={ this.saveForm }  saveData = { this.saveData }
                    createElement={ this.createElement }  deleteElement={ this.deleteElement }
                    {...this.props}
                />
            </Tab>
        )
        if (!CommonUtil.isEmpty(this.state.tabData)) {
            tabs=[];
            for (var key in this.state.tabData) {
                let value = this.state.tabData[key];
                tabs.push(
                    <Tab eventKey={key} title={key}>
                        <FormBuilders.ReactFormBuilder variables={[]}
                            upload_path={uploadPath}
                            data={ value } token={this.state.token}
                            save={ this.saveForm }  saveData = { this.saveData }
                            createElement={ this.createElement }  deleteElement={ this.deleteElement }
                            {...this.props}
                        />
                    </Tab>
                )
            }
        }
        tabs.push(
            <Tab eventKey={"Add Tab"} title="Add Tab">
                <div style={{height:'100px',padding:'20px'}}>
                    <Col xs={4} className="text-right" ><label>Tab Name:</label></Col>
                    <Col xs={8}><input type="text" value={this.state.newTab} onChange={(e)=>{
                        let target = e ? e.target:e;
                        let val = target.value;
                        this.setState({
                            newTab:val
                        })
                    }}/></Col>
                    <Col xs={8}><button type="button" onClick={this.addTab}>Add</button></Col>
                </div>
            </Tab>
        )
        tabs.push(
            <Tab eventKey={"Edit Tab"} title="Edit Tab">
                <div style={{height:'100px',padding:'20px'}}>
                    <Col xs={4} className="text-right" ><label>Tab Name:</label></Col>
                    <Col xs={8}><input type="text" value={this.state.newTab} onChange={(e)=>{
                        let target = e ? e.target:e;
                        let val = target.value;
                        this.setState({
                            newTab:val
                        })
                    }}/></Col>
                    <Col xs={8}>
                        <button type="button" onClick={this.updateTab}>Update</button>
                        <button type="button" onClick={this.deleteTab}>Delete</button>
                    </Col>
                </div>
            </Tab>
        )
        return (
            <Modal show={ this.props.showModel } onHide={this.props.closeModal }
                   bsSize="large" aria-labelledby="contained-modal-title-lg" backdrop="static"
                   dialogClassName="modal80PerWidth">
                <Modal.Body >
                    <Previewbar variables={[]} data={ this.state.data } token={this.state.token} menuTitle={this.props.menuTitle}
                        upload_path={uploadPath} formData={ this.state.customForm } {...this.props}/>
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
