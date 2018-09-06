/**
 * <Toolbar />
 */

import React from 'react';
import ToolbarItem from './ToolbarDraggableItem';
import {guid} from '../../../utils/CommonUtil';
import "../css/application.css";
import "../css/form-builder-form.css";
import "../css/form-builder.css";

export default class Toolbar extends React.Component {
    constructor(props) {
        super(props);
        var items = (this.props.items) ? this.props.items : this._defaultItems();
        this.state = {
            items: items
        };
    }

    static _defaultItemOptions(element) {
        switch (element) {
            case "Checkboxes":
            case "RadioButtons":
            case "AsyncDropdown":
            case "Dropdown":
                return [
                    { value: '', label: '', key: 'option_' + guid()},
                ];
            default:
                return [];
        }
    }

    _defaultItems() {
        return [
            {
                key: 'Header',
                name: 'Header',
                field_name: 'Header',
                icon: 'heading',
                static: true,
                content: 'Placeholder Text...',
                hidden:false,
            },
            {
                key: 'Label',
                name: 'Label',
                field_name: 'Label',
                static: true,
                compWidth: '12',
                icon: 'font',
                content: 'Placeholder Text...',
                hidden:false,
            },
            {
                key: 'Paragraph',
                name: 'Paragraph',
                field_name: 'Paragraph',
                static: true,
                icon: 'paragraph',
                content: 'Placeholder Text...',
                hidden:false,
            },
            {
                key: 'TextInput',
                canHaveAnswer: true,
                name: 'Text',
                compWidth: '6',
                labelWidth:'4',
                inputWidth:'8',
                label: 'Placeholder Label',
                icon: 'font',
                field_name: 'text_input_',
                supportJS: true,
                inline: true,
                relatedField:'',
                hidden:false,
                defaultValue:'',
                placeholder:'',
                canSplice:true,
            },
            {
                key: 'NumberInput',
                canHaveAnswer: true,
                name: 'Number',
                compWidth: '6',
                labelWidth:'4',
                inputWidth:'8',
                label: 'Placeholder Label',
                icon: 'sort-numeric-up',
                field_name: 'number_input_',
                supportJS: true,
                inline: true,
                relatedField:'',
                hidden:false,
                defaultValue:'',
                placeholder:'',
                canSplice:true,
            },
            {
                key: 'TextArea',
                canHaveAnswer: true,
                compWidth: '12',
                labelWidth:'2',
                inputWidth:'10',
                name: 'TextArea',
                label: 'Placeholder Label',
                icon: 'text-height',
                field_name: 'text_area_',
                supportJS: true,
                inline: true,
                relatedField:'',
                hidden:false,
                defaultValue:'',
                canSplice:true,
            },
            {
                key: 'Dropdown',
                canHaveAnswer: true,
                name: 'Dropdown',
                compWidth: '6',
                labelWidth:'4',
                inputWidth:'8',
                icon: 'caret-square-down',
                label: 'Placeholder Label',
                field_name: 'dropdown_',
                options: [],
                canCascadeOption:true,
                creatable: false,
                clearable: true,
                // multiple: false,
                supportJS: true,
                inline: true,
                relatedField:'',
                hidden:false,
                defaultValue:'',
                canSplice:true,
            },
            {
                key: 'AsyncDropdown',
                canHaveAnswer: true,
                name: 'Async',
                compWidth: '6',
                labelWidth:'4',
                inputWidth:'8',
                icon: 'tags',
                label: 'Placeholder Label',
                field_name: 'tags_',
                canCascadeOption:true,
                creatable: true,
                clearable: true,
                // multiple: false,
                supportJS: true,
                inline: true,
                needAuthorization:false,
                relatedField:'',
                hidden:false,
                canSplice:true,
            },
            {
                key: 'LineBreak',
                name: 'Line',
                static: true,
                icon: 'arrows-alt-h'
            },
            {
                key: 'Checkboxes',
                canHaveAnswer: true,
                name: 'Checkboxes',
                compWidth: '6',
                labelWidth:'4',
                inputWidth:'8',
                icon: 'check-square',
                label: 'Placeholder Label',
                field_name: 'checkboxes_',
                options: [],
                canCascadeOption:true,
                supportJS: true,
                inline: true,
                optionInline: false,
                relatedField:'',
                hidden:false,
                defaultValue:'',
                canSplice:true,
            },
            {
                key: 'RadioButtons',
                canHaveAnswer: true,
                name: 'Radio',
                compWidth: '6',
                labelWidth:'4',
                inputWidth:'8',
                icon: 'dot-circle',
                label: 'Placeholder Label',
                field_name: 'radio_buttons_',
                options: [],
                canCascadeOption:true,
                supportJS: true,
                inline: true,
                optionInline: false,
                relatedField:'',
                hidden:false,
                defaultValue:'',
                canSplice:true,
            },
            {
                key: 'HyperLink',
                name: 'HyperLink',
                compWidth: '12',
                labelWidth:'4',
                inputWidth:'8',
                icon: 'link',
                static: true,
                content: 'Placeholder Web site link ...',
                href: 'http://www.example.com'
            },
            {
                key: 'DatePicker',
                canDefaultToday: true,
                compWidth: '6',
                labelWidth:'4',
                inputWidth:'8',
                canReadOnly: true,
                name: 'Date',
                icon: 'calendar',
                label: 'Placeholder Label',
                field_name: 'date_picker_',
                inline: true,
                relatedField:'',
                hidden:false,
            },
            {
                key: 'TimePicker',
                compWidth: '6',
                labelWidth:'4',
                inputWidth:'8',
                canReadOnly: true,
                name: 'Time',
                icon: 'clock',
                label: 'Placeholder Label',
                field_name: 'time_picker_',
                inline: true,
                relatedField:'',
                hidden:false,
            },
            {
                key: 'DayMonYearPicker',
                name: 'DayMonYear',
                compWidth: '12',
                labelWidth:'3',
                inputWidth:'9',
                canReadOnly: true,
                minYear: new Date().getYear()+1900-80,
                maxYear: new Date().getYear()+1900,
                icon: 'calendar',
                label: 'Placeholder Label',
                field_name: 'DayMonYear_picker_',
                inline: true,
                relatedField:'',
                hidden:false,
            },
            {
                key: 'UploadFile',
                name: 'Upload',
                compWidth: '12',
                labelWidth:'4',
                inputWidth:'8',
                icon: 'fa fa-upload',
                label: 'Placeholder Label',
                field_name: 'uploadfile_',
                addFileText: "Add File",
                allowedExtensions: '',
                multiple: true,
                dropable: true,
                inline: true,
                hidden:false,
            },{
                key: 'Image',
                name: 'Image',
                compWidth: '12',
                labelWidth:'4',
                inputWidth:'8',
                label: '',
                icon: 'image',
                field_name: 'image_',
                src: '',
                inline: true,
            }
            /*,{
             key: 'Camera',
             name: 'Camera',
             compWidth:'12',
             labelWidth:'4',
             inputWidth:'8',
             icon: 'camera',
             label: 'Placeholder Label',
             field_name: 'camera_'
             },*/
            /*{
             key: 'Download',
             name: 'Download',
             compWidth: '12',
             labelWidth:'4',
             inputWidth:'8',
             icon: 'download',
             static: true,
             content: 'Placeholder file name ...',
             file_path: '',
             _href: ''
             },
             {
             key: 'Range',
             name: 'Range',
             compWidth: '12',
             labelWidth:'4',
             inputWidth:'8',
             icon: 'sliders-h',
             label: 'Placeholder Label',
             field_name: 'range_',
             step: 1,
             defaultValue: 3,
             min_value: 1,
             max_value: 5,
             min_label: 'Easy',
             max_label: 'Difficult',
             },
             {
             key: 'Rating',
             canHaveAnswer: true,
             compWidth: '12',
             labelWidth:'4',
             inputWidth:'8',
             name: 'Rating',
             label: 'Placeholder Label',
             icon: 'star',
             field_name: 'rating_',
             inline: true,
             },{
             key: 'Signature',
             canReadOnly: true,
             compWidth:'12',
             labelWidth:'4',
             inputWidth:'8',
             name: 'Signature',
             icon: 'fa fa-pencil-square-o',
             label: 'Signature',
             field_name: 'signature_'
             }*/
        ]
    }

