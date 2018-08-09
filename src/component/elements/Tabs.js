import React, {Component} from 'react';
import PropTypes from "prop-types";
class Tabs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            clickedIndex: this.props.activeIndex,
            hoverOverIndex: -1
        };
        this.check_item_index = this.check_item_index.bind(this);
        this.check_title_index = this.check_title_index.bind(this);
    }

    componentWillReceiveProps (nextProps){
        this.setState({
            clickedIndex: nextProps.activeIndex,
            hoverOverIndex: -1
        });
    }

    check_item_index(index) {
        return index === this.state.clickedIndex ? "tab_item active" : "tab_item";
    }

    check_title_index(index) {
        let val = this.props.largeSize === true ? "tab_title_large" : "tab_title";
        if (index === this.state.clickedIndex) {
            val = this.props.largeSize === true ? "tab_title_active_large" : "tab_title_active";
        } else if (index === this.state.hoverOverIndex) {
            val = this.props.largeSize === true ? "tab_title_active_large" : "tab_title_active";
        }
        return val;
    }

    render() {
        const tabs = (
            <div className='tab_container'>
                <div className='tab_title_wrap'>
                    {React.Children.map(this.props.children, (element, index) => {
                        return (
                            <span
                                onMouseOut={() => {
                                    if (!element.props.disabled) {
                                        this.setState({hoverOverIndex: -1});
                                    }
                                }}
                                onMouseOver={() => {
                                    if (!element.props.disabled) {
                                        this.setState({hoverOverIndex: index});
                                    }
                                }}
                                onClick={ () => {
                                    if (!element.props.disabled) {
                                        this.setState({clickedIndex: index});
                                        if (typeof element.props.onClick === 'function') {
                                            element.props.onClick();
                                        }
                                    }
                                }}
                                className={this.check_title_index(index)}
                            >
                                {element.props.name}
                            </span>);
                    })}
                </div>
                <div className="tab_item_wrap">
                    {React.Children.map(this.props.children, (element, index) => {
                        return (<div className={this.check_item_index(index)}>{element.props.children}</div>);
                    })}
                </div>
            </div>
        );
        return tabs;
    }

    static propTypes = {
        activeIndex: PropTypes.number
    }
    static defaultProps = {
        activeIndex: 0
    }
}

export default Tabs;
