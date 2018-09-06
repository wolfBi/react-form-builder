import React, {Component} from 'react';
import PropTypes from "prop-types";
import Dropzone from 'react-fine-uploader/dropzone';
import FileInput from 'react-fine-uploader/file-input';
import Filename from 'react-fine-uploader/filename';
import Filesize from 'react-fine-uploader/filesize';
import Filestatus from 'react-fine-uploader/status';
import FileDelete from 'react-fine-uploader/delete-button';
import FileRetry from 'react-fine-uploader/retry-button';
import FileCancel from 'react-fine-uploader/cancel-button';
import FineUploaderTraditional from 'fine-uploader-wrappers';
import * as CommonUtil from "../../../../utils/CommonUtil";
import '../../../../components/FileUploader.css';

const isFileGone = status => {
    return [
            'canceled',
            'deleted',
        ].indexOf(status) >= 0
};
export default class FileUploader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalIsOpen: false,
            uploading: false,
            completeFiles: [],
            emptyFiles: [],
            submittedFiles: [],
            completeFilesInfo: [],
            errorMsg: '',

        };
        this.uploader=this.initUploader(props);
    }

    componentDidMount() {
        this.uploader.on('statusChange', (id, oldStatus, newStatus) => {
            if (newStatus === 'submitted') {
                const _submittedFiles = this.state.submittedFiles;
                _submittedFiles.push(id);
                const _emptyFiles = this.state.emptyFiles;
                _emptyFiles.push(id);
                this.setState({submittedFiles: _submittedFiles, emptyFiles: _emptyFiles, uploading: true});
            } else if (isFileGone(newStatus)) {
                const submittedFiles = this.state.submittedFiles;
                const indexToRemoveSubmit = submittedFiles.indexOf(id);
                if (indexToRemoveSubmit !== undefined) {
                    submittedFiles.splice(indexToRemoveSubmit, 1);
                }
                const emptyFiles = this.state.emptyFiles;
                const indexToRemoveEmpty = emptyFiles.indexOf(id);
                if (indexToRemoveEmpty !== undefined) {
                    emptyFiles.splice(indexToRemoveEmpty, 1);
                }
                const completeFiles = this.state.completeFiles;
                const indexToRemoveCom = completeFiles.indexOf(id);
                if (indexToRemoveCom !== undefined) {
                    completeFiles.splice(indexToRemoveCom, 1);
                }

                const completeFilesInfo = this.state.completeFilesInfo;
                const indexToRemoveComInfo = completeFilesInfo.indexOf(id);
                if (indexToRemoveComInfo !== undefined) {
                    completeFilesInfo.splice(indexToRemoveComInfo, 1);
                }
                this.setState({submittedFiles, emptyFiles, completeFiles,completeFilesInfo});
                if (this.props.onCloseCallback !== undefined) {
                    this.props.onCloseCallback(completeFiles);
                }
            }
        });
    }

    componentWillReceiveProps(nextprops) {
        let {completeFiles, emptyFiles, submittedFiles, completeFilesInfo} = this.state;
        if (nextprops.clearAttachs) {
            completeFiles = [];
            emptyFiles = [];
            submittedFiles = [];
            completeFilesInfo = [];
        }
        this.setState({
            completeFiles,
            emptyFiles,
            submittedFiles, completeFilesInfo,
            uploader: this.initUploader(nextprops)
        })

    }

    initUploader = (props) => {
        return new FineUploaderTraditional({
            options: {
                debug: window.__DEV__,
                request: {
                    endpoint: props.url,
                },
                deleteFile: {
                    enabled: !CommonUtil.isEmpty(props.deleteUrl),
                    endpoint: props.deleteUrl,
                    method: props.method
                },
                form: {
                    autoUpload: this.props.autoUpload || false,
                },
                autoUpload: this.props.autoUpload || false,
                callbacks: {
                    onAllComplete: (status) => {
                        this.setState({
                            modalIsOpen: false,
                            uploading: false,
                            emptyFiles: []
                        });
                        if (this.props.onAllCompleteCallback !== undefined) {
                            this.props.onAllCompleteCallback();
                        }
                    },
                    onComplete: (id, name, response) => {
                        if (response.success) {
                            const completeFiles = this.state.completeFiles;
                            completeFiles.push(id);
                            const completeFilesInfo = this.state.completeFilesInfo;
                            let data = response.data
                            if(response.success)
                            {
                                completeFilesInfo.push(...data);
                            }
                            this.setState({completeFiles, completeFilesInfo});
                            if (this.props.onCloseCallback !== undefined) {
                                this.props.onCloseCallback(completeFiles);
                            }
                        }
                    },
                    onError: (id, name, reason, maybeXhrOrXdr) => {
                        this.setState({errorMsg: reason});
                    }
                },
                validation: {
                    allowedExtensions: props.allowedExtensions,
                    sizeLimit: props.sizeLimit,
                    itemLimit: props.itemLimit,
                    allowEmpty: false
                }
            }
        });
    }
    addFileClick = (event) => {
        this.setState({
            modalIsOpen: true,
            errorMsg: ''
        });
    }
    closeModal = (event) => {
        this.setState({
            modalIsOpen: false,
            emptyFiles: [],
            errorMsg: ''
        });
    }

    render() {
        let modalDialog;
        if (this.state.modalIsOpen) {
            let dropFileSection;
            if (!this.state.uploading) {
                dropFileSection = <span key='DropText' className='dropIcon'>Drop Files Here</span>
            } else {
                dropFileSection =
                    <div id='dropzoneIn' key='dropzoneIn'>
                        {this.state.emptyFiles.map(id => (
                            <ul key={id} className='qq-upload-list'>
                                <li>
                                    <div className="qq-upload-container">
                                        <div className="qq-upload-spinner left"></div>
                                        <div className="qq-upload-file left show-ellipsis">
                                            <Filename id={id} uploader={this.uploader}/>
                                        </div>
                                        <div className="qq-upload-size left">
                                            <Filestatus id={id} uploader={this.uploader}/>
                                            <Filesize id={id} uploader={this.uploader}/>
                                        </div>
                                        <div className="qq-upload-buttons right">
                                            <FileRetry id={id}
                                                       className="qq-upload-retry button green extra-small right"
                                                       uploader={this.uploader}/>
                                            <FileCancel id={id} className="qq-upload-retry button extra-small right"
                                                        uploader={this.uploader}/>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        ))}
                    </div>
            }

            modalDialog =
                <div className="right_section">
                    <div>
                        <div style={{textAlign: "left"}}>
                            <FileInput className="file_input" multiple={this.props.multiple?true:false} accept={this.props.accept} uploader={this.uploader}>
                                <span className="button blue qq-upload-choose">Browse</span>
                            </FileInput>
                        </div>
                        <a className='close_button right' onClick={this.closeModal}></a>
                        <div style={{color:'red'}}>{this.state.errorMsg}</div>
                    </div>
                    {this.props.dropable===false?
                        null:
                        <div>
                            <Dropzone multiple={this.props.multiple?true:false} accept={this.props.accept} className="qq-uploader" uploader={this.uploader}
                                      children={[dropFileSection]}>
                            </Dropzone>
                        </div>
                    }
                </div>
        }
        return (
            <div className="file-uploader">
                <div style={{padding: '7px 7px 7px 0px', textAlign: "left"}}>
                    <a className="file-attachment" href="javascript:void(0);" onClick={this.addFileClick}>{this.props.addFileText}</a>
                    {modalDialog}
                </div>
                <div id='dropzoneOut' >
                    {this.state.submittedFiles.map(id => (
                        <div className="attachments-list" key={id}>
                            <div className="attachment editable">
                                <span className="attachment-file attachment-list-item"  target="_blank">
                                <div className="underline left" style={{textAlign: "left"}}>
                                    <Filename id={id} uploader={this.uploader} />
                                </div>
                                <FileRetry id={id} className="qq-upload-retry button extra-small right" uploader={this.uploader} />
                                <FileCancel id={id} className="qq-upload-cancel button extra-small right" uploader={this.uploader}/>
                                <FileDelete id={id} className="transparent-button right" children={<span className="inline_cancel right"></span>} uploader={this.uploader} />
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    static defaultProps = {
        method: "POST",
        directlyUploadFileInputID: "directlyUploadFileInput",
        allowedExtensions: [],
        addFileText: 'Add File',
        itemLimit: 20,
        sizeLimit: 20 * 1024 * 1024 * 1024,
        hiddenFilesListDiv: false,
        clearAttachs: false,
        multiple: false,
        dropable: true,
        autoUpload: true,
        directlyUpload: false,
        needForm: false,
    }
    static propTypes = {
        deleteUrl: PropTypes.string,
        url: PropTypes.string,
        method: PropTypes.string,
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
        addFileText: PropTypes.string,
        onCloseCallback: PropTypes.func,
        onAllCompleteCallback: PropTypes.func,
    }
}