    create(item) {
        var elementOptions = {
            id: guid(),
            element: item.key,
            text: item.name,
            static: item.static,
        };

        if (item.key !== 'Header' && item.key !== 'Label' && item.key !== 'Paragraph' && item.key !== 'LineBreak' && item.key !== 'HyperLink' && item.key !== 'Image')
            elementOptions['required'] = false;

        if (item.field_name)
            elementOptions['field_name'] = item.field_name;// + guid()
        if (item.label)
            elementOptions['label'] = item.label;
        if (item.hasOwnProperty("relatedField"))
            elementOptions['relatedField'] = item.relatedField;

        if (item.content)
            elementOptions['content'] = item.content;
        if (item.href)
            elementOptions['href'] = item.href;
        if (item.hasOwnProperty("placeholder"))
            elementOptions['placeholder'] = item.placeholder;
        if (item.hasOwnProperty("defaultValue"))
            elementOptions['defaultValue'] = item.defaultValue;
        if (item.hasOwnProperty("minYear"))
            elementOptions['minYear'] = item.minYear;
        if (item.hasOwnProperty("maxYear"))
            elementOptions['maxYear'] = item.maxYear;
        if (item.addFileText)
            elementOptions['addFileText'] = item.addFileText;
        if (item.compWidth)
            elementOptions['compWidth'] = item.compWidth;
        if (item.labelWidth)
            elementOptions['labelWidth'] = item.labelWidth;
        if (item.inputWidth)
            elementOptions['inputWidth'] = item.inputWidth;

        if (item.static) {
            elementOptions['bold'] = false;
            elementOptions['italic'] = false;
        }
        if (item.canSplice) {
            elementOptions['canSplice'] = item.canSplice;
            elementOptions['spliceSymbol'] = "";
            elementOptions['spliceField'] = "";
        }
        if (item.supportJS) {
            elementOptions['supportJS'] = item.supportJS;
            elementOptions['onClickStr'] = "";
            elementOptions['onChangeStr'] = "";
            elementOptions['onBlurStr'] = "";
        }
        if(item.canCascadeOption){
            elementOptions['canCascadeOption'] = item.canCascadeOption;
            elementOptions['serverDictKey'] = "";
            elementOptions['cascadeField'] = "";
            elementOptions['cascadeActions'] = Toolbar._defaultItemOptions('cascadeActions');
        }
        if (item.canHaveAnswer)
            elementOptions['canHaveAnswer'] = item.canHaveAnswer;

        if (item.canReadOnly)
            elementOptions['readOnly'] = false;
        if (item.canDefaultToday)
            elementOptions['defaultToday'] = false;
        if (item.needDefault)
            elementOptions['needDefault'] =item.needDefault;
        if (item.hasOwnProperty("multiple"))
            elementOptions['multiple'] = item.multiple;
        if (item.hasOwnProperty("needName"))
            elementOptions['needName'] = item.needName;
        if (item.hasOwnProperty("dropable"))
            elementOptions['dropable'] = item.dropable;
        if (item.hasOwnProperty("creatable"))
            elementOptions['creatable'] = item.creatable;
        if (item.hasOwnProperty("clearable"))
            elementOptions['clearable'] = item.clearable;
        if (item.hasOwnProperty("inline"))
            elementOptions['inline'] = item.inline;
        if (item.hasOwnProperty("optionInline"))
            elementOptions['optionInline'] = item.optionInline;
        if (item.hasOwnProperty("hidden"))
            elementOptions['hidden'] = item.hidden;

        if (item.options)
            elementOptions['options'] = Toolbar._defaultItemOptions(elementOptions['element']);

        if (item.key === "Image") {
            elementOptions['src'] = item.src;
        } else if (item.key === "Download") {
            elementOptions['_href'] = item._href;
            elementOptions['file_path'] = item.file_path;
        } else if (item.key === "Range") {
            elementOptions['step'] = item.step;
            elementOptions['defaultValue'] = item.defaultValue;
            elementOptions['min_value'] = item.min_value;
            elementOptions['max_value'] = item.max_value;
            elementOptions['min_label'] = item.min_label;
            elementOptions['max_label'] = item.max_label;
        }

        return elementOptions;
    }

    _onClick(item) {
        this.props.createElement(this.create(item));
    }

    render() {
        return (
            <div className="react-form-builder-toolbar pull-right">
                <h4>Toolbox</h4>
                <ul className="builder-toolbar_ul">
                    {
                        this.state.items.map(item => {
                            return <ToolbarItem data={item} key={item.key} onClick={this._onClick.bind(this, item)}
                                                onCreate={this.create}/>;
                        })
                    }
                </ul>
            </div>
        )
    }
}
