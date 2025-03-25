import React, {Component} from 'react';
import {DatePicker} from 'antd';
import moment from 'moment';


class SimpleDateSel extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    onChange(date, dateString) {
        this.props.onChange(dateString);
    }


    render() {
        let dateFormat = this.props.dateFormat ? this.props.dateFormat : "YYYY-MM-DD";
        let value = null;
        let placeholder = this.props.placeholder ? this.props.placeholder : "请选择日期"
        if (this.props.value) {
            value = moment(this.props.value, dateFormat)
        }
        return (
            <DatePicker
                placeholder={placeholder}
                style={{width: "100%"}}
                value={value}
                format={dateFormat}
                onChange={(d, s) => this.onChange(d, s)}
            />
        );
    }
}

export default SimpleDateSel