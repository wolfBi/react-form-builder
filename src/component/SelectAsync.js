import React, {Component} from 'react';
import Select from 'react-select';
import PropTypes from "prop-types";

class SelectAsync extends Component {
	arrowRenderer(){
		return(<div style={{height:'30px',width:'29px','paddingRight':'0'}}>
			</div>);
	}

	render(){
	    let {name, styles, value, onChange, creatable, clearable, placeholder, disabled,
        loadOptions, autofocus, closeOnSelect, backspaceRemoves } = this.props;
        if (creatable) {
            return (<Select.AsyncCreatable name={name} style={styles} disabled={disabled} closeOnSelect={closeOnSelect} clearable={clearable}
                                           loadOptions={loadOptions}  value={value} onChange={onChange} backspaceRemoves={backspaceRemoves}
                                           autofocus={autofocus}  placeholder={placeholder} arrowRenderer={this.arrowRenderer}/>
            );
        } else {
            return (<Select.Async name={name} style={styles} disabled={disabled} closeOnSelect={closeOnSelect} clearable={clearable}
                                  loadOptions={loadOptions}  value={value} onChange={onChange} backspaceRemoves={backspaceRemoves}
                                  autofocus={autofocus}  placeholder={placeholder} arrowRenderer={this.arrowRenderer}/>
            );
        }
	}

    static propTypes = {
        creatable: PropTypes.bool,
        clearable: PropTypes.bool,
        placeholder: PropTypes.string
    }
    static defaultProps = {
        creatable: false,
        clearable: true,
        placeholder: "Please select"
    }
}


export default SelectAsync;
