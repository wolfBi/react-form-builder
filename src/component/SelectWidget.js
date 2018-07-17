import React, { Component } from 'react';
import Select, {Creatable} from 'react-select';
import PropTypes from "prop-types";

class SelectWidget extends Component {
  constructor(props){
    super(props);

    this.state = {
      value: props.value,
      options: props.options,
    };
  }
  componentWillReceiveProps(nextprops){
    this.setState({
      value: nextprops.value,
      options: nextprops.options,
    });
  }

	arrowRenderer = ()=>{
		return(<div style={{height:'30px',width:'29px','paddingRight':'0'}}>
			</div>);
	}
  onChangeHandle = (e)=>{
    let target = e && e.target ? e.target : e;
    let { onChange, name } = this.props;
    if(target === null){
      target={name,value:""}
    }
	  if(onChange){
      onChange(target);
    }
    let value = target.value;
    this.setState({
      value
    })
  }
	render(){
    let {name, styles, creatable, clearable, placeholder, disabled} = this.props;
    let { value, options } = this.state;

    if (creatable) {
        return (<Creatable name={name} style={styles} options={options} disabled={disabled}
                            clearable={clearable} value={value} onChange={this.onChangeHandle}
                            placeholder={placeholder} arrowRenderer={this.arrowRenderer}/>
          );
      } else {
          return (
              <Select name={name} style={styles} options={options} disabled={disabled}
                      clearable={clearable} value={value} onChange={this.onChangeHandle}
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
