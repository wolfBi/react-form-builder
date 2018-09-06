import React, {Component} from 'react';
import Select from 'react-select';
import PropTypes from "prop-types";
import '../../../../components/react-select.css';
import arrowIcon from '../../../../images/arrow.png';


class SelectAsync extends Component {
    iconArrowRenderer() {
        return (<div style={{height: '30px', width: '29px', 'paddingRight': '0'}}>
            <img src={arrowIcon} alt=""/>
        </div>);
    }
    arrowRenderer() {
        return (<div style={{height: '30px', width: '29px', 'paddingRight': '0'}}>
        </div>);
    }
    render() {
        let {
            name, styles, value, onChange, creatable, clearable,showIcon, placeholder, disabled,
            loadOptions, autofocus, closeOnSelect, backspaceRemoves
        } = this.props;
        if (creatable) {
            return (<Select.AsyncCreatable name={name} style={styles} disabled={disabled} closeOnSelect={closeOnSelect}
                                           clearable={clearable}
                                           loadOptions={loadOptions} value={value} onChange={onChange}
                                           backspaceRemoves={backspaceRemoves}
                                           autofocus={autofocus} placeholder={placeholder}
                                           arrowRenderer={ showIcon? this.iconArrowRenderer:this.arrowRenderer}/>
            );
        } else {
            return (<Select.Async name={name} style={styles} disabled={disabled} closeOnSelect={closeOnSelect}
                                  clearable={clearable}
                                  loadOptions={loadOptions} value={value} onChange={onChange}
                                  backspaceRemoves={backspaceRemoves}
                                  autofocus={autofocus} placeholder={placeholder} arrowRenderer={ showIcon? this.iconArrowRenderer:this.arrowRenderer}/>
            );
        }
    }

    static propTypes = {
        creatable: PropTypes.bool,
        clearable: PropTypes.bool,
        showIcon: PropTypes.bool,
        placeholder: PropTypes.string
    }
    static defaultProps = {
        creatable: false,
        clearable: true,
        showIcon:true,
        placeholder: "Please select"
    }
}


export default SelectAsync;
