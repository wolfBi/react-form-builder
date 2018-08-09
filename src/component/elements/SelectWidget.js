import React, {Component} from 'react';
import Select, {Creatable} from 'react-select';
import PropTypes from "prop-types";
import '../../css/react-select.css';

class SelectWidget extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: props.value,
            options: props.options,
        };
    }

    componentWillReceiveProps(nextprops) {
        this.setState({
            value: nextprops.value,
            options: nextprops.options,
        });
    }

    arrowRenderer = () => {
        return (<div style={{height: '30px', width: '29px', 'paddingRight': '0'}}>
        </div>);
    }
    onChangeHandle = (e) => {
        let target = e;
        let {onChange, name} = this.props;
        if (target === null) {
            if (onChange) {
                onChange({name, value: "", label: ""});
            }
        } else {
            if (onChange) {
                onChange(target);
            }
        }
        this.setState({
            value: target
        })
    }

    render() {
        let {name, styles, multi, creatable, clearable, placeholder, disabled} = this.props;
        let {value, options} = this.state;
        return (  <div>
            {creatable ?<Creatable name={name} style={styles} options={options} disabled={disabled} multi={multi}
                           clearable={clearable} value={value} onChange={this.onChangeHandle}
                           placeholder={placeholder} arrowRenderer={this.arrowRenderer}/>
                : <Select name={name} style={styles} options={options} disabled={disabled} multi={multi}
                        clearable={clearable} value={value} onChange={this.onChangeHandle}
                        placeholder={placeholder} arrowRenderer={this.arrowRenderer}/>
             }
            <input type="hidden" name={name} value={this.state.value}/>
         </div>
    );
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
