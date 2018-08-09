import React from 'react';
import FA from 'react-fontawesome'
import draftToHtml from 'draftjs-to-html';
import TextAreaAutosize from 'react-textarea-autosize';
import {Col} from "react-bootstrap";
import {ContentState, EditorState, convertFromHTML, convertToRaw} from 'draft-js';
import {Editor} from 'react-draft-wysiwyg'
import DynamicOptionList from './elements/DynamicOptionList';
import "../css/react-draft.css";

import "../css/application.css";
import "../css/form-builder-form.css";
import "../css/form-builder.css";

let toolbar = {
    options: ['inline', 'list', 'textAlign', 'fontSize', 'link', 'history'],
    inline: {
        inDropdown: false,
        className: undefined,
        options: ['bold', 'italic', 'underline', 'superscript', 'subscript'],
    },
};

export default class FormElementsEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            element: this.props.element,
            data: this.props.data,
            dirty: false
        }
    }

   /* toggleRequired() {
        let this_element = this.state.element;
    }*/

    editElementProp(elemProperty, targProperty, e) {
        // elemProperty could be content or label
        // targProperty could be value or checked
        let this_element = this.state.element;
        this_element[elemProperty] = e.target[targProperty];

        this.setState({
            element: this_element,
            dirty: true
        }, () => {
            if (targProperty === 'checked') {
                this.updateElement();
            }
            ;
        });
    }

    onEditorStateChange(index, property, editorContent) {

        let html = draftToHtml(convertToRaw(editorContent.getCurrentContent())).replace(/<p>/g, '<div>').replace(/<\/p>/g, '</div>');
        let this_element = this.state.element;
        this_element[property] = html;

        this.setState({
            element: this_element,
            dirty: true
        });
    }

    updateElement=()=> {
        let this_element = this.state.element;
        // to prevent ajax calls with no change
        if (this.state.dirty) {
            this.props.updateElement.call(this.props.preview, this_element);
            this.setState({dirty: false});
        }
    }

    convertFromHTML=(content)=> {
        const newContent = convertFromHTML(content);
        if (!newContent.contentBlocks) {
            // to prevent crash when no contents in editor
            return EditorState.createEmpty();
        }
        const contentState = ContentState.createFromBlockArray(newContent);
        return EditorState.createWithContent(contentState);
    }

    render() {
        let this_read_only = this.props.element.hasOwnProperty('readOnly') ? this.props.element.readOnly : false;
        let this_default_today = this.props.element.hasOwnProperty('defaultToday') ? this.props.element.defaultToday : false

        let this_checked_required = this.props.element.hasOwnProperty('required') ? this.props.element.required : false;
        let this_checked_inline = this.props.element.hasOwnProperty('inline') ? this.props.element.inline : false;
        let this_checked_optioninline = this.props.element.hasOwnProperty('optionInline') ? this.props.element.optionInline : false;
        let this_checked_bold = this.props.element.hasOwnProperty('bold') ? this.props.element.bold : false;
        let this_checked_italic = this.props.element.hasOwnProperty('italic') ? this.props.element.italic : false;
        let this_checked_center = this.props.element.hasOwnProperty('center') ? this.props.element.center : false;
        // let this_checked_page_break = this.props.element.hasOwnProperty('pageBreakBefore') ? this.props.element.pageBreakBefore : false;
        // let this_checked_alternate_form = this.props.element.hasOwnProperty('alternateForm') ? this.props.element.alternateForm : false;
        let this_checked_multiple = this.props.element.hasOwnProperty('multiple') ? this.props.element.multiple : false;
        let this_checked_needAuthorization= this.props.element.hasOwnProperty('needAuthorization') ? this.props.element.needAuthorization : false;
        let this_checked_dropable = this.props.element.hasOwnProperty('dropable') ? this.props.element.dropable : false;
        let this_checked_creatable = this.props.element.hasOwnProperty('creatable') ? this.props.element.creatable : false;
        let this_checked_clearable = this.props.element.hasOwnProperty('clearable') ? this.props.element.clearable : false;

        // let this_files = this.props.files.length ? this.props.files : [];
        // if (this_files.length < 1 || (this_files.length > 0 && this_files[0].id !== ""))
        //     this_files.unshift({id: '', file_name: ''});

        let editorState;
        if (this.props.element.hasOwnProperty('content')) {
            editorState = this.convertFromHTML(this.props.element.content);
        }
        if (this.props.element.hasOwnProperty('label')) {
            editorState = this.convertFromHTML(this.props.element.label);
        }

        return (
            <div >
                <div className="clearfix">
                    <h4 className="pull-left">{this.props.element.text}</h4>
                    {/*<i className="pull-right fa fa-times dismiss-edit" onClick={this.props.manualEditModeOff}></i>*/}
                    <FA name="times" className="pull-right dismiss-edit" onClick={this.props.manualEditModeOff}/>
                </div>

                { this.props.element.hasOwnProperty('field_name') &&
                <div className="form-group clearfix">
                    <Col xs={3} className="padding0Px"><label htmlFor="srcInput">ID/Name</label></Col>
                    <Col xs={9}>
                        <input id="nameIdInput" type="text" className="form-control" style={{width: '220px'}}
                               defaultValue={this.props.element.field_name}
                               onBlur={this.updateElement}
                               onChange={this.editElementProp.bind(this, 'field_name', 'value')}/>
                    </Col>
                </div>}

                { this.props.element.hasOwnProperty('content') &&
                <div className="form-group clearfix">
                    <label className="control-label">Text to display:</label>

                    <Editor
                        toolbar={toolbar}
                        defaultEditorState={editorState}
                        onBlur={this.updateElement}
                        onEditorStateChange={this.onEditorStateChange.bind(this, 0, 'content')}/>
                </div>
                }
                { this.props.element.hasOwnProperty('file_path') &&
                <div className="form-group clearfix">
                    <Col xs={3} className="padding0Px">
                        <label className="control-label" htmlFor="fileSelect">Choose file</label>
                    </Col>
                    <Col xs={9}>
                       {/* <select id="fileSelect" className="form-control" defaultValue={this.props.element.file_path}
                                onBlur={this.updateElement}
                                onChange={this.editElementProp.bind(this, 'file_path', 'value')}>
                            {this_files.map(function (file) {
                                let this_key = 'file_' + file.id;
                                return <option value={file.id} key={this_key}>{file.file_name}</option>;
                            })}
                        </select>*/}
                        <input id="fileSelect" type="text" className="form-control"
                               defaultValue={this.props.element.file_path}
                               onBlur={this.updateElement}
                               onChange={this.editElementProp.bind(this, 'file_path', 'value')}/>
                    </Col>
                </div>
                }
                { this.props.element.hasOwnProperty('href') &&
                <div className="form-group clearfix">
                    <TextAreaAutosize type="text" className="form-control" defaultValue={this.props.element.href}
                                      onBlur={this.updateElement}
                                      onChange={this.editElementProp.bind(this, 'href', 'value')}/>
                </div>
                }
                { this.props.element.hasOwnProperty('src') &&
                <div style={{marginBottom: '10px'}}>
                    <div className="form-group clearfix">
                        <Col xs={3} className="padding0Px"><label className="control-label" htmlFor="srcInput">Link
                            to:</label></Col>
                        <Col xs={9}>
                            <input id="srcInput" type="text" className="form-control"
                                   defaultValue={this.props.element.src}
                                   onBlur={this.updateElement}
                                   onChange={this.editElementProp.bind(this, 'src', 'value')}/>
                        </Col>
                    </div>
                    <div className="form-group clearfix">
                        <div className="checkbox">
                            <label>
                                <input type="checkbox" checked={this_checked_center} value={true}
                                       onChange={this.editElementProp.bind(this, 'center', 'checked')}/>
                                Center?
                            </label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-6">
                            <Col xs={4} className="padding0Px"><label className="control-label" htmlFor="elementWidth">Image
                                Width:</label></Col>
                            <Col xs={8}><input id="elementWidth" type="text" className="form-control"
                                               defaultValue={this.props.element.width}
                                               onBlur={this.updateElement}
                                               onChange={this.editElementProp.bind(this, 'width', 'value')}/></Col>
                        </div>
                        <div className="col-sm-6">
                            <Col xs={4} className="padding0Px"><label className="control-label" htmlFor="elementHeight">Image
                                Height:</label></Col>
                            <Col xs={8}><input id="elementHeight" type="text" className="form-control"
                                               defaultValue={this.props.element.height}
                                               onBlur={this.updateElement}
                                               onChange={this.editElementProp.bind(this, 'height', 'value')}/></Col>
                        </div>
                    </div>
                </div>
                }

                { this.props.element.hasOwnProperty('label') &&
                <div className="form-group clearfix">
                    <label style={{display: "table-row"}}>Display Label</label>
                    <Editor
                        toolbar={toolbar}
                        defaultEditorState={editorState}
                        onBlur={this.updateElement}
                        onEditorStateChange={this.onEditorStateChange.bind(this, 0, 'label')}/>

                    <br />
                    <div className="checkbox">
                        <label>
                            <input type="checkbox" checked={this_checked_required} value={true}
                                   onChange={this.editElementProp.bind(this, 'required', 'checked')}/>
                            Required
                        </label>
                    </div>
                    <div className="checkbox">
                        <label>
                            <input type="checkbox" checked={this_checked_inline} value={true}
                                   onChange={this.editElementProp.bind(this, 'inline', 'checked')}/>
                            Display horizonal
                        </label>
                    </div>
                    { this.props.element.hasOwnProperty('readOnly') &&
                    <div className="checkbox">
                        <label>
                            <input type="checkbox" checked={this_read_only} value={true}
                                   onChange={this.editElementProp.bind(this, 'readOnly', 'checked')}/>
                            Read only
                        </label>
                    </div>
                    }
                    { this.props.element.hasOwnProperty('defaultToday') &&
                    <div className="checkbox">
                        <label>
                            <input type="checkbox" checked={this_default_today} value={true}
                                   onChange={this.editElementProp.bind(this, 'defaultToday', 'checked')}/>
                            Default to Today?
                        </label>
                    </div>
                    }
                    { this.props.element.hasOwnProperty('optionInline') &&
                    <div className="checkbox">
                        <label>
                            <input type="checkbox" checked={this_checked_optioninline} value={true}
                                   onChange={this.editElementProp.bind(this, 'optionInline', 'checked')}/>
                            Option display horizonal
                        </label>
                    </div>
                    }
                </div>
                }
                { this.props.element.hasOwnProperty('loadOptionUrl') &&
                <div style={{marginBottom: '10px'}}>
                    <div className="form-group clearfix">
                        <Col xs={3} className="padding0Px"><label className="control-label"
                                                                  htmlFor="loadOptionUrlInput">Load Option
                            URL</label></Col>
                        <Col xs={9}>
                              <textarea id="loadOptionUrlInput" rows={3} onBlur={this.updateElement}
                                        onChange={this.editElementProp.bind(this, 'loadOptionUrl', 'value')}
                                        defaultValue={this.props.element.loadOptionUrl}>
                              </textarea>
                        </Col>
                    </div>
                    <div className="row">
                        <div className="col-sm-12">
                            <Col xs={3} className="padding0Px"><label className="control-label" htmlFor="responseFeild">Response
                                Feild</label></Col>
                            <Col xs={9}><input id="responseFeild" type="text" className="form-control"
                                               defaultValue={this.props.element.responseFeild}
                                               onBlur={this.updateElement}
                                               onChange={this.editElementProp.bind(this, 'responseFeild', 'value')}/></Col>
                        </div>
                        <div className="col-sm-12">
                            <Col xs={3} className="padding0Px"><label className="control-label" htmlFor="elementWidth">Label
                                Feild</label></Col>
                            <Col xs={9}><input id="labelFeild" type="text" className="form-control"
                                               defaultValue={this.props.element.labelFeild}
                                               onBlur={this.updateElement}
                                               onChange={this.editElementProp.bind(this, 'labelFeild', 'value')}/></Col>
                        </div>
                        <div className="col-sm-12">
                            <Col xs={3} className="padding0Px"><label className="control-label" htmlFor="elementHeight">Value
                                Feild</label></Col>
                            <Col xs={9}><input id="valueFeild" type="text" className="form-control"
                                               defaultValue={this.props.element.valueFeild}
                                               onBlur={this.updateElement}
                                               onChange={this.editElementProp.bind(this, 'valueFeild', 'value')}/></Col>
                        </div>
                        { this.state.element.hasOwnProperty('needAuthorization') &&
                        <div className="checkbox">
                            <label>
                                <input type="checkbox" checked={this_checked_needAuthorization} value={true}
                                       onChange={this.editElementProp.bind(this, 'needAuthorization', 'checked')}/>
                                Need Authorization ?
                            </label>
                        </div>
                        }
                    </div>
                </div>
                }
                { this.state.element.hasOwnProperty('addFileText') &&
                <div className="form-group clearfix">
                    <Col xs={3} className="padding0Px"><label htmlFor="addFileText">Upload Button Text</label></Col>
                    <Col xs={9}>
                        <input id="addFileText" type="text" className="form-control" style={{width: '240px'}}
                               defaultValue={this.props.element.addFileText}
                               onBlur={this.updateElement}
                               onChange={this.editElementProp.bind(this, 'addFileText', 'value')}/>
                    </Col>
                </div>
                }
                { this.state.element.hasOwnProperty('multiple') &&
                <div className="checkbox">
                    <label>
                        <input type="checkbox" checked={this_checked_multiple} value={true}
                               onChange={this.editElementProp.bind(this, 'multiple', 'checked')}/>
                        Multiple
                    </label>
                </div>
                }
                { this.state.element.hasOwnProperty('dropable') &&
                <div className="checkbox">
                    <label>
                        <input type="checkbox" checked={this_checked_dropable} value={true}
                               onChange={this.editElementProp.bind(this, 'dropable', 'checked')}/>
                        Dropable
                    </label>
                </div>
                }
                { this.state.element.hasOwnProperty('creatable') &&
                <div className="checkbox">
                    <label>
                        <input type="checkbox" checked={this_checked_creatable} value={true}
                               onChange={this.editElementProp.bind(this, 'creatable', 'checked')}/>
                        Creatable
                    </label>
                </div>
                }
                { this.state.element.hasOwnProperty('clearable') &&
                <div className="checkbox">
                    <label>
                        <input type="checkbox" checked={this_checked_clearable} value={true}
                               onChange={this.editElementProp.bind(this, 'clearable', 'checked')}/>
                        Clearable
                    </label>
                </div>
                }
                {this.state.element.element === 'Signature' && this.props.element.readOnly
                    ? (
                        <div className="form-group">
                            <label className="control-label" htmlFor="variableKey">Variable Key</label>
                            <input id="variableKey" type="text" className="form-control"
                                   defaultValue={this.props.element.variableKey}
                                   onBlur={this.updateElement}
                                   onChange={this.editElementProp.bind(this, 'variableKey', 'value')}/>
                            <p className="help-block">This will give the element a key that can be used to replace the
                                content with a
                                runtime value.</p>
                        </div>
                    )
                    : (<div/>)
                }

                { this.props.element.hasOwnProperty('step') &&
                <div className="form-group">
                    <div className="form-group-range">
                        <label className="control-label" htmlFor="rangeStep">Step</label>
                        <input id="rangeStep" type="number" className="form-control"
                               defaultValue={this.props.element.step}
                               onBlur={this.updateElement}
                               onChange={this.editElementProp.bind(this, 'step', 'value')}/>
                    </div>
                </div>
                }
                { this.props.element.hasOwnProperty('min_value') &&
                <div className="form-group">
                    <div className="form-group-range">
                        <label className="control-label" htmlFor="rangeMin">Min</label>
                        <input id="rangeMin" type="number" className="form-control"
                               defaultValue={this.props.element.min_value}
                               onBlur={this.updateElement}
                               onChange={this.editElementProp.bind(this, 'min_value', 'value')}/>
                        <input type="text" className="form-control" defaultValue={this.props.element.min_label}
                               onBlur={this.updateElement}
                               onChange={this.editElementProp.bind(this, 'min_label', 'value')}/>
                    </div>
                </div>
                }
                { this.props.element.hasOwnProperty('max_value') &&
                <div className="form-group">
                    <div className="form-group-range">
                        <label className="control-label" htmlFor="rangeMax">Max</label>
                        <input id="rangeMax" type="number" className="form-control"
                               defaultValue={this.props.element.max_value}
                               onBlur={this.updateElement}
                               onChange={this.editElementProp.bind(this, 'max_value', 'value')}/>
                        <input type="text" className="form-control" defaultValue={this.props.element.max_label}
                               onBlur={this.updateElement}
                               onChange={this.editElementProp.bind(this, 'max_label', 'value')}/>
                    </div>
                </div>
                }
                { this.props.element.hasOwnProperty('default_value') &&
                <div className="form-group">
                    <div className="form-group-range">
                        <label className="control-label" htmlFor="defaultSelected">Default Selected</label>
                        <input id="defaultSelected" type="number" className="form-control"
                               defaultValue={this.props.element.default_value} onBlur={this.updateElement}
                               onChange={this.editElementProp.bind(this, 'default_value', 'value')}/>
                    </div>
                </div>
                }
                { this.props.element.hasOwnProperty('static') && this.props.element.static &&
                <div className="form-group clearfix">
                    <label className="control-label">Text Style</label>
                    <div className="checkbox">
                        <label>
                            <input type="checkbox" checked={this_checked_bold} value={true}
                                   onChange={this.editElementProp.bind(this, 'bold', 'checked')}/>
                            Bold
                        </label>
                    </div>
                    <div className="checkbox">
                        <label>
                            <input type="checkbox" checked={this_checked_italic} value={true}
                                   onChange={this.editElementProp.bind(this, 'italic', 'checked')}/>
                            Italic
                        </label>
                    </div>
                </div>
                }
                { this.props.element.hasOwnProperty('compWidth') &&
                <div className="form-group clearfix">
                    <Col xs={3} className="padding0Px"><label className="control-label"
                                                              htmlFor="compWidth">Width </label></Col>
                    <Col xs={9}>
                        <input id="compWidth" type="number" min={1} max={12} style={{width: '40px'}}
                               defaultValue={this.props.element.compWidth} onBlur={this.updateElement}
                               onChange={this.editElementProp.bind(this, 'compWidth', 'value')}/>
                        ( 1~12 ) Change lines every 12 units. Bootstrap col-xs-?
                    </Col>
                </div>
                }

                { this.props.showCorrectColumn && this.props.element.canHaveAnswer && !this.props.element.hasOwnProperty('options') &&
                <div className="form-group clearfix">
                    <label className="control-label" htmlFor="correctAnswer">Correct Answer</label>
                    <input id="correctAnswer" type="text" className="form-control"
                           defaultValue={this.props.element.correct}
                           onBlur={this.updateElement}
                           onChange={this.editElementProp.bind(this, 'correct', 'value')}/>
                </div>
                }
                { this.props.element.hasOwnProperty('options') &&
                <DynamicOptionList showCorrectColumn={this.props.showCorrectColumn} data={this.props.preview.state.data}
                                   updateElement={this.props.updateElement} preview={this.props.preview}
                                   element={this.props.element} key={this.props.element.options.length}/>
                }
                { this.props.element.hasOwnProperty('supportJS') && this.props.element.supportJS &&
                <div>
                    <Col xs={12} className="control-label padding0Px"><h4>Function</h4></Col>
                    <Col xs={12} className="control-label padding0Px">
                        <p>The name and value variables are not allowed to be defined in the <span
                            style={{fontWeight: '700'}}>OnChange</span> function.You can use name and value directly,
                            e.g. alert(name+value)</p>
                    </Col>
                    <div className="form-group clearfix">
                        <Col xs={3} className="padding0Px"><label className="control-label"
                                                                  htmlFor="onClickStr">OnClick </label></Col>
                        <Col xs={9}>
                <textarea id="onClickStr" rows={3} onBlur={this.updateElement}
                          onChange={this.editElementProp.bind(this, 'onClickStr', 'value')}
                          defaultValue={this.props.element.onClickStr}>

                </textarea>
                        </Col>
                    </div>
                    <div className="form-group clearfix">
                        <Col xs={3} className="padding0Px"><label className="control-label" htmlFor="onChangeStr">OnChange </label></Col>
                        <Col xs={9}>
                <textarea id="onChangeStr" rows={3} onBlur={this.updateElement}
                          onChange={this.editElementProp.bind(this, 'onChangeStr', 'value')}
                          defaultValue={this.props.element.onChangeStr}>

                </textarea>
                        </Col>
                    </div>
                    <div className="form-group clearfix">
                        <Col xs={3} className="padding0Px"><label className="control-label"
                                                                  htmlFor="onBlurStr">OnBlur </label></Col>
                        <Col xs={9}>
                <textarea id="onBlurStr" rows={3} onBlur={this.updateElement}
                          onChange={this.editElementProp.bind(this, 'onBlurStr', 'value')}
                          defaultValue={this.props.element.onBlurStr}>

                </textarea>
                        </Col>
                    </div>
                </div>
                }
                {/*<div className="form-group">
                    <label className="control-label">Print Options</label>
                    <div className="checkbox">
                        <label>
                            <input type="checkbox" checked={this_checked_page_break} value={true}
                                   onChange={this.editElementProp.bind(this, 'pageBreakBefore', 'checked')}/>
                            Page Break Before Element?
                        </label>
                    </div>
                </div>

                <div className="form-group">
                    <label className="control-label">Alternate/Short Form</label>
                    <div className="checkbox">
                        <label>
                            <input type="checkbox" checked={this_checked_alternate_form} value={true}
                                   onChange={this.editElementProp.bind(this, 'alternateForm', 'checked')}/>
                            Display on Alternate/Short Form?
                        </label>
                    </div>
                </div>*/}

            </div>
        );
    }
}
FormElementsEdit.defaultProps = {className: 'edit-element-fields'}
