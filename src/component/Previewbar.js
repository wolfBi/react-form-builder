import React from "react";
import ReactFormGenerator from './ReactFormGenerator';
import { CustomerModal } from '../../Facilities';
import { deepClone } from "../../../utils/CommonUtil";

export default class Previewbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
            previewVisible: false,
            roPreviewVisible: false
        }
    }

    showPreview = () => {
        this.setState({
            previewVisible: true
        })
    }

    showRoPreview = () => {
        this.setState({
            roPreviewVisible: true
        })
    }

    closePreview = () => {
        this.setState({
            previewVisible: false,
            shortPreviewVisible: false,
            roPreviewVisible: false
        })
    }

    render() {
        var modalClass = 'preview-Modal';
        if (this.state.previewVisible) {
            modalClass += ' show';
        }

        var roModalClass = 'modal ro-modal';
        if (this.state.roPreviewVisible) {
            roModalClass += ' show';
        }
        let previewFormData = deepClone(this.props.formData);
        let previewData=deepClone(this.props.data);
        return (
            <div className="clearfix" style={{margin: '10px', width: '70%'}}>
                <h4 className="pull-left">Preview</h4>
                <button className="btn btn-primary pull-right" style={{marginRight: '10px'}}
                        onClick={this.showPreview}>Preview Form
                </button>
                <button className="btn btn-default pull-right" style={{marginRight: '10px'}}
                        onClick={this.showRoPreview}>Read Only Form
                </button>
                <CustomerModal bodyClass='' show={this.state.previewVisible} closeOpenModal={this.closePreview }
                   menuTitle={this.props.menuTitle} hideHeader={this.true} className={modalClass}
                   body={
                       <ReactFormGenerator
                           upload_path={this.props.uploadPath}
                           back_action={this.closePreview}
                           back_name="Cancel"
                           answer_data={{}} token={this.props.token}
                           action_name="Submit"
                           form_action=""
                           form_method="POST"
                           formData={ previewFormData }
                           variables={this.props.variables}
                           hide_actions={true}
                           data={previewData}/>
                   } />
                <CustomerModal bodyClass='' show={this.state.roPreviewVisible} closeOpenModal={this.closePreview }
                    menuTitle={this.props.menuTitle} hideHeader={this.true} className={roModalClass}
                    body={
                        <ReactFormGenerator
                            upload_path={this.props.uploadPath}
                            back_action={this.closePreview}
                            back_name="Cancel"
                            answer_data={{}} token={this.props.token}
                            action_name="Submit"
                            form_action=""
                            form_method="POST"
                            formData={ previewFormData }
                            read_only={true}
                            variables={this.props.variables}
                            hide_actions={true} data={previewData}/>
                } />
            </div>
        );
    }

}
