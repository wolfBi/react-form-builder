import React, { Component } from 'react';
import Select, {Creatable} from 'react-select';
import PropTypes from "prop-types";

class SelectWidget extends Component {
	arrowRenderer(){
		return(<div style={{height:'30px',width:'29px','paddingRight':'0'}}>
			</div>);
	}

	render(){
	    let {name, styles, options, creatable, clearable, value, onChange, placeholder, disabled} = this.props;
	    if (creatable) {
	        return (<Creatable name={name} style={styles} options={options} disabled={disabled}
                              clearable={clearable} value={value} onChange={onChange}
                              placeholder={placeholder} arrowRenderer={this.arrowRenderer}/>
            );
        } else {
            return (
                <Select name={name} style={styles} options={options} disabled={disabled}
                        clearable={clearable} value={value} onChange={onChange}
                        placeholder={placeholder} arrowRenderer={this.arrowRenderer}/>
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


export default SelectWidget;
