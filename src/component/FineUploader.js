import React, { Component } from 'react';
import PropTypes from "prop-types";
import { Col } from "react-bootstrap";
import Dropzone from 'react-fine-uploader/dropzone';
import FileInput from 'react-fine-uploader/file-input';
import Filename from 'react-fine-uploader/filename';
import Filesize from 'react-fine-uploader/filesize';
import Filestatus from 'react-fine-uploader/status';
import FileDelete from 'react-fine-uploader/delete-button';
import FileRetry from 'react-fine-uploader/retry-button';
import FileCancel from 'react-fine-uploader/cancel-button';
import FineUploaderTraditional from 'fine-uploader-wrappers';
import CommonUtils from "../CommonUtils";
import HeaderBar from '../HeaderBar';

const isFileGone = status => {
    return [
            'canceled',
            'deleted',
        ].indexOf(status) >= 0
};
export default class FileUploader extends Component{
    constructor(props){
        super(props);
        this.state = {
            modalIsOpen: false,
            uploading: false,
            completeFiles:[],
            emptyFiles:[],
            submittedFiles: [],
            completeFilesInfo:[],
            errorMsg:'',
            uploader:this.initUploader(props)
        };
    }
    componentDidMount(){
        this.state.uploader.on('statusChange', (id, oldStatus, newStatus) => {
            if (newStatus === 'submitted') {
                const _submittedFiles = this.state.submittedFiles;
                _submittedFiles.push(id);
                const _emptyFiles = this.state.emptyFiles;
                _emptyFiles.push(id);
                this.setState({ submittedFiles: _submittedFiles, emptyFiles: _emptyFiles, uploading: true });
            }else if (isFileGone(newStatus)) {
                const submittedFiles = this.state.submittedFiles;
                const indexToRemoveSubmit = submittedFiles.indexOf(id);
                if(indexToRemoveSubmit !==undefined){
                    submittedFiles.splice(indexToRemoveSubmit, 1);
                }
                const emptyFiles = this.state.emptyFiles;
                const indexToRemoveEmpty = emptyFiles.indexOf(id);
                if(indexToRemoveEmpty !==undefined){
                    emptyFiles.splice(indexToRemoveEmpty, 1);
                }
                const completeFiles = this.state.completeFiles;
                const indexToRemoveCom = completeFiles.indexOf(id);
                if(indexToRemoveCom !==undefined){
                    completeFiles.splice(indexToRemoveCom, 1);
                }
                this.setState({ submittedFiles,emptyFiles,completeFiles });
            }
        });
    }

    componentWillReceiveProps(nextprops){
        let  {completeFiles, emptyFiles, submittedFiles, completeFilesInfo } = this.state;
        if( nextprops.clearAttachs ){
            completeFiles=[];
            emptyFiles=[];
            submittedFiles= [];
            completeFilesInfo=[];
        }
        this.setState({
            completeFiles,
            emptyFiles,
            submittedFiles,completeFilesInfo,
            uploader : this.initUploader(nextprops)
        })

    }
    initUploader = (props)=>{
        return new FineUploaderTraditional({
            options: {
                debug: window.__DEV__,
                request: {
                    endpoint: props.url,
                },
                cors:{
                    allowXdr: true,
                    expected:true,
                    sendCredentials:true
                },
                deleteFile: {
                    enabled: !CommonUtils.isEmpty(props.deleteUrl),
                    endpoint: props.deleteUrl,
                    method:props.method
                },
                form:{
                    autoUpload: this.props.autoUpload || false,
                },
                autoUpload: this.props.autoUpload || false,
                callbacks: {
                    onAllComplete: (status) => {
                        this.setState({
                            modalIsOpen: false,
                            uploading:false,
                            emptyFiles:[]
                        });
                        if(this.props.onAllCompleteCallback!==undefined){
                            this.props.onAllCompleteCallback();
                        }
                    },
                    onComplete: (id, name,response) => {
                        if(response.success){
                            const completeFiles = this.state.completeFiles;
                            completeFiles.push(id);
                            const completeFilesInfo = this.state.completeFilesInfo;
                            completeFilesInfo.push(response);
                            this.setState({ completeFiles,completeFilesInfo });
                            if(this.props.onCloseCallback!==undefined){
                                this.props.onCloseCallback(response);
                            }
                        }
                    },
                    onError: (id, name, reason, maybeXhrOrXdr)=> {
                        this.setState({ errorMsg:reason });
                    }
                },
                validation:{
                    allowedExtensions: props.allowedExtensions,
                    sizeLimit: props.sizeLimit,
                    itemLimit: props.itemLimit,
                    allowEmpty:false
                }
            }
        });
    }
    addFileClick=(event)=>{
        this.setState({
            modalIsOpen: true,
            errorMsg:''
        });
    }
    closeModal=(event)=>{
        this.setState({
            modalIsOpen: false,
            emptyFiles:[],
            errorMsg:''
        });
    }

