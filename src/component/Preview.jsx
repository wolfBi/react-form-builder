/**
 * <Preview />
 */

import React from 'react';
import update from 'immutability-helper';
import FormElementsEdit from './FormElementsEdit';
import SortableFormElements from './SortableFormElements';
import "../css/application.css";
import "../css/form-builder-form.css";
import "../css/form-builder.css";

export default class Preview extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: this.props.data ? this.props.data : [],
            answer_data: {}
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            data: nextProps.data
        })
    }

    _onChange = (data) => {
        let answer_data = {};
        data.forEach((item) => {
            if (item && item.hasOwnProperty("readOnly") && item.readOnly && this.props.variables[item.variableKey]) {
                answer_data[item.field_name] = this.props.variables[item.variableKey];
            }
        });

        this.setState({
            data,
            answer_data
        });
        this.props.saveData(data);
    }

    _setValue = (text) => {
        return text.replace(/[^A-Z0-9]+/ig, "_").toLowerCase();
    }

    updateElement = (element) => {
        let data = this.state.data;
        let found = false;

        for (var i = 0, len = data.length; i < len; i++) {
            if (element.id === data[i].id) {
                data[i] = element;
                found = true;
                break;
            }
        }

        if (found) {
            this.props.saveData(data);
        }
    }

    _onDestroy = (index) => {
        this.props.deleteElement(index);
    }

    insertCard = (item, hoverIndex) => {
        const {data} = this.state
        data.splice(hoverIndex, 0, item)
        this.saveData(item, hoverIndex, hoverIndex)
    }

    moveCard = (dragIndex, hoverIndex) => {
        const {data} = this.state
        const dragCard = data[dragIndex]
        this.saveData(dragCard, dragIndex, hoverIndex)
    }

    saveData = (dragCard, dragIndex, hoverIndex) => {
        const newData = update(this.state, {
            data: {
                $splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]],
            },
        });
        this.setState(newData)
        this.props.saveData(newData.data);
    }

    getElement = (item, index) => {
        if (item) {
            const SortableFormElement = SortableFormElements[item.element]
            return <SortableFormElement id={item.id} index={index} moveCard={this.moveCard} insertCard={this.insertCard}
                                        mutable={false} parent={this.props.parent} editModeOn={this.props.editModeOn}
                                        isDraggable={true} key={item.id} sortData={item.id} data={item} token={this.props.token}
                                        _onDestroy={()=>{this._onDestroy(index)}} />
        } else {
            console.log("getElement item is undefined");
        }
    }

    render() {
        let classes = this.props.className;
        if (this.props.editMode) {
            classes += ' is-editing';
        }
        let items =  this.state.data && this.state.data.map((item, index) => {
            return this.getElement(item, index);
        })
        return (
            <div className={classes}>
                <div className="edit-form">
                    { this.props.editElement !== null &&
                    <FormElementsEdit showCorrectColumn={this.props.showCorrectColumn} files={this.props.files}
                                      manualEditModeOff={this.props.manualEditModeOff} preview={this}
                                      data={this.state.data}
                                      element={this.props.editElement} updateElement={this.updateElement}/>
                    }
                </div>
                {/* <SortableContainer items={items} /> */}
                <div className="Sortable">{items}</div>
            </div>
        )
    }
}
Preview.defaultProps = {
    showCorrectColumn: false,
    files: [],
    editMode: false,
    editElement: null,
    className: 'react-form-builder-preview pull-left'
}
