/**
 * <ReactFormBuilder />
 */

import React from 'react';
import Preview from './Preview'
import Toolbar from './Toolbar'

import "../css/application.css";
import "../css/form-builder-form.css";
import "../css/form-builder.css";

export default class ReactFormBuilder extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            editMode: false,
            editElement: null
        }

    }

    editModeOn = (data, e)=> {
        e.stopPropagation()
        if (this.state.editMode) {
            this.setState({editMode: !this.state.editMode, editElement: null});
        } else {
            this.setState({editMode: !this.state.editMode, editElement: data});
        }
    }

    manualEditModeOff =()=> {
        if (this.state.editMode) {
            this.setState({
                editMode: false,
                editElement: null
            });
        }
    }

    editModeOff =(e)=> {
        console.log("editModeOff")
        // TODO
        // const $menu = $("edit-form");
        // let click_is_outside_menu = (!$menu.is(e.target) && $menu.has(e.target).length === 0);

        if (this.state.editMode) {
            this.setState({
                editMode: false,
                editElement: null
            });
        }
    }

    render() {
        let toolbarProps = {};
        if (this.props.toolbarItems)
            toolbarProps.items = this.props.toolbarItems;
        return (
            <div>
                {/* <div>
                 <p>
                 It is easy to implement a sortable interface with React DnD. Just make
                 the same component both a drag source and a drop target, and reorder
                 the data in the <code>hover</code> handler.
                 </p>
                 <Container />
                 </div> */}
                <div className="react-form-builder clearfix">
                    <div>
                        <Preview parent={this} {...this.props}
                                 manualEditModeOff={this.manualEditModeOff}
                                 editModeOn={this.editModeOn}
                                 editMode={this.state.editMode}
                                 editElement={this.state.editElement}/>
                        <Toolbar {...this.props.toolbarItems} createElement={this.props.createElement}/>
                    </div>
                </div>
            </div>
        );
    }
}