    render(){
        let modalDialog;
        if (this.state.modalIsOpen) {
            let dropFileSection;
            if (!this.state.uploading){
                dropFileSection = <span key='DropText' className='dropIcon' >Drop Files Here</span>
            } else {
                dropFileSection =
                    <div id='dropzoneIn' key='dropzoneIn'>
                        {this.state.emptyFiles.map(id => (
                            <ul key={id} className='qq-upload-list'>
                                <li>
                                    <div className="qq-upload-container">
                                        <div className="qq-upload-spinner left"></div>
                                        <div className="qq-upload-file left show-ellipsis">
                                            <Filename id={id} uploader={this.state.uploader}/>
                                        </div>
                                        <div className="qq-upload-size left">
                                            <Filestatus id={id} uploader={this.state.uploader}/>
                                            <Filesize id={id} uploader={this.state.uploader}/>
                                        </div>
                                        <div className="qq-upload-buttons right">
                                            <FileRetry id={id} className="qq-upload-retry button green extra-small right" uploader={this.state.uploader} />
                                            <FileCancel id={id} className="qq-upload-retry button extra-small right" uploader={this.state.uploader}/>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        ))}
                    </div>
            }
            console.log(dropFileSection);
            modalDialog =
                <div className={'right_section'+(this.props.data.dropable?'Drop':'')}>
                    <div>
                        <div>
                            <FileInput className="file_input" multiple={this.props.data.multiple} accept={this.props.data.accept} uploader={this.state.uploader}>
                                <span className="button blue qq-upload-choose">Browse</span>
                            </FileInput>
                        </div>
                      <a className='close_button right' onClick={this.closeModal} >
                      </a>
                        <div style={{color:'red'}}>{this.state.errorMsg}</div>
                    </div>
                    {this.props.data.dropable===false?
                        null:
                        <div>
                            <Dropzone multiple={this.props.data.multiple} accept={this.props.data.accept}
                               className="qq-uploader" uploader={this.state.uploader}>
                              {dropFileSection}
                            </Dropzone>
                        </div>
                    }
                </div>
        }
        let form = this.props.data.needForm && this.props.data.formData && !CommonUtils.isEmptyObject(this.props.data.formData)? <div disabled>
            <form action='' id="qq-form" >
                { Object.keys(this.props.data.formData).map((key)=>{
                    return <input type="hidden" name={key} value={ this.props.data.formData[key] }/>
                })}
            </form>
        </div>:false;
        let filesListDiv = !this.props.data.hiddenFilesListDiv ?
            <div className="clearfix">
                <Col xs={4} >
                    <span className={"file-attachment btn btn-info"} onClick={this.addFileClick}>{this.props.data.addFileText }{form}</span>
                    { modalDialog }
                </Col>
                <Col id='dropzoneOut' xs={8} className="padding0Px " style={{marginTop:'5px'}}>
                    {this.state.submittedFiles.map(id => (
                        <div className="attachments-list" key={id}>
                            <div className="attachment editable">
                                <span className="attachment-file attachment-list-item clearfix"  target="_blank">
                                    <div className="clearfix" >
                                        <Col md={5} className="underline padding0Px">
                                            <Filename id={id} uploader={this.state.uploader} />
                                        </Col>
                                        <Col md={6} className="padding0Px ">
                                            <FileRetry id={id} className="qq-upload-retry button green extra-small right" uploader={this.state.uploader} />
                                            <FileCancel id={id} className="qq-upload-cancel button extra-small right" uploader={this.state.uploader}/>
                                            <FileDelete id={id} className="transparent-button right" children={<span className="inline_cancel right"></span>} uploader={this.state.uploader} />
                                        </Col>
                                    </div>
                                </span>
                            </div>
                        </div>
                    ))}
                </Col>
            </div>
            :
            <span >
                <span className="file-attachment btn btn-info	" onClick={this.addFileClick}>{this.props.data.addFileText}{form}</span>
                { modalDialog }
            </span>
        let renderReturn =
            this.props.data.directlyUpload ?<span className="file-attachment btn btn-info	" onClick={()=>{
                let directlyUploadFileInput = document.getElementById(this.props.data.directlyUploadFileInputID);
                directlyUploadFileInput.click();
            }}>
                {this.props.data.addFileText}
                <div display style={{display:'none'}}>
                    {form}
                    <FileInput className="file_input" style={{display:'none'}} id={this.props.data.directlyUploadFileInputID} multiple={this.props.data.multiple?true:false} accept={this.props.accept} uploader={this.state.uploader}>
                    </FileInput>
                </div>
            </span>
            : <span >{filesListDiv}</span>
      let baseClasses = CommonUtils.getElementsClass(this.props.data);
        return (
          <div className={baseClasses}>
            { !this.props.data.mutable &&
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
                <input type="hidden" name={this.props.data.field_name } value={JSON.stringify(this.state.completeFilesInfo)}/>
              </label>

              <div className="image-upload-container">
                {renderReturn}
              </div>
            </div>
          </div>
       );
    }
    static defaultProps = {
      method:"POST",
      data:{
        directlyUploadFileInputID:"directlyUploadFileInput",
        allowedExtensions:[],
        addFileText : 'Add File',
        itemLimit:20,
        sizeLimit:20*1024*1024*1024,
        hiddenFilesListDiv: false,
        clearAttachs: false,
        multiple: false,
        dropable: true,
        autoUpload: true,
        directlyUpload: false,
        needForm: false,
      }
    }
    static propTypes = {
        deleteUrl: PropTypes.string,
        url: PropTypes.string,
        method: PropTypes.string,
        data:{
          directlyUploadFileInputID: PropTypes.string,
          allowedExtensions: PropTypes.array,
          itemLimit: PropTypes.number,
          sizeLimit: PropTypes.number,
          hiddenFilesListDiv: PropTypes.bool,
          clearAttachs: PropTypes.bool,
          multiple: PropTypes.bool,
          dropable: PropTypes.bool,
          autoUpload: PropTypes.bool,
          directlyUpload: PropTypes.bool,
          needForm: PropTypes.bool,
          formData: PropTypes.object,
          accept: PropTypes.object,
          addFileText: PropTypes.any,
          onCloseCallback: PropTypes.func,
          onAllCompleteCallback: PropTypes.func,
        }
    }
}