import React, {Component} from 'react';
import {DatePicker} from 'antd';
import moment from 'moment';

const {RangePicker} = DatePicker;

class DatePickerDouble extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    onChange(date, dateString) {
        dateString[0] = moment(new Date(dateString[0])).format('YYYY-MM-DD')
        dateString[1] = moment(new Date(dateString[1])).format('YYYY-MM-DD')
        this.props.onChange(dateString);
    }

    render() {
        let dateFormat = "YYYY-MM-DD";
        let value = null;
        if (this.props.value) {
            value = moment(this.props.value, dateFormat)
        }
        return (
            <RangePicker
                style={{width: "100%"}}
                // value={value}
                // defaultValue={value}
                format={dateFormat}
                onChange={(d, s) => this.onChange(d, s)}
            />
        );
    }
}

export default DatePickerDouble;