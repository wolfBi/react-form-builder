/**
 * <FormValidator />
 */

import React from 'react';
import xss from 'xss';
import MessagePopup from '../../../MessagePopup.js';


let myxss = new xss.FilterXSS({
    whiteList: {
        u: [],
        br: [],
        b: [],
        i: [],
        ol: ['style'],
        ul: ['style'],
        li: [],
        p: ['style'],
        sub: [],
        sup: [],
        div: ['style'],
        em: [],
        strong: [],
        span: ['style']
    }
});

export default class FormValidator extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            errors: [],
            showTips:false
        }
    }

    componentWillMount() {
        this.subscription = this.props.emitter.addListener('formValidation', errors => {
            this.setState({errors: errors,showTips: errors.length>0?true:false});
        });
    }
    componentWillUnmount() {
        this.subscription.remove();
    }

    dismissModal=()=> {
        this.setState({errors: [],showTips:false});
    }

    render() {
        let errors = this.state.errors.map((error, index) => {
            return <li key={'error_' + index} style={{whiteSpace:'nowrap'}} dangerouslySetInnerHTML={{__html: myxss.process(error)}}/>
        })
        return (
            <MessagePopup show={this.state.showTips} body={errors} closeErrorMsg={this.dismissModal}/>
        )
    }
}