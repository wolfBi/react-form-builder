import React from 'react';
import FA from 'react-fontawesome'
import draftToHtml from 'draftjs-to-html';
import TextAreaAutosize from 'react-textarea-autosize';
import { Row, Col } from "react-bootstrap";
import {ContentState, EditorState, convertFromHTML, convertToRaw} from 'draft-js';
import {Editor} from 'react-draft-wysiwyg'
import DynamicOptionList from './elements/DynamicOptionList';
import CascadeActionList from './elements/CascadeActionList';

import "../css/react-draft.css";
import "../css/application.css";
import "../css/form-builder-form.css";
import "../css/form-builder.css";

let toolbar = {
    options: ['inline', 'fontSize','link','colorPicker', 'list', 'textAlign',  'history'],
    inline: {
        inDropdown: false,
        className: undefined,
        options: ['bold', 'italic', 'underline', 'superscript', 'subscript'],
    },
    colorPicker: {
        colors: ['rgb(97,189,109)', 'rgb(26,188,156)', 'rgb(84,172,210)', 'rgb(44,130,201)',
            'rgb(147,101,184)', 'rgb(71,85,119)', 'rgb(204,204,204)', 'rgb(65,168,95)', 'rgb(0,168,133)',
            'rgb(61,142,185)', 'rgb(41,105,176)', 'rgb(85,57,130)', 'rgb(40,50,78)', 'rgb(0,0,0)',
            'rgb(247,218,100)', 'rgb(251,160,38)', 'rgb(235,107,86)', 'rgb(226,80,65)', 'rgb(163,143,132)',
            'rgb(239,239,239)', 'rgb(255,255,255)', 'rgb(250,197,28)', 'rgb(243,121,52)', 'rgb(209,72,65)',
            'rgb(184,49,47)', 'rgb(124,112,107)', 'rgb(209,213,216)'],
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

    componentWillReceiveProps(nextProps) {
        this.setState({
            element: nextProps.element,
            data: nextProps.data,
        })
    }

    editElementProp(elemProperty, targProperty, e) {
        let this_element = this.state.element;
        this_element[elemProperty] = e.target[targProperty];

        this.setState({
            element: this_element,
            dirty: true
        }, () => {
            if (targProperty === 'checked') {
                this.updateElement();
            }
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

    close =()=>{
        this.props.manualEditModeOff()
    }

    render() {
        let this_read_only = this.state.element.hasOwnProperty('readOnly') ? this.state.element.readOnly : false;
        let this_default_today = this.state.element.hasOwnProperty('defaultToday') ? this.state.element.defaultToday : false
        let this_needDefault = this.state.element.hasOwnProperty('needDefault') ? this.state.element.needDefault : false

        let this_checked_required = this.state.element.hasOwnProperty('required') ? this.state.element.required : false;
        let this_checked_inline = this.state.element.hasOwnProperty('inline') ? this.state.element.inline : false;
        let this_checked_optioninline = this.state.element.hasOwnProperty('optionInline') ? this.state.element.optionInline : false;
        let this_checked_bold = this.state.element.hasOwnProperty('bold') ? this.state.element.bold : false;
        let this_checked_italic = this.state.element.hasOwnProperty('italic') ? this.state.element.italic : false;
        let this_checked_center = this.state.element.hasOwnProperty('center') ? this.state.element.center : false;
        let this_checked_multiple = this.state.element.hasOwnProperty('multiple') ? this.state.element.multiple : false;
        let this_checked_needName = this.state.element.hasOwnProperty('needName') ? this.state.element.needName : false;
        let this_checked_dropable = this.state.element.hasOwnProperty('dropable') ? this.state.element.dropable : false;
        let this_checked_creatable = this.state.element.hasOwnProperty('creatable') ? this.state.element.creatable : false;
        let this_checked_clearable = this.state.element.hasOwnProperty('clearable') ? this.state.element.clearable : false;
        let this_checked_hidden = this.state.element.hasOwnProperty('hidden') ? this.state.element.hidden : false;

        let editorState;
        if (this.state.element.hasOwnProperty('content')) {
            editorState = this.convertFromHTML(this.state.element.content);
        }
        if (this.state.element.hasOwnProperty('label')) {
            editorState = this.convertFromHTML(this.state.element.label);
        }

        return (
            <div >
                <div className="clearfix">
                    <h4 className="pull-left">{this.state.element.text}</h4>
                    {/*<i className="pull-right fa fa-times dismiss-edit" onClick={this.props.manualEditModeOff}></i>*/}
                    <FA name="times" className="pull-right dismiss-edit" onClick={this.close}/>
                </div>

                { this.state.element.hasOwnProperty('field_name') &&
                <div className="form-group clearfix">
                    <Col xs={3} className="padding0Px"><label htmlFor="srcInput">ID/Name</label></Col>
                    <Col xs={9}>
                        <input id="nameIdInput" type="text" className="form-control" style={{width: '220px'}}
                               defaultValue={this.state.element.field_name}
                               onBlur={this.updateElement}
                               onChange={this.editElementProp.bind(this, 'field_name', 'value')}/>
                    </Col>
                </div>}
                { this.state.element.hasOwnProperty('relatedField') &&
                <div className="form-group clearfix">
                    <Col xs={3} className="padding0Px"><label htmlFor="relatedField">Related Field</label></Col>
                    <Col xs={9}>
                        <input id="relatedField" type="text" className="form-control" style={{width: '220px'}}
                               defaultValue={this.state.element.relatedField}
                               onBlur={this.updateElement}
                               onChange={this.editElementProp.bind(this, 'relatedField', 'value')}/>
                    </Col>
                </div>}
                { this.state.element.hasOwnProperty('content') &&
                <div className="form-group clearfix">
                    <label className="control-label">Text to display:</label>

                    <Editor
                        toolbar={toolbar}
                        defaultEditorState={editorState}
                        onBlur={this.updateElement}
                        onEditorStateChange={this.onEditorStateChange.bind(this, 0, 'content')}/>
                </div>
                }
                { this.state.element.hasOwnProperty('file_path') &&
                <div className="form-group clearfix">
                    <Col xs={3} className="padding0Px">
                        <label className="control-label" htmlFor="fileSelect">Choose file</label>
                    </Col>
                    <Col xs={9}>
                        <input id="fileSelect" type="text" className="form-control"
                               defaultValue={this.state.element.file_path}
                               onChange={this.editElementProp.bind(this, 'file_path', 'value')}/>
                    </Col>
                </div>
                }
                { this.state.element.hasOwnProperty('href') &&
                <div className="form-group clearfix">
                    <TextAreaAutosize type="text" className="form-control" defaultValue={this.state.element.href}
                                      onBlur={this.updateElement}
                                      onChange={this.editElementProp.bind(this, 'href', 'value')}/>
                </div>
                }
                { this.state.element.hasOwnProperty('src') &&
                <div style={{marginBottom: '10px'}}>
                    <div className="form-group clearfix">
                        <Col xs={3} className="padding0Px"><label className="control-label" htmlFor="srcInput">Link
                            to:</label></Col>
                        <Col xs={9}>
                            <input id="srcInput" type="text" className="form-control"
                                   defaultValue={this.state.element.src}
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
                                               defaultValue={this.state.element.width}
                                               onBlur={this.updateElement}
                                               onChange={this.editElementProp.bind(this, 'width', 'value')}/></Col>
                        </div>
                        <div className="col-sm-6">
                            <Col xs={4} className="padding0Px"><label className="control-label" htmlFor="elementHeight">Image
                                Height:</label></Col>
                            <Col xs={8}><input id="elementHeight" type="text" className="form-control"
                                               defaultValue={this.state.element.height}
                                               onBlur={this.updateElement}
                                               onChange={this.editElementProp.bind(this, 'height', 'value')}/></Col>
                        </div>
                    </div>
                </div>
                }
                { this.state.element.hasOwnProperty('label') &&
                <div className="form-group clearfix">
                    <label style={{display: "table-row"}}>Display Label</label>
                    <Editor
                        toolbar={toolbar}
                        defaultEditorState={editorState}
                        onBlur={this.updateElement}
                        onEditorStateChange={this.onEditorStateChange.bind(this, 0, 'label')}/>

                    <br />
                </div>
                }
                <Row>
                    { this.state.element.hasOwnProperty('required') &&
                    <Col sm={3}>
                        <label>
                            <input type="checkbox" checked={this_checked_required} value={true}
                                   onChange={this.editElementProp.bind(this, 'required', 'checked')}/>
                            Required
                        </label>
                    </Col>
                    }
                    { this.state.element.hasOwnProperty('readOnly') &&
                    <Col sm={3}>
                        <label>
                            <input type="checkbox" checked={this_read_only} value={true}
                                   onChange={this.editElementProp.bind(this, 'readOnly', 'checked')}/>
                            Read only
                        </label>
                    </Col>
                    }
                    { this.state.element.hasOwnProperty('hidden') &&
                    <Col sm={3}>
                        <label>
                            <input type="checkbox" checked={this_checked_hidden} value={true}
                                   onChange={this.editElementProp.bind(this, 'hidden', 'checked')}/>
                            Init hidden
                        </label>
                    </Col>
                    }
                    { this.state.element.hasOwnProperty('needDefault') &&
                    <Col sm={3}>
                        <label>
                            <input type="checkbox" checked={this_needDefault} value={true}
                                   onChange={this.editElementProp.bind(this, 'needDefault', 'checked')}/>
                            Need Default?
                        </label>
                    </Col>
                    }
                    { this.state.element.hasOwnProperty('defaultToday') &&
                    <Col sm={3}>
                        <label>
                            <input type="checkbox" checked={this_default_today} value={true}
                                   onChange={this.editElementProp.bind(this, 'defaultToday', 'checked')}/>
                            Default to Today?
                        </label>
                    </Col>
                    }
                    { this.state.element.hasOwnProperty('inline') &&
                    <Col sm={3}>
                        <label>
                            <input type="checkbox" checked={this_checked_inline} value={true}
                                   onChange={this.editElementProp.bind(this, 'inline', 'checked')}/>
                            Display horizonal
                        </label>
                    </Col>
                    }
                    { this.state.element.hasOwnProperty('optionInline') &&
                    <Col sm={3}>
                        <label>
                            <input type="checkbox" checked={this_checked_optioninline} value={true}
                                   onChange={this.editElementProp.bind(this, 'optionInline', 'checked')}/>
                            Option display horizonal
                        </label>
                    </Col>
                    }
                    { this.state.element.hasOwnProperty('needName') &&
                    <Col sm={3}>
                        <label>
                            <input type="checkbox" checked={this_checked_needName} value={true}
                                onChange={this.editElementProp.bind(this, 'needName', 'checked')}/>
                                Need Name Component?
                        </label>
                    </Col>}
                    { this.state.element.hasOwnProperty('multiple') &&
                    <Col sm={3}>
                        <label>
                            <input type="checkbox" checked={this_checked_multiple} value={true}
                                   onChange={this.editElementProp.bind(this, 'multiple', 'checked')}/>
                            Multiple
                        </label>
                    </Col>
                    }
                    { this.state.element.hasOwnProperty('dropable') &&
                    <Col sm={3}>
                        <label>
                            <input type="checkbox" checked={this_checked_dropable} value={true}
                                   onChange={this.editElementProp.bind(this, 'dropable', 'checked')}/>
                            Dropable
                        </label>
                    </Col>
                    }
                    { this.state.element.hasOwnProperty('creatable') &&
                    <Col sm={3}>
                        <label>
                            <input type="checkbox" checked={this_checked_creatable} value={true}
                                   onChange={this.editElementProp.bind(this, 'creatable', 'checked')}/>
                            Creatable
                        </label>
                    </Col>
                    }
                    { this.state.element.hasOwnProperty('clearable') &&
                    <Col sm={3}>
                        <label>
                            <input type="checkbox" checked={this_checked_clearable} value={true}
                                   onChange={this.editElementProp.bind(this, 'clearable', 'checked')}/>
                            Clearable
                        </label>
                    </Col>
                    }
                </Row>
                { this.state.element.hasOwnProperty('addFileText') &&
                <div className="form-group clearfix">
                    <Col xs={3} className="padding0Px"><label htmlFor="addFileText">Upload Button Text</label></Col>
                    <Col xs={9}>
                        <input id="addFileText" type="text" className="form-control" style={{width: '240px'}}
                               defaultValue={this.state.element.addFileText}
                               onBlur={this.updateElement}
                               onChange={this.editElementProp.bind(this, 'addFileText', 'value')}/>
                    </Col>
                </div>
                }
                { this.state.element.hasOwnProperty('placeholder') &&
                <div className="form-group clearfix">
                    <Col xs={3} className="padding0Px">
                        <label className="control-label" htmlFor="Placeholder">Placeholder</label>
                    </Col>
                    <Col xs={9}>
                        <input id="Placeholder" type="text" className="form-control"
                                       defaultValue={this.state.element.placeholder} onBlur={this.updateElement}
                                       onChange={this.editElementProp.bind(this, 'placeholder', 'value')}/>
                    </Col>
                </div>
                }
                { this.state.element.hasOwnProperty('defaultValue') &&
                <div className="form-group clearfix">
                    <Col xs={3} className="padding0Px">
                        <label className="control-label" htmlFor="defaultSelected">Default Value</label>
                    </Col>
                    <Col xs={9}>
                        <input id="defaultSelected" type="text" className="form-control"
                               defaultValue={this.state.element.defaultValue} onBlur={this.updateElement}
                               onChange={this.editElementProp.bind(this, 'defaultValue', 'value')}/>
                    </Col>
                </div>
                }
                { this.state.element.hasOwnProperty('spliceSymbol') &&
                <div className="form-group clearfix">
                    <Col xs={3} className="padding0Px">
                        <label className="control-label" htmlFor="defaultSelected">Splice Symbol</label>
                    </Col>
                    <Col xs={9}>
                        <input id="spliceSymbol" type="text" className="form-control"
                               defaultValue={this.state.element.spliceSymbol} onBlur={this.updateElement}
                               onChange={this.editElementProp.bind(this, 'spliceSymbol', 'value')}/>
                    </Col>
                </div>
                }
                { this.state.element.hasOwnProperty('spliceField') &&
                <div className="form-group clearfix">
                    <Col xs={3} className="padding0Px">
                        <label className="control-label" htmlFor="defaultSelected">Splice Field</label>
                    </Col>
                    <Col xs={9}>
                        <input id="spliceField" type="text" className="form-control"
                               placeholder="SpliceFieldA,SpliceFieldB"
                               defaultValue={this.state.element.spliceField} onBlur={this.updateElement}
                               onChange={this.editElementProp.bind(this, 'spliceField', 'value')}/>
                    </Col>
                </div>
                }

                {this.state.element.element === 'Signature' && this.state.element.readOnly
                    ? (
                        <div className="form-group clearfix">
                            <label className="control-label" htmlFor="variableKey">Variable Key</label>
                            <input id="variableKey" type="text" className="form-control"
                                   defaultValue={this.state.element.variableKey}
                                   onBlur={this.updateElement}
                                   onChange={this.editElementProp.bind(this, 'variableKey', 'value')}/>
                            <p className="help-block">This will give the element a key that can be used to replace the
                                content with a
                                runtime value.</p>
                        </div>
                    )
                    : (<div/>)
                }

                { this.state.element.hasOwnProperty('step') &&
                <div className="form-group clearfix">
                    <Col xs={3}>
                        <label className="control-label" htmlFor="rangeStep">Step</label>
                    </Col>
                    <Col xs={9}>
                        <input id="rangeStep" type="number" className="form-control"
                               defaultValue={this.state.element.step}
                               onBlur={this.updateElement}
                               onChange={this.editElementProp.bind(this, 'step', 'value')}/>
                    </Col>
                </div>
                }
                { this.state.element.hasOwnProperty('min_value') &&
                <div className="form-group clearfix">
                    <Col xs={3}>
                        <label className="control-label" htmlFor="rangeMin">Min</label>
                    </Col>
                    <Col xs={9}>
                        <input id="rangeMin" type="number" className="form-control"
                               defaultValue={this.state.element.min_value}
                               onBlur={this.updateElement}
                               onChange={this.editElementProp.bind(this, 'min_value', 'value')}/>
                        <input type="text" className="form-control" defaultValue={this.state.element.min_label}
                               onBlur={this.updateElement}
                               onChange={this.editElementProp.bind(this, 'min_label', 'value')}/>
                    </Col>
                </div>
                }
                { this.state.element.hasOwnProperty('max_value') &&
                <div className="form-group clearfix">
                    <Col xs={3}>
                        <label className="control-label" htmlFor="rangeMax">Max</label>
                    </Col>
                    <Col xs={9}>
                        <input id="rangeMax" type="number" className="form-control"
                               defaultValue={this.state.element.max_value}
                               onBlur={this.updateElement}
                               onChange={this.editElementProp.bind(this, 'max_value', 'value')}/>
                        <input type="text" className="form-control" defaultValue={this.state.element.max_label}
                               onBlur={this.updateElement}
                               onChange={this.editElementProp.bind(this, 'max_label', 'value')}/>
                    </Col>
                </div>
                }
                { this.state.element.hasOwnProperty('minYear') &&
                <div className="form-group clearfix">
                    <Col xs={3}>
                        <label className="control-label" htmlFor="minYear">Min Year</label>
                    </Col>
                    <Col xs={9}>
                        <input id="minYear" type="number" className="form-control"
                               defaultValue={this.state.element.minYear}
                               onBlur={this.updateElement}
                               onChange={this.editElementProp.bind(this, 'minYear', 'value')}/>
                    </Col>
                </div>
                }
                { this.state.element.hasOwnProperty('maxYear') &&
                <div className="form-group clearfix">
                    <Col xs={3}>
                        <label className="control-label" htmlFor="maxYear">Max Year</label>
                    </Col>
                    <Col xs={9}>
                        <input id="maxYear" type="number" className="form-control"
                               defaultValue={this.state.element.maxYear}
                               onBlur={this.updateElement}
                               onChange={this.editElementProp.bind(this, 'maxYear', 'value')}/>
                    </Col>
                </div>
                }
                { this.state.element.hasOwnProperty('static') && this.state.element.static &&
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
                { this.state.element.hasOwnProperty('compWidth') &&
                <div className="form-group clearfix">
                    <Col xs={3} className="padding0Px">
                        <label className="control-label" htmlFor="compWidth">Width </label>
                    </Col>
                    <Col xs={9}>
                        <input id="compWidth" type="number" min={1} max={12} style={{width: '40px'}}
                               defaultValue={this.state.element.compWidth} onBlur={this.updateElement}
                               onChange={this.editElementProp.bind(this, 'compWidth', 'value')}/>
                        ( 1~12 ) Change lines every 12 units. Bootstrap col-xs-?
                    </Col>
                </div>
                }
                { this.state.element.hasOwnProperty('labelWidth') &&
                <div className="form-group clearfix">
                    <Col xs={3} className="padding0Px"><label className="control-label"
                                                              htmlFor="labelWidth">Label Width </label></Col>
                    <Col xs={9}>
                        <input id="labelWidth" type="number" min={1} max={12} style={{width: '40px'}}
                               defaultValue={this.state.element.labelWidth} onBlur={this.updateElement}
                               onChange={this.editElementProp.bind(this, 'labelWidth', 'value')}/>
                        ( 1~12 ) Change lines every 12 units. Bootstrap col-xs-?
                    </Col>
                </div>
                }
                { this.state.element.hasOwnProperty('inputWidth') &&
                <div className="form-group clearfix">
                    <Col xs={3} className="padding0Px"><label className="control-label"
                                                              htmlFor="inputWidth">Input Width </label></Col>
                    <Col xs={9}>
                        <input id="inputWidth" type="number" min={1} max={12} style={{width: '40px'}}
                               defaultValue={this.state.element.inputWidth} onBlur={this.updateElement}
                               onChange={this.editElementProp.bind(this, 'inputWidth', 'value')}/>
                        ( 1~12 ) Change lines every 12 units. Bootstrap col-xs-?
                    </Col>
                </div>
                }
                { this.state.element.hasOwnProperty('cascadeField') &&
                <div className="form-group clearfix">
                    <Col xs={3} className="padding0Px">
                        <label className="control-label" htmlFor="cascadeField">Cascade Field</label>
                    </Col>
                    <Col xs={9}>
                        <input id="cascadeField" type="text" onBlur={this.updateElement}
                               defaultValue={this.state.element.cascadeField}
                               onChange={this.editElementProp.bind(this, 'cascadeField', 'value')}/>
                    </Col>
                </div>
                }

                { this.state.element.hasOwnProperty('serverDictKey') &&
                <div className="form-group clearfix">
                    <Col xs={3} className="padding0Px">
                        <label className="control-label" htmlFor="serverDictKey">Service Dict Key</label>
                    </Col>
                    <Col xs={9}>
                        <input id="serverDictKey" type="text" onBlur={this.updateElement}
                               defaultValue={this.state.element.serverDictKey}
                               onChange={this.editElementProp.bind(this, 'serverDictKey', 'value')}/>
                    </Col>
                </div> }

                { this.state.element.hasOwnProperty('options') &&
                <DynamicOptionList data={this.props.data}
                                   updateElement={this.props.updateElement} preview={this.props.preview}
                                   element={this.state.element} key={"options"+this.state.element.options.length}/>
                }

                { this.state.element.hasOwnProperty('cascadeActions') &&
                <CascadeActionList data={this.props.data}
                                   updateElement={this.props.updateElement} preview={this.props.preview}
                                   element={this.state.element} key={"cascadeActions"+this.state.element.cascadeActions.length}/>
                }


                { this.state.element.hasOwnProperty('supportJS') && this.state.element.supportJS &&
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
                          defaultValue={this.state.element.onClickStr}>

                </textarea>
                        </Col>
                    </div>
                    <div className="form-group clearfix">
                        <Col xs={3} className="padding0Px"><label className="control-label" htmlFor="onChangeStr">OnChange </label></Col>
                        <Col xs={9}>
                <textarea id="onChangeStr" rows={3} onBlur={this.updateElement}
                          onChange={this.editElementProp.bind(this, 'onChangeStr', 'value')}
                          defaultValue={this.state.element.onChangeStr}>

                </textarea>
                        </Col>
                    </div>
                    <div className="form-group clearfix">
                        <Col xs={3} className="padding0Px"><label className="control-label"
                                                                  htmlFor="onBlurStr">OnBlur </label></Col>
                        <Col xs={9}>
                <textarea id="onBlurStr" rows={3} onBlur={this.updateElement}
                          onChange={this.editElementProp.bind(this, 'onBlurStr', 'value')}
                          defaultValue={this.state.element.onBlurStr}>

                </textarea>
                        </Col>
                    </div>
                </div>
                }
            </div>
        );
    }
}
FormElementsEdit.defaultProps = {className: 'edit-element-fields'}
