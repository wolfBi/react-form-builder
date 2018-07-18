/**
 * <ToolbarItem />
 */

import React from 'react'
import {DragSource, ConnectDragSource} from 'react-dnd'
import FA from 'react-fontawesome'
import ItemTypes from './ItemTypes'

const cardSource = {
  beginDrag(props) {
    return {
      id: '',
      index: -1,
      data: props.data,
      onCreate: props.onCreate
    }
  },
}

class ToolbarItem extends React.Component {
  render() {
    const {connectDragSource, data, onClick} = this.props;
    if (!connectDragSource) return;
    return (
      connectDragSource(
        <li onClick={onClick}><FA name={data.icon}/>{data.name}</li>
      )
    )
  }
}

export default  DragSource(ItemTypes.CARD, cardSource, (connect) => ({
  connectDragSource: connect.dragSource()
}))(ToolbarItem);