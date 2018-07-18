/**
 * <Toolbar />
 */

import React from 'react';
import ToolbarItem from './ToolbarDraggableItem';
import ID from './UUID';
import ElementActions from './actions/ElementActions';

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
      case "Dropdown":
        return [
          {value: '', label: '', key: 'dropdown_option_' + ID.uuid()},
          {value: '', label: '', key: 'dropdown_option_' + ID.uuid()},
          {value: '', label: '', key: 'dropdown_option_' + ID.uuid()}
        ];
      case "AsyncDropdown":
        return [
          {value: 'place_holder_tag_1', label: 'Place holder tag 1', key: 'tags_option_' + ID.uuid()},
          {value: 'place_holder_tag_2', label: 'Place holder tag 2', key: 'tags_option_' + ID.uuid()},
          {value: 'place_holder_tag_3', label: 'Place holder tag 3', key: 'tags_option_' + ID.uuid()}
        ];
      case "Checkboxes":
        return [
          {value: 'place_holder_option_1', label: 'Place holder option 1', key: 'checkboxes_option_' + ID.uuid()},
          {value: 'place_holder_option_2', label: 'Place holder option 2', key: 'checkboxes_option_' + ID.uuid()},
          {value: 'place_holder_option_3', label: 'Place holder option 3', key: 'checkboxes_option_' + ID.uuid()}
        ];
      case "RadioButtons":
        return [
          {value: 'place_holder_option_1', label: 'Place holder option 1', key: 'radiobuttons_option_' + ID.uuid()},
          {value: 'place_holder_option_2', label: 'Place holder option 2', key: 'radiobuttons_option_' + ID.uuid()},
          {value: 'place_holder_option_3', label: 'Place holder option 3', key: 'radiobuttons_option_' + ID.uuid()}
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
        icon: 'heading',
        static: true,
        content: 'Placeholder Text...'
      },
      {
        key: 'Label',
        name: 'Label',
        static: true,
        compWidth:'12',
        icon: 'font',
        content: 'Placeholder Text...'
      },
      {
        key: 'Paragraph',
        name: 'Paragraph',
        static: true,
        icon: 'paragraph',
        content: 'Placeholder Text...'
      },
      {
        key: 'LineBreak',
        name: 'Line',
        static: true,
        icon: 'arrows-alt-h'
      },
      {
        key: 'TextInput',
        canHaveAnswer: true,
        name: 'Text',
        compWidth:'12',
        label: 'Placeholder Label',
        icon: 'font',
        field_name: 'text_input_',
        supportJS:true,
        inline:true,
      },
      {
        key: 'NumberInput',
        canHaveAnswer: true,
        name: 'Number',
        compWidth:'12',
        label: 'Placeholder Label',
        icon: 'sort-numeric-up',
        field_name: 'number_input_',
        supportJS:true,
        inline:true,
      },
      {
        key: 'TextArea',
        canHaveAnswer: true,
        compWidth:'12',
        name: 'TextArea',
        label: 'Placeholder Label',
        icon: 'text-height',
        field_name: 'text_area_',
        supportJS:true,
        inline:true,
      },
      {
        key: 'Dropdown',
        canHaveAnswer: true,
        name: 'Dropdown',
        compWidth:'12',
        icon: 'caret-square-down',
        label: 'Placeholder Label',
        field_name: 'dropdown_',
        options: [],
        creatable:false,
        clearable:true,
        multiple:false,
        supportJS:true,
        inline:true,
      },
      {
        key: 'AsyncDropdown',
        canHaveAnswer: true,
        name: 'Async',
        compWidth:'12',
        icon: 'tags',
        label: 'Placeholder Label',
        field_name: 'tags_',
        loadOptionUrl: "",
        responseFeild: "data",
        labelFeild: "",
        valueFeild: "",
        creatable:true,
        clearable:true,
        multiple:true,
        supportJS:true,
        inline:true,
      },
      {
        key: 'Checkboxes',
        canHaveAnswer: true,
        name: 'Checkboxes',
        compWidth:'12',
        icon: 'check-square',
        label: 'Placeholder Label',
        field_name: 'checkboxes_',
        options: [],
        supportJS:true,
        inline:true,
        optionInline:false,
      },
      {
        key: 'RadioButtons',
        canHaveAnswer: true,
        name: 'Radio',
        compWidth:'12',
        icon: 'dot-circle',
        label: 'Placeholder Label',
        field_name: 'radio_buttons_',
        options: [],
        supportJS:true,
        inline:true,
        optionInline:false,
      },
      {
        key: 'DatePicker',
        canDefaultToday: true,
        compWidth:'12',
        canReadOnly: true,
        name: 'Date',
        icon: 'calendar',
        label: 'Placeholder Label',
        field_name: 'date_picker_',
        inline:true,
      },
      {
        key: 'TimePicker',
        compWidth:'12',
        canReadOnly: true,
        name: 'Time',
        icon: 'clock',
        label: 'Placeholder Label',
        field_name: 'time_picker_',
        inline:true,
      },
      {
        key: 'HyperLink',
        name: 'HyperLink',
        compWidth:'12',
        icon: 'link',
        static: true,
        content: 'Placeholder Web site link ...',
        href: 'http://www.example.com'
      },
      {
        key: 'Image',
        name: 'Image',
        compWidth:'12',
        label: '',
        icon: 'image',
        field_name: 'image_',
        src: '',
        inline:true,
      },
      /*{
        key: 'Camera',
        name: 'Camera',
        compWidth:'12',
        icon: 'camera',
        label: 'Placeholder Label',
        field_name: 'camera_'
      },*/
      {
        key: 'UploadFile',
        name: 'Upload',
        compWidth:'12',
        icon: 'fa fa-upload',
        label: 'Placeholder Label',
        field_name: 'uploadfile_',
        addFileText:"Add File",
        allowedExtensions:'',
        multiple: true,
        dropable: true,
        inline:true,
      },
      {
        key: 'Download',
        name: 'Download',
        compWidth:'12',
        icon: 'download',
        static: true,
        content: 'Placeholder file name ...',
        file_path: '',
        _href: ''
      },
      {
        key: 'Range',
        name: 'Range',
        compWidth:'12',
        icon: 'sliders-h',
        label: 'Placeholder Label',
        field_name: 'range_',
        step: 1,
        default_value: 3,
        min_value: 1,
        max_value: 5,
        min_label: 'Easy',
        max_label: 'Difficult',
      },
      {
        key: 'Rating',
        canHaveAnswer: true,
        compWidth:'12',
        name: 'Rating',
        label: 'Placeholder Label',
        icon: 'star',
        field_name: 'rating_',
        inline:true,
      }
      /* ,{
       key: 'Signature',
       canReadOnly: true,
       compWidth:'12',
       name: 'Signature',
       icon: 'fa fa-pencil-square-o',
       label: 'Signature',
       field_name: 'signature_'
       }*/
    ]
  }

  create(item) {
    var elementOptions = {
      id: ID.uuid(),
      element: item.key,
      text: item.name,
      static: item.static,
      required: false
    };

    if (item.static) {
      elementOptions['bold'] = false;
      elementOptions['italic'] = false;
    }

    if (item.supportJS) {
      elementOptions['supportJS'] = item.supportJS;
      elementOptions['onClickStr'] = "";
      elementOptions['onChangeStr'] = "";
      elementOptions['onBlurStr'] = "";
    }
    if (item.canHaveAnswer)
      elementOptions['canHaveAnswer'] = item.canHaveAnswer;

    if (item.canReadOnly)
      elementOptions['readOnly'] = false;

    if (item.canDefaultToday)
      elementOptions['defaultToday'] = false;

    if (item.content)
      elementOptions['content'] = item.content;

    if (item.href)
      elementOptions['href'] = item.href;

    if (item.hasOwnProperty("multiple"))
      elementOptions['multiple'] = item.multiple;
    if (item.hasOwnProperty("loadOptionUrl"))
      elementOptions['loadOptionUrl'] = item.loadOptionUrl;
    if (item.hasOwnProperty("responseFeild"))
      elementOptions['responseFeild'] = item.responseFeild;
    if (item.hasOwnProperty("labelFeild"))
      elementOptions['labelFeild'] = item.labelFeild;
    if (item.hasOwnProperty("valueFeild"))
      elementOptions['valueFeild'] = item.valueFeild;

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

    if (item.addFileText)
      elementOptions['addFileText'] = item.addFileText;

    if (item.compWidth)
      elementOptions['compWidth'] = item.compWidth;

    if (item.defaultValue)
      elementOptions['defaultValue'] = item.defaultValue;

    if (item.field_name)
      elementOptions['field_name'] = item.field_name;// + ID.uuid()

    if (item.label)
      elementOptions['label'] = item.label;

    if (item.options) {
      elementOptions['options'] = Toolbar._defaultItemOptions(elementOptions['element']);
    }

    if (item.key === "Image") {
      elementOptions['src'] = item.src;
    }else if (item.key === "Download") {
      elementOptions['_href'] = item._href;
      elementOptions['file_path'] = item.file_path;
    }else if (item.key === "Range") {
      elementOptions['step'] = item.step;
      elementOptions['default_value'] = item.default_value;
      elementOptions['min_value'] = item.min_value;
      elementOptions['max_value'] = item.max_value;
      elementOptions['min_label'] = item.min_label;
      elementOptions['max_label'] = item.max_label;
    }

    return elementOptions;
  }

  _onClick(item) {
    ElementActions.createElement(this.create(item));
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
