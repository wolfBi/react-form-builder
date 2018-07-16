import React, {Component} from 'react';
import TimePicker from 'rc-time-picker';
import moment from 'moment';
const format = 'hh:mm a';

class HourMinSelect extends Component {
    constructor(props) {
        super(props);
        this.fieldChange = this.fieldChange.bind(this);
        this.state={
            hideDisabledOptions:this.props.hideDisabledOptions?this.props.hideDisabledOptions:false,
            disabledMinutesInterval:this.props.disabledMinutesInterval?this.props.disabledMinutesInterval:1
        }
    }

    fieldChange(value) {
        if (this.props.onChangeHandler) {
            this.props.onChangeHandler(this.props.name, value);
        }
    }

    generateOptions = (length, excludedOptions) => {
        const arr = [];
        for (let value = 0; value < length; value++) {
            if (excludedOptions.indexOf(value) < 0) {
                arr.push(value);
            }
        }
        return arr;
    }
    disabledMinutes = (h) => {
        const arr = [];
        for (let value = 0; value < 60; value += this.state.disabledMinutesInterval) {
            arr.push(value);
        }
        return this.generateOptions(60, arr);
    }
    render() {
        let time = this.props.value !== null ? (moment.isMoment(this.props.value) ? this.props.value : moment(this.props.value, "HH:mm")) : null;
        return (
            <TimePicker name={this.props.name}
                        showSecond={false}
                        onChange={this.fieldChange}
                        format={format}
                        defaultOpenValue={moment()}
                        disabledMinutes={this.disabledMinutes}
                        hideDisabledOptions={this.state.hideDisabledOptions}
                        value={time}
                        use12Hours
            />
        );
    }
}
export default HourMinSelect;